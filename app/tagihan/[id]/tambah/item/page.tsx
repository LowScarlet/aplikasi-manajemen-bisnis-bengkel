// page.tsx

'use server';

import { db } from "@/db";

import {
  tagihan,
  tagihan_detail,
} from "@/db/schema";

import { eq } from "drizzle-orm";

import ClientPage from "./ClientPage";

import { syncTagihan } from "../../page";

import { getUser } from "@/libs/auth";

import { redirect } from "next/navigation";

const getDetail = async (id: string) => {

  const data = await db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
  });

  if (!data) return null;

  return data;
};

export async function addItems(
  id: string,
  items: {
    nama: string;
    qty: number;
    harga: number;
  }[],
  ongkos: number
) {

  if (!items.length) {
    throw new Error("Item kosong");
  }

  const values = items.map((item) => {

    if (item.qty <= 0 || item.harga < 0) {
      throw new Error("Qty / harga tidak valid");
    }

    return {
      tagihanId: id,
      tipe: "CUSTOM" as const,
      nama: item.nama,
      qty: item.qty,
      harga: item.harga,
      subtotal: item.qty * item.harga,
    };
  });

  await db.insert(tagihan_detail).values(values);

  if (ongkos > 0) {
    await db
      .update(tagihan)
      .set({ ongkos })
      .where(eq(tagihan.id, id));
  }

  await syncTagihan(id);

  return {
    success: true,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }

  const { id } = await params;

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