/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { tagihan } from "@/db/schema";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";
import { desc, like } from "drizzle-orm";

/* ================= HELPER ================= */

function formatDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10).replace(/-/g, "");
}

/* ================= SCHEMA ================= */

const createSchema = z.object({
  namaCustomer: z.string().optional(),
  catatan: z.string().optional(),
});

/* ================= PAGE ================= */

export default function Page() {
  async function createTagihan(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      namaCustomer: formData.get("namaCustomer"),
      catatan: formData.get("catatan"),
    };

    const result = createSchema.safeParse(raw);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return {
        errors: {
          namaCustomer: errors.namaCustomer?.[0],
          catatan: errors.catatan?.[0],
        },
        values: raw,
      };
    }

    const data = result.data;

    /* ================= GENERATE KODE ================= */

    const today = formatDate(); // 20260419

    const last = await db
      .select({ kode: tagihan.kode })
      .from(tagihan)
      .where(like(tagihan.kode, `INV-${today}%`))
      .orderBy(desc(tagihan.kode))
      .limit(1);

    let nextNumber = 1;

    if (last.length > 0) {
      const lastKode = last[0].kode; // INV-20260419-003
      const lastNum = Number(lastKode.split("-")[2]);
      nextNumber = lastNum + 1;
    }

    const kode = `INV-${today}-${String(nextNumber).padStart(3, "0")}`;

    /* ================= INSERT ================= */

    const payload = {
      kode,
      namaCustomer: data.namaCustomer?.trim()
        ? data.namaCustomer
        : null,
      catatan: data.catatan?.trim()
        ? data.catatan
        : null,
    };

    let id: string;

    try {
      const out = await db
        .insert(tagihan)
        .values(payload)
        .returning({ id: tagihan.id });

      id = out[0]?.id;

      if (!id) {
        return {
          errors: { global: "Gagal membuat tagihan" },
          values: raw,
        };
      }

    } catch (err) {
      console.error("ERROR INSERT TAGIHAN:", err);

      return {
        errors: { global: "Terjadi kesalahan server" },
        values: raw,
      };
    }

    // 🔥 redirect di luar try
    redirect(`/tagihan/${id}`);
  }

  return <ClientPage onSubmit={createTagihan} />;
}