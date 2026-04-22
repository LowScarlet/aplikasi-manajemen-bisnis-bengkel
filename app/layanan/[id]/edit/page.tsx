/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { layanan } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";
import { getUser } from "@/libs/auth";

/* ================= QUERY ================= */

const getLayanan = async (id: string) => {
  const result = await db
    .select({
      id: layanan.id,
      nama: layanan.nama,
      harga: layanan.harga,
    })
    .from(layanan)
    .where(eq(layanan.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ================= TYPE ================= */

export type Layanan = Awaited<ReturnType<typeof getLayanan>>;

/* ================= SCHEMA ================= */

const updateSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  harga: z.coerce.number().min(0, "Harga tidak boleh negatif"),
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

  const data = await getLayanan(id);
  if (!data) return notFound();

  /* ================= ACTION ================= */

  async function updateLayanan(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      harga: formData.get("harga"),
    };

    const result = updateSchema.safeParse(raw);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return {
        errors: {
          nama: errors.nama?.[0],
          harga: errors.harga?.[0],
        },
        values: raw,
      };
    }

    try {
      await db
        .update(layanan)
        .set(result.data)
        .where(eq(layanan.id, id));
    } catch {
      return {
        errors: {
          global: "Terjadi kesalahan server",
        },
        values: raw,
      };
    }

    redirect("/layanan");
  }

  async function deleteLayanan() {
    "use server";

    await db.delete(layanan).where(eq(layanan.id, id));
    redirect("/layanan");
  }

  return (
    <ClientPage
      layanan={data}
      onSubmit={updateLayanan}
      onDelete={deleteLayanan}
    />
  );
}