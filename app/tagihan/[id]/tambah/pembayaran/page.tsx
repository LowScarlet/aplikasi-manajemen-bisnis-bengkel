'use server'

import { db } from "@/db";
import { tagihan, pembayaran } from "@/db/schema";
import { eq } from "drizzle-orm";

import ClientPage from "./ClientPage";
import { syncTagihan } from "../../page";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";

/* ================= GET DATA ================= */

const getData = async (id: string) => {
  return db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
  });
};

/* ================= ACTION ================= */

export async function addPayment(
  id: string,
  form: {
    jumlah: number;
    metode: string;
    catatan?: string;
  }
) {
  if (form.jumlah <= 0) {
    throw new Error("Jumlah tidak valid");
  }

  await db.insert(pembayaran).values({
    tagihanId: id,
    jumlah: form.jumlah,
    metode: form.metode,
    catatan: form.catatan ?? "",
  });

  await syncTagihan(id);

  return { success: true };
}

/* ================= PAGE ================= */

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

  const data = await getData(id);

  if (!data) {
    return <div>Data tidak ditemukan</div>;
  }

  return <ClientPage data={data} />;
}