/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { pengguna } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";

/* ================= QUERY ================= */

const getUser = async (id: string) => {
  const result = await db
    .select({
      id: pengguna.id,
      nama: pengguna.nama,
      username: pengguna.username,
      peran: pengguna.peran,
    })
    .from(pengguna)
    .where(eq(pengguna.id, id))
    .limit(1);

  return result[0] ?? null;
};

export type User = Awaited<ReturnType<typeof getUser>>;

/* ================= SCHEMA ================= */

const updateUserSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  username: z.string().min(3, "Username minimal 3 karakter").trim(),
  peran: z.enum(["ADMIN", "MEKANIK"]),
});

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const user = await getUser(id);
  if (!user) return notFound();

  /* ================= ACTIONS ================= */

  async function updateUser(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      username: formData.get("username"),
      peran: formData.get("peran"),
    };

    const result = updateUserSchema.safeParse(raw);

    // ❌ VALIDASI
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return {
        errors: {
          nama: errors.nama?.[0],
          username: errors.username?.[0],
          peran: errors.peran?.[0],
        },
        values: raw,
      };
    }

    const data = result.data;

    try {
      await db
        .update(pengguna)
        .set(data)
        .where(eq(pengguna.id, id));
    } catch (err: any) {
      if (err.code === "23505") {
        return {
          errors: {
            username: "Username sudah digunakan",
          },
          values: raw,
        };
      }

      return {
        errors: {
          global: "Terjadi kesalahan server",
        },
        values: raw,
      };
    }

    redirect("/pengguna");
  }

  async function deleteUser() {
    "use server";

    await db.delete(pengguna).where(eq(pengguna.id, id));
    redirect("/pengguna");
  }

  return (
    <ClientPage
      user={user}
      onSubmit={updateUser}
      onDelete={deleteUser}
    />
  );
}