'use server'

import { db } from "@/db";
import {
  tagihan
} from "@/db/schema";

import { eq } from "drizzle-orm";

import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";
import { getDetail } from "../page";

export async function updateTagihan(
  id: string,
  form: {
    ongkos: number;
    diskon: number;
  }
) {
  await db
    .update(tagihan)
    .set({
      ongkos: form.ongkos,
      diskon: form.diskon
    })
    .where(eq(tagihan.id, id));

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
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <ClientPage
      data={data}
    />
  );
}