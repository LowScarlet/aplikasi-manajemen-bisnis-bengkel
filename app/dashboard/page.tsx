'use server'

import { redirect } from "next/navigation";
import { getUser } from "@/libs/auth";
import { db } from "@/db";
import { tagihan } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

import ClientPage from "./ClientPage";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  /* ================= STATS ================= */

  // total pendapatan (yang lunas)
  const pendapatanResult = await db
    .select({
      total: sql<number>`COALESCE(SUM(${tagihan.total}), 0)`,
    })
    .from(tagihan)
    .where(eq(tagihan.statusPembayaran, "LUNAS"));

  const pendapatan = pendapatanResult[0]?.total ?? 0;

  // jumlah tagihan belum bayar
  const belumBayarResult = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(tagihan)
    .where(eq(tagihan.statusPembayaran, "BELUM_BAYAR"));

  const belumBayar = belumBayarResult[0]?.count ?? 0;

  return (
    <ClientPage
      user={user}
      stats={{
        pendapatan,
        belumBayar,
      }}
    />
  );
}