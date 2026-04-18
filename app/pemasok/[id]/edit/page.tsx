/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { supplier } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";

/* ================= QUERY ================= */

const getSupplier = async (id: string) => {
  const result = await db
    .select({
      id: supplier.id,
      nama: supplier.nama,
      telepon: supplier.telepon,
      alamat: supplier.alamat,
    })
    .from(supplier)
    .where(eq(supplier.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ================= TYPE ================= */

export type Supplier = Awaited<ReturnType<typeof getSupplier>>;

/* ================= SCHEMA ================= */

const updateSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  telepon: z.string().optional(),
  alamat: z.string().optional(),
});

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getSupplier(id);
  if (!data) return notFound();

  /* ================= ACTION ================= */

  async function updateSupplier(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      telepon: formData.get("telepon"),
      alamat: formData.get("alamat"),
    };

    const result = updateSchema.safeParse(raw);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return {
        errors: {
          nama: errors.nama?.[0],
          telepon: errors.telepon?.[0],
          alamat: errors.alamat?.[0],
        },
        values: raw,
      };
    }

    const payload = {
      nama: result.data.nama,
      // normalize kosong → null
      telepon: result.data.telepon?.trim()
        ? result.data.telepon
        : null,
      alamat: result.data.alamat?.trim()
        ? result.data.alamat
        : null,
    };

    try {
      await db
        .update(supplier)
        .set(payload)
        .where(eq(supplier.id, id));
    } catch {
      return {
        errors: {
          global: "Terjadi kesalahan server",
        },
        values: raw,
      };
    }

    redirect("/pemasok");
  }

  async function deleteSupplier() {
    "use server";

    await db.delete(supplier).where(eq(supplier.id, id));
    redirect("/pemasok");
  }

  return (
    <ClientPage
      supplier={data}
      onSubmit={updateSupplier}
      onDelete={deleteSupplier}
    />
  );
}