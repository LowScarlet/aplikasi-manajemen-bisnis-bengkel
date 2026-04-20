'use server';

import { db } from "@/db";
import {
  pembayaran,
  statusPekerjaanEnum,
  statusPembayaranEnum,
  tagihan,
  tagihan_detail,
  tipeDetailEnum,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import ClientPage from "./ClientPage";
import { revalidatePath } from "next/cache";

/* ================= GET DETAIL ================= */

const getDetail = async (id: string) => {
  return db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
    with: {
      details: true,
      pembayaran: true,
    },
  });
};

/* ================= UPDATE INFO ================= */

export async function updateInformation(
  id: string,
  form: {
    namaCustomer: string;
    catatan: string;
  }
) {
  await db
    .update(tagihan)
    .set({
      namaCustomer: form.namaCustomer,
      catatan: form.catatan,
    })
    .where(eq(tagihan.id, id));

  revalidatePath(`/tagihan/${id}`);
  return { success: true };
}

/* ================= CHANGE STATUS ================= */

export async function changeStatus(
  id: string,
  status: typeof statusPekerjaanEnum.enumValues[number]
) {
  await db
    .update(tagihan)
    .set({ status })
    .where(eq(tagihan.id, id));

  revalidatePath(`/tagihan/${id}`);
  return { success: true };
}

/* ================= ADD ITEM ================= */

export async function addItem(
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
  const subtotal = form.qty * form.harga;

  await db.insert(tagihan_detail).values({
    tagihanId: id,
    tipe: form.tipe,
    barangId: form.barangId ?? null,
    layananId: form.layananId ?? null,
    nama: form.nama,
    qty: form.qty,
    harga: form.harga,
    subtotal,
  });

  await syncTagihan(id);
  revalidatePath(`/tagihan/${id}`);

  return { success: true };
}

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
  const subtotal = form.qty * form.harga;

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

  await syncTagihan(
    (await db.query.tagihan_detail.findFirst({
      where: eq(tagihan_detail.id, id),
    }))!.tagihanId
  );

  revalidatePath(`/tagihan`);

  return { success: true };
}

/* ================= ADD PAYMENT ================= */

export async function addPayment(
  id: string,
  form: {
    jumlah: number;
    metode: string;
    catatan: string;
  }
) {
  await db.insert(pembayaran).values({
    tagihanId: id,
    jumlah: form.jumlah,
    metode: form.metode,
    catatan: form.catatan,
  });

  await syncTagihan(id);
  revalidatePath(`/tagihan/${id}`);

  return { success: true };
}

export async function deletePayment(id: string, tagihanId: string) {
  await db
    .delete(pembayaran)
    .where(eq(pembayaran.id, id));

  await syncTagihan(tagihanId);

  revalidatePath(`/tagihan/${tagihanId}`);

  return { success: true };
}

/* ================= SYNC CORE ================= */

export async function syncTagihan(id: string) {
  /* ================= TOTAL ================= */

  const totalResult = await db
    .select({
      total: sql<number>`COALESCE(SUM(${tagihan_detail.subtotal}), 0)`,
    })
    .from(tagihan_detail)
    .where(eq(tagihan_detail.tagihanId, id));

  const total = totalResult[0]?.total ?? 0;

  /* ================= DIBAYAR ================= */

  const bayarResult = await db
    .select({
      dibayar: sql<number>`COALESCE(SUM(${pembayaran.jumlah}), 0)`,
    })
    .from(pembayaran)
    .where(eq(pembayaran.tagihanId, id));

  const dibayar = bayarResult[0]?.dibayar ?? 0;

  /* ================= KEMBALIAN ================= */

  const kembalian = dibayar > total ? dibayar - total : 0;

  /* ================= STATUS PEMBAYARAN ================= */

  let statusPembayaran: typeof statusPembayaranEnum.enumValues[number];

  if (dibayar <= 0) {
    statusPembayaran = "BELUM_BAYAR";
  } else if (dibayar >= total) {
    statusPembayaran = "LUNAS";
  } else {
    statusPembayaran = "SEBAGIAN";
  }

  /* ================= UPDATE ================= */

  await db
    .update(tagihan)
    .set({
      total,
      dibayar,
      kembalian,
      statusPembayaran,
    })
    .where(eq(tagihan.id, id));

  return {
    total,
    dibayar,
    kembalian,
    statusPembayaran,
  };
}

/* ================= SERVER ACTION ================= */

export async function syncTagihanAction(id: string) {
  await syncTagihan(id);
  revalidatePath(`/tagihan/${id}`);
}

/* ================= PAGE ================= */

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getDetail(id);

  if (!data) {
    return <div>Tagihan tidak ditemukan</div>;
  }

  return <ClientPage data={data} />;
}