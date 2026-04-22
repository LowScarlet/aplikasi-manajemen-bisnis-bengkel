'use server';

import { db } from "@/db";
import {
  tagihan,
  tagihan_detail,
  tipeDetailEnum,
  layanan
} from "@/db/schema";

import { eq, ilike } from "drizzle-orm";

import ClientPage from "./ClientPage";
import { syncTagihan } from "../../page";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";

/* ================= GET DATA ================= */

const getDetail = async (id: string, search?: string) => {
  const data = await db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
  });

  if (!data) return null;

  // 🔥 SERVER SIDE SEARCH (sama kayak ubah)
  const layananList = await db
    .select()
    .from(layanan)
    .where(
      search
        ? ilike(layanan.nama, `%${search}%`)
        : undefined
    )
    .limit(20);

  return {
    ...data,
    layananList,
  };
};

/* ================= ACTION ================= */

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
  if (form.qty <= 0 || form.harga < 0) {
    throw new Error("Qty / harga tidak valid");
  }

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

  return { success: true };
}

/* ================= PAGE ================= */

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const { search } = await searchParams;

  const data = await getDetail(id, search);

  if (!data) {
    return <div>Tagihan tidak ditemukan</div>;
  }

  return <ClientPage data={data} />;
}