import { db } from "@/db";
import { layanan } from "@/db/schema";
import { ilike } from "drizzle-orm";
import ClientPage from "./ClientPage";

/* ================= QUERY ================= */

const getLayanan = async (q: string, page: number) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  return db
    .select({
      id: layanan.id,
      nama: layanan.nama,
      harga: layanan.harga,
    })
    .from(layanan)
    .where(
      q
        ? ilike(layanan.nama, `%${q}%`)
        : undefined
    )
    .limit(limit)
    .offset(offset);
};

/* ================= TYPE ================= */

export type Layanan = Awaited<ReturnType<typeof getLayanan>>[number];

/* ================= PAGE ================= */

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const data = await getLayanan(q, page);

  return (
    <ClientPage
      layanan={data}
      initialSearch={q}
      currentPage={page}
    />
  );
}