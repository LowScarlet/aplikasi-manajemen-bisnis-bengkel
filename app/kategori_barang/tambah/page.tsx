/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { kategori } from "@/db/schema";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";

/* ================= SCHEMA ================= */

const createSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  kode: z.string().optional(),
});

/* ================= PAGE ================= */

export default function Page() {
  async function createKategori(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      kode: formData.get("kode"),
    };

    const result = createSchema.safeParse(raw);

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

    const data = result.data;

    // 🔥 normalize kode kosong → null
    const payload = {
      nama: data.nama,
      kode: data.kode?.trim() ? data.kode : null,
    };

    try {
      await db.insert(kategori).values(payload);
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

  return <ClientPage onSubmit={createKategori} />;
}