/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { layanan } from "@/db/schema";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";
import { getUser } from "@/libs/auth";

/* ================= SCHEMA ================= */

export const createLayananSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  harga: z.coerce
    .number()
    .min(0, "Harga tidak boleh negatif"),
});

/* ================= PAGE ================= */

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }
  
  async function createLayanan(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      harga: formData.get("harga"),
    };

    const result = createLayananSchema.safeParse(raw);

    // ❌ VALIDASI
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

    const data = result.data;

    try {
      await db.insert(layanan).values(data);
    } catch (err) {
      console.log(err)
      return {
        errors: {
          global: "Terjadi kesalahan server",
        },
        values: raw,
      };
    }

    redirect("/layanan");
  }

  return <ClientPage onSubmit={createLayanan} />;
}