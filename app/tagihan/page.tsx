import { db } from "@/db";
import { tagihan } from "@/db/schema";

import {
  ilike,
  or,
  desc,
  sql,
  asc,
  and,
  gte,
  lte,
} from "drizzle-orm";

import ClientPage from "./ClientPage";

import { getUser } from "@/libs/auth";

import { redirect } from "next/navigation";

const getTagihan = async (
  q: string,
  page: number,
  filter: string,
  tanggal?: string,
) => {

  const limit = 10;

  const offset =
    (page - 1) * limit;

  const conditions = [];

  // search
  if (q) {

    conditions.push(
      or(
        ilike(
          tagihan.kode,
          `%${q}%`
        ),

        ilike(
          tagihan.namaCustomer,
          `%${q}%`
        )
      )
    );

  }

  // filter hari ini
  if (filter === "today") {

    const startToday = new Date();

    startToday.setHours(
      0,
      0,
      0,
      0
    );

    conditions.push(
      gte(
        tagihan.dibuatPada,
        startToday
      )
    );

  }

  // filter tanggal
  if (tanggal) {

    const startDate =
      new Date(tanggal);

    startDate.setHours(
      0,
      0,
      0,
      0
    );

    const endDate =
      new Date(tanggal);

    endDate.setHours(
      23,
      59,
      59,
      999
    );

    conditions.push(
      and(
        gte(
          tagihan.dibuatPada,
          startDate
        ),

        lte(
          tagihan.dibuatPada,
          endDate
        )
      )
    );

  }

  return db
    .select({

      id: tagihan.id,

      kode: tagihan.kode,

      namaCustomer:
        tagihan.namaCustomer,

      catatan:
        tagihan.catatan,

      total:
        tagihan.total,

      dibayar:
        tagihan.dibayar,

      status:
        tagihan.status,

      statusPembayaran:
        tagihan.statusPembayaran,

      dibuatPada:
        tagihan.dibuatPada,
    })

    .from(tagihan)

    .where(
      conditions.length > 0
        ? and(...conditions)
        : undefined
    )

    .orderBy(

      asc(sql`
        CASE
          WHEN ${tagihan.statusPembayaran} = 'BELUM_BAYAR' THEN 1
          WHEN ${tagihan.statusPembayaran} = 'SEBAGIAN' THEN 2
          WHEN ${tagihan.statusPembayaran} = 'LUNAS' THEN 3
          ELSE 99
        END
      `),

      desc(tagihan.dibuatPada)
    )

    .limit(limit)

    .offset(offset);
};

export type Tagihan =
  Awaited<
    ReturnType<typeof getTagihan>
  >[number];

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    filter?: string;
    tanggal?: string;
  }>;
};

export default async function Page({
  searchParams
}: Props) {

  const userauth =
    await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }

  const params =
    await searchParams;

  const q =
    params.q ?? "";

  const page =
    Math.max(
      1,
      Number(
        params.page ?? "1"
      ) || 1
    );

  const filter =
    params.filter ?? "all";

  const tanggal =
    params.tanggal;

  const data =
    await getTagihan(
      q,
      page,
      filter,
      tanggal
    );

  return (
    <ClientPage
      data={data}
      initialSearch={q}
      currentPage={page}
    />
  );
}