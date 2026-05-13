'use server'

import { redirect } from "next/navigation";

import { getUser } from "@/libs/auth";

import { db } from "@/db";

import {
  tagihan,
} from "@/db/schema";

import {
  sql,
} from "drizzle-orm";

import ClientPage from "./ClientPage";

export default async function Page() {

  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const startToday = new Date();

  startToday.setHours(
    0,
    0,
    0,
    0
  );

  const now = new Date();

  const startWeek = new Date(now);
  startWeek.setDate(
    now.getDate() - now.getDay()
  );

  startWeek.setHours(0, 0, 0, 0);

  const startMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  // omzet harian (30 hari terakhir)
  const last30Days = new Date(now);
  last30Days.setDate(now.getDate() - 30);
  last30Days.setHours(0, 0, 0, 0);

  // pendapatan hari ini
  const pendapatanResult =
    await db
      .select({
        total: sql<number>`
          COALESCE(
            SUM(${tagihan.total}),
            0
          )
        `,
      })
      .from(tagihan)
      .where(
        sql`
          ${tagihan.statusPembayaran}
          =
          'LUNAS'

          AND

          ${tagihan.dibuatPada}
          >=
          ${startToday}
        `
      );

  // belum lunas
  const belumBayarResult =
    await db
      .select({
        total: sql<number>`
          COUNT(*)
        `,
      })
      .from(tagihan)
      .where(
        sql`
          ${tagihan.statusPembayaran}
          !=
          'LUNAS'
        `
      );

  const statusResult =
    await db
      .select({
        proses: sql<number>`
          COUNT(*) FILTER (
            WHERE ${tagihan.status} = 'PROSES'
          )
        `,

        selesai: sql<number>`
          COUNT(*) FILTER (
            WHERE ${tagihan.status} = 'SELESAI'
          )
        `,

        hariIni: sql<number>`
          COUNT(*) FILTER (
            WHERE ${tagihan.dibuatPada}
            >=
            ${startToday}
          )
        `,
      })
      .from(tagihan);

  const summaryResult =
    await db
      .select({

        mingguIni: sql<number>`
          COALESCE(
            SUM(
              CASE
                WHEN ${tagihan.dibuatPada} >= ${startWeek}
                THEN ${tagihan.total}
                ELSE 0
              END
            ),
            0
          )
        `,

        bulanIni: sql<number>`
          COALESCE(
            SUM(
              CASE
                WHEN ${tagihan.dibuatPada} >= ${startMonth}
                THEN ${tagihan.total}
                ELSE 0
              END
            ),
            0
          )
        `,

        semuaWaktu: sql<number>`
          COALESCE(
            SUM(${tagihan.total}),
            0
          )
        `,
      })
      .from(tagihan)
      .where(
        sql`
          ${tagihan.statusPembayaran}
          =
          'LUNAS'
        `
      );

  // omzet harian untuk chart (30 hari terakhir)
  const omzetHarianResult =
    await db
      .select({
        tanggal: sql<string>`
          DATE(${tagihan.dibuatPada})
        `,
        total: sql<number>`
          COALESCE(
            SUM(${tagihan.total}),
            0
          )
        `,
      })
      .from(tagihan)
      .where(
        sql`
          ${tagihan.statusPembayaran}
          =
          'LUNAS'
          AND
          ${tagihan.dibuatPada}
          >=
          ${last30Days}
        `
      )
      .groupBy(
        sql`DATE(${tagihan.dibuatPada})`
      )
      .orderBy(
        sql`DATE(${tagihan.dibuatPada})`
      );

  const stats = {
    pendapatan:
      Number(
        pendapatanResult[0]?.total ?? 0
      ),

    belumBayar:
      Number(
        belumBayarResult[0]?.total ?? 0
      ),

    proses:
      Number(
        statusResult[0]?.proses ?? 0
      ),

    selesai:
      Number(
        statusResult[0]?.selesai ?? 0
      ),

    hariIni:
      Number(
        statusResult[0]?.hariIni ?? 0
      ),

    mingguIni:
      Number(
        summaryResult[0]?.mingguIni ?? 0
      ),

    bulanIni:
      Number(
        summaryResult[0]?.bulanIni ?? 0
      ),

    semuaWaktu:
      Number(
        summaryResult[0]?.semuaWaktu ?? 0
      ),
  };

  const omzetHarian = omzetHarianResult.map(
    (item) => ({
      tanggal: item.tanggal,
      total: Number(item.total),
    })
  );

  return (
    <ClientPage
      user={user}
      stats={stats}
      omzetHarian={omzetHarian}
    />
  );
}