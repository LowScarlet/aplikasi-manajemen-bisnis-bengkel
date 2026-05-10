'use server';

import { db } from "@/db";
import {
  cicilan,
  statusPekerjaanEnum,
  statusPembayaranEnum,
  tagihan,
  tagihan_detail,
} from "@/db/schema";

import { desc, eq, sql } from "drizzle-orm";
import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";

const getDetail = async (id: string) => {
  const data = await db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),

    with: {
      mekanik: true,
    },
  });

  if (!data) return null;

  const details = await db
    .select()
    .from(tagihan_detail)
    .where(eq(tagihan_detail.tagihanId, id))
    .orderBy(
      desc(tagihan_detail.dibuatPada)
    );

  const cicilanList = await db
    .select()
    .from(cicilan)
    .where(eq(cicilan.tagihanId, id))
    .orderBy(
      desc(cicilan.dibuatPada)
    );

  return {
    ...data,
    details,
    cicilan: cicilanList,
  };
};

export async function syncTagihan(
  id: string
) {

  const subtotalResult = await db
    .select({
      subtotal: sql<number>`
        COALESCE(
          SUM(${tagihan_detail.subtotal}),
          0
        )
      `,
    })
    .from(tagihan_detail)
    .where(
      eq(tagihan_detail.tagihanId, id)
    );

  const subtotal = Number(
    subtotalResult[0]?.subtotal ?? 0
  );

  const currentTagihan =
    await db.query.tagihan.findFirst({
      where: eq(tagihan.id, id),

      columns: {
        ongkos: true,
        diskon: true,
        metodePembayaran: true,
        statusPembayaran: true,
        dibayar: true,
      },
    });

  const ongkos = Number(
    currentTagihan?.ongkos ?? 0
  );

  const diskon = Number(
    currentTagihan?.diskon ?? 0
  );

  const total = Math.max(
    0,
    subtotal + ongkos - diskon
  );

  let dibayar =
    Number(
      currentTagihan?.dibayar ?? 0
    );

  let statusPembayaran:
    typeof statusPembayaranEnum.enumValues[number] =
      currentTagihan?.statusPembayaran ??
      "BELUM_BAYAR";

  // KHUSUS CICIL
  if (
    currentTagihan?.metodePembayaran ===
    "CICIL"
  ) {

    const bayarResult = await db
      .select({
        dibayar: sql<number>`
          COALESCE(
            SUM(${cicilan.jumlah}),
            0
          )
        `,
      })
      .from(cicilan)
      .where(
        eq(cicilan.tagihanId, id)
      );

    dibayar = Number(
      bayarResult[0]?.dibayar ?? 0
    );

    if (dibayar <= 0) {
      statusPembayaran =
        "BELUM_BAYAR";

    } else if (dibayar >= total) {
      statusPembayaran =
        "LUNAS";

    } else {
      statusPembayaran =
        "SEBAGIAN";
    }
  }

  const kembalian =
    dibayar > total
      ? dibayar - total
      : 0;

  await db
    .update(tagihan)
    .set({
      subtotal,
      total,
      dibayar,
      kembalian,
      statusPembayaran,
    })
    .where(
      eq(tagihan.id, id)
    );

  return {
    subtotal,
    ongkos,
    diskon,
    total,
    dibayar,
    kembalian,
    statusPembayaran,
  };
}

export async function updateStatusTagihan(
  id: string,
  status:
    typeof statusPekerjaanEnum.enumValues[number]
) {
  await db
    .update(tagihan)
    .set({ status })
    .where(
      eq(tagihan.id, id)
    );
}

export async function updateStatusPembayaranTagihan(
  id: string,
  statusPembayaran:
    typeof statusPembayaranEnum.enumValues[number]
) {
  const data = await db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
    columns: {
      metodePembayaran: true,
    },
  });

  if (
    data?.metodePembayaran === "CICIL"
  ) {
    throw new Error(
      "Status pembayaran cicilan otomatis"
    );
  }

  await db
    .update(tagihan)
    .set({ statusPembayaran })
    .where(
      eq(tagihan.id, id)
    );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const userauth = await getUser();

  if (!userauth) {
    redirect(`/tagihan/${id}/kuitansi`);
  }

  const data = await getDetail(id);

  if (!data) {
    return (
      <div>
        Tagihan tidak ditemukan
      </div>
    );
  }

  return (
    <ClientPage data={data} />
  );
}