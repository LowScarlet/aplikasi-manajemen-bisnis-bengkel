import { db } from "@/db";
import { supplier } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import ClientPage from "./ClientPage";

/* ================= QUERY ================= */

const getSupplier = async (q: string, page: number) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  return db
    .select({
      id: supplier.id,
      nama: supplier.nama,
      telepon: supplier.telepon,
    })
    .from(supplier)
    .where(
      q
        ? or(
            ilike(supplier.nama, `%${q}%`),
            ilike(supplier.telepon, `%${q}%`)
          )
        : undefined
    )
    .limit(limit)
    .offset(offset);
};

/* ================= TYPE ================= */

export type Supplier = Awaited<ReturnType<typeof getSupplier>>[number];

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

  const data = await getSupplier(q, page);

  return (
    <ClientPage
      supplier={data}
      initialSearch={q}
      currentPage={page}
    />
  );
}