'use server'

import { db } from "@/db";
import { cicilan, tagihan } from "@/db/schema";
import { eq, and } from "drizzle-orm";

import ClientPage from "./ClientPage";
import { syncTagihan } from "../../../page";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";

/* ================= GET DATA ================= */

const getData = async (id: string, pembayaranId: string) => {
  const payment = await db.query.cicilan.findFirst({
    where: and(
      eq(cicilan.id, pembayaranId),
      eq(cicilan.tagihanId, id)
    ),
  });

  if (!payment) return null;

  const data = await db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
  });

  if (!data) return null;

  return { data, payment };
};

/* ================= ACTION ================= */

export async function updatePayment(
  pembayaranId: string,
  form: {
    jumlah: number;
    catatan?: string;
  }
) {
  if (form.jumlah <= 0) {
    throw new Error("Jumlah tidak valid");
  }

  await db
    .update(cicilan)
    .set({
      jumlah: form.jumlah,
      catatan: form.catatan ?? "",
    })
    .where(eq(cicilan.id, pembayaranId));

  const payment = await db.query.cicilan.findFirst({
    where: eq(cicilan.id, pembayaranId),
  });

  if (!payment) throw new Error("Cicilan tidak ditemukan");

  await syncTagihan(payment.tagihanId);

  return { success: true };
}

export async function deletePayment(pembayaranId: string) {
  const payment = await db.query.cicilan.findFirst({
    where: eq(cicilan.id, pembayaranId),
  });

  if (!payment) {
    throw new Error("Cicilan tidak ditemukan");
  }

  await db
    .delete(cicilan)
    .where(eq(cicilan.id, pembayaranId));

  await syncTagihan(payment.tagihanId);

  return { success: true };
}

/* ================= PAGE ================= */

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; pembayaranId: string }>;
}) {
  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }

  const { id, pembayaranId } = await params;

  const result = await getData(id, pembayaranId);

  if (!result) {
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <ClientPage
      data={result.data}
      payment={result.payment}
    />
  );
}