import { db } from "@/db";
import { tagihan } from "@/db/schema";
import { ilike, or, desc, sql, asc } from "drizzle-orm";
import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";

/* ================= QUERY ================= */

const getTagihan = async (q: string, page: number) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  return db
    .select({
      id: tagihan.id,
      kode: tagihan.kode,
      namaCustomer: tagihan.namaCustomer,
      catatan: tagihan.catatan,
      total: tagihan.total,
      dibayar: tagihan.dibayar,
      status: tagihan.status,
      statusPembayaran: tagihan.statusPembayaran,
      dibuatPada: tagihan.dibuatPada,
    })
    .from(tagihan)
    .where(
      q
        ? or(
          ilike(tagihan.kode, `%${q}%`),
          ilike(tagihan.namaCustomer, `%${q}%`)
        )
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

/* ================= TYPE ================= */

export type Tagihan = Awaited<ReturnType<typeof getTagihan>>[number];

/* ================= PAGE ================= */

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }
  
  const params = await searchParams;

  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const data = await getTagihan(q, page);

  return (
    <ClientPage
      data={data}
      initialSearch={q}
      currentPage={page}
    />
  );
}