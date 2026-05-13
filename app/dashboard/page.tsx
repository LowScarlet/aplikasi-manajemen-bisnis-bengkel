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

  startWeek.setHours(
    0,
    0,
    0,
    0
  );

  const startMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const last30Days = new Date(now);

  last30Days.setDate(
    now.getDate() - 30
  );

  last30Days.setHours(
    0,
    0,
    0,
    0
  );

  // minggu lalu
  const previousWeekStart = new Date(startWeek);

  previousWeekStart.setDate(
    startWeek.getDate() - 7
  );

  // bulan lalu
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );

  function getGrowth(
    current: number,
    previous: number
  ) {

    if (previous === 0) {
      return {
        naik: current > 0,
        persen: 100,
      };
    }

    const diff =
      (
        (current - previous)
        /
        previous
      ) * 100;

    return {
      naik: diff >= 0,
      persen: Math.abs(diff).toFixed(1),
    };
  }

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

  // status
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

  // ringkasan omzet
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

        mingguLalu: sql<number>`
          COALESCE(
            SUM(
              CASE
                WHEN ${tagihan.dibuatPada} >= ${previousWeekStart}
                AND ${tagihan.dibuatPada} < ${startWeek}
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

        bulanLalu: sql<number>`
          COALESCE(
            SUM(
              CASE
                WHEN ${tagihan.dibuatPada} >= ${previousMonthStart}
                AND ${tagihan.dibuatPada} <= ${previousMonthEnd}
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

  // grafik omzet
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
        sql`
          DATE(${tagihan.dibuatPada})
        `
      )
      .orderBy(
        sql`
          DATE(${tagihan.dibuatPada})
        `
      );

  // growth
  const growthMinggu =
    getGrowth(
      Number(
        summaryResult[0]?.mingguIni ?? 0
      ),
      Number(
        summaryResult[0]?.mingguLalu ?? 0
      )
    );

  const growthBulan =
    getGrowth(
      Number(
        summaryResult[0]?.bulanIni ?? 0
      ),
      Number(
        summaryResult[0]?.bulanLalu ?? 0
      )
    );

  // label
  const mingguLabel =
    `${startWeek.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })}`;

  const bulanLabel =
    now.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

  // stats
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

    mingguLabel,
    bulanLabel,

    mingguGrowth: growthMinggu,
    bulanGrowth: growthBulan,
  };

  // chart
  const omzetHarian =
    omzetHarianResult.map(
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