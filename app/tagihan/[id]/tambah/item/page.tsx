'use server';

import { db } from "@/db";
import {
  tagihan,
  tagihan_detail,
  tipeDetailEnum
} from "@/db/schema";
import { eq } from "drizzle-orm";
import ClientPage from "./ClientPage";
import { syncTagihan } from "../../page";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";

const getDetail = async (id: string) => {
  return db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
  });
};

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

  return { success: true };
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
    return <div>Tagihan tidak ditemukan</div>;
  }

  return <ClientPage data={data} />;
}