/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { supplier } from "@/db/schema";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";
import { getUser } from "@/libs/auth";

/* ================= SCHEMA ================= */

const createSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  telepon: z.string().optional(),
  alamat: z.string().optional(),
});

/* ================= PAGE ================= */

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }
  
  async function createSupplier(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      telepon: formData.get("telepon"),
      alamat: formData.get("alamat"),
    };

    const result = createSchema.safeParse(raw);

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

    const data = result.data;

    // normalize kosong → null (biar DB bersih, bukan penuh "")
    const payload = {
      nama: data.nama,
      telepon: data.telepon?.trim() ? data.telepon : null,
      alamat: data.alamat?.trim() ? data.alamat : null,
    };

    try {
      await db.insert(supplier).values(payload);
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

  return <ClientPage onSubmit={createSupplier} />;
}