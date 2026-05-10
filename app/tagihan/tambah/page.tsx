/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { tagihan } from "@/db/schema";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";
import { desc, like } from "drizzle-orm";
import { getUser } from "@/libs/auth";

function formatDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10).replace(/-/g, "");
}

const createSchema = z.object({
  namaCustomer: z.string().optional(),
  catatan: z.string().optional(),
});

async function generateKode() {
  const today = formatDate();

  const last = await db
    .select({
      kode: tagihan.kode,
    })
    .from(tagihan)
    .where(
      like(
        tagihan.kode,
        `INV-${today}%`
      )
    )
    .orderBy(
      desc(tagihan.kode)
    )
    .limit(1);

  let nextNumber = 1;

  if (last.length > 0) {
    const lastKode =
      last[0].kode;

    const lastNum = Number(
      lastKode.split("-")[2]
    );

    nextNumber = lastNum + 1;
  }

  return `INV-${today}-${String(
    nextNumber
  ).padStart(3, "0")}`;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    cepat?: string;
  }>;
}) {

  const params = await searchParams;

  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }

  if ("cepat" in params) {
    const kode =
      await generateKode();

    const out = await db
      .insert(tagihan)
      .values({
        kode,
        namaCustomer:
          `Customer ${kode}`,
        catatan: null,
      })
      .returning({
        id: tagihan.id,
      });

    const id = out[0]?.id;

    if (!id) {
      throw new Error(
        "Gagal membuat tagihan"
      );
    }

    redirect(`/tagihan/${id}`);
  }

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

    const kode =
      await generateKode();

    const payload = {
      kode,
      namaCustomer: data.namaCustomer?.trim()
        ? data.namaCustomer
        : `Customer ${kode}`,

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

    redirect(`/tagihan/${id}`);
  }

  return <ClientPage onSubmit={createTagihan} />;
}