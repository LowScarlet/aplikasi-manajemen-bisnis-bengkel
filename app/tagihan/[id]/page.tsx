'use server';

import { db } from "@/db";
import {
  pembayaran, statusPembayaranEnum,
  tagihan,
  tagihan_detail
} from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import ClientPage from "./ClientPage";

/* ================= GET DETAIL ================= */

const getDetail = async (id: string) => {
  // ================= TAGIHAN =================
  const data = await db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
  });

  if (!data) return null;

  // ================= DETAILS =================
  const details = await db
    .select()
    .from(tagihan_detail)
    .where(eq(tagihan_detail.tagihanId, id))
    .orderBy(
      sql`
        CASE
          WHEN ${tagihan_detail.tipe} = 'BARANG' THEN 1
          WHEN ${tagihan_detail.tipe} = 'CUSTOM' THEN 2
          WHEN ${tagihan_detail.tipe} = 'LAYANAN' THEN 3
          ELSE 99
        END
      `,
      asc(tagihan_detail.id)
    );

  // ================= PEMBAYARAN =================
  const pembayaranList = await db
    .select()
    .from(pembayaran)
    .where(eq(pembayaran.tagihanId, id))
    .orderBy(desc(pembayaran.dibuatPada));

  return {
    ...data,
    details,
    pembayaran: pembayaranList,
  };
};

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