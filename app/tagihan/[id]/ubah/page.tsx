'use server';

import { db } from "@/db";
import {
  statusPekerjaanEnum,
  statusPembayaranEnum,
  tagihan
} from "@/db/schema";
import { eq } from "drizzle-orm";
import ClientPage from "./ClientPage";
import { revalidatePath } from "next/cache";

const getDetail = async (id: string) => {
  return db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
  });
};

export async function updateTagihan(
  id: string,
  form: {
    namaCustomer: string;
    catatan: string;
    status: typeof statusPekerjaanEnum.enumValues[number];
    statusPembayaran: typeof statusPembayaranEnum.enumValues[number];
  }
) {
  await db
    .update(tagihan)
    .set({
      namaCustomer: form.namaCustomer,
      catatan: form.catatan,
      status: form.status,
      statusPembayaran: form.statusPembayaran,
    })
    .where(eq(tagihan.id, id));

  revalidatePath(`/tagihan/${id}`);

  return { success: true };
}

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