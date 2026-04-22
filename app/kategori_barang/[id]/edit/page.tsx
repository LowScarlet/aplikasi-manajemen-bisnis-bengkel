/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { kategori } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";
import { getUser } from "@/libs/auth";

/* ================= QUERY ================= */

const getKategori = async (id: string) => {
  const result = await db
    .select({
      id: kategori.id,
      nama: kategori.nama,
      kode: kategori.kode,
    })
    .from(kategori)
    .where(eq(kategori.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ================= TYPE ================= */

export type Kategori = Awaited<ReturnType<typeof getKategori>>;

/* ================= SCHEMA ================= */

const updateSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  kode: z.string().optional(),
});

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }
  
  const { id } = await params;

  const data = await getKategori(id);
  if (!data) return notFound();

  /* ================= ACTION ================= */

  async function updateKategori(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      kode: formData.get("kode"),
    };

    const result = updateSchema.safeParse(raw);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return {
        errors: {
          nama: errors.nama?.[0],
          kode: errors.kode?.[0],
        },
        values: raw,
      };
    }

    const payload = {
      nama: result.data.nama,
      // 🔥 penting: empty string → null
      kode: result.data.kode?.trim() ? result.data.kode : null,
    };

    try {
      await db
        .update(kategori)
        .set(payload)
        .where(eq(kategori.id, id));
    } catch (err: any) {
      if (err.code === "23505") {
        return {
          errors: {
            kode: "Kode sudah digunakan",
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

    redirect("/kategori_barang");
  }

  async function deleteKategori() {
    "use server";

    await db.delete(kategori).where(eq(kategori.id, id));
    redirect("/kategori");
  }

  return (
    <ClientPage
      kategori={data}
      onSubmit={updateKategori}
      onDelete={deleteKategori}
    />
  );
}