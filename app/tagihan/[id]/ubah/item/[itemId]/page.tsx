'use server'

import { db } from "@/db";
import { tagihan, tagihan_detail, tipeDetailEnum } from "@/db/schema";
import { eq, and } from "drizzle-orm";

import ClientPage from "./ClientPage";
import { syncTagihan } from "../../../page";

/* ================= GET DATA ================= */

const getData = async (id: string, itemId: string) => {
  // ambil item + pastikan dia milik tagihan yang benar
  const item = await db.query.tagihan_detail.findFirst({
    where: and(
      eq(tagihan_detail.id, itemId),
      eq(tagihan_detail.tagihanId, id)
    ),
  });

  if (!item) return null;

  // ambil tagihan
  const data = await db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
    with: {
      details: true,
    },
  });

  if (!data) return null;

  // ambil layanan (buat dropdown)
  const layananList = await db.query.layanan.findMany();

  return {
    data: {
      ...data,
      layananList,
    },
    item,
  };
};

export async function updateItem(
  id: string,
  form: {
    tipe: typeof tipeDetailEnum.enumValues[number];
    barangId?: string | null;
    layananId?: string | null;
    nama: string;
    qty: number;
    harga: number;
  }
) {
  // validasi basic (biar tidak kirim sampah ke DB)
  if (form.qty <= 0 || form.harga < 0) {
    throw new Error("Qty / harga tidak valid");
  }

  const subtotal = form.qty * form.harga;

  // update item
  await db
    .update(tagihan_detail)
    .set({
      tipe: form.tipe,
      barangId: form.barangId ?? null,
      layananId: form.layananId ?? null,
      nama: form.nama,
      qty: form.qty,
      harga: form.harga,
      subtotal,
    })
    .where(eq(tagihan_detail.id, id));

  // ambil tagihanId (jangan asumsi, ambil langsung)
  const item = await db.query.tagihan_detail.findFirst({
    where: eq(tagihan_detail.id, id),
  });

  if (!item) {
    throw new Error("Item tidak ditemukan setelah update. Aneh, tapi mungkin.");
  }

  // sync total + pembayaran
  await syncTagihan(item.tagihanId);

  return { success: true };
}

export async function deleteItem(id: string) {
  // ambil dulu item (buat tahu tagihanId)
  const item = await db.query.tagihan_detail.findFirst({
    where: eq(tagihan_detail.id, id),
  });

  if (!item) {
    throw new Error("Item tidak ditemukan");
  }

  await db
    .delete(tagihan_detail)
    .where(eq(tagihan_detail.id, id));

  await syncTagihan(item.tagihanId);

  return { success: true };
}

/* ================= PAGE ================= */

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;

  const result = await getData(id, itemId);

  if (!result) {
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <ClientPage
      data={result.data}
      item={result.item}
    />
  );
}