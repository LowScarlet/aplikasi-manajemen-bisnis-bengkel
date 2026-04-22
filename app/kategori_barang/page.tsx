import { db } from "@/db";
import { kategori } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";
import { redirect } from "next/navigation";

/* ================= QUERY ================= */

const getKategori = async (q: string, page: number) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  return db
    .select({
      id: kategori.id,
      kode: kategori.kode,
      nama: kategori.nama,
    })
    .from(kategori)
    .where(
      q
        ? or(
          ilike(kategori.nama, `%${q}%`),
          ilike(kategori.kode, `%${q}%`)
        )
        : undefined
    )
    .limit(limit)
    .offset(offset);
};

/* ================= TYPE ================= */

export type Kategori = Awaited<ReturnType<typeof getKategori>>[number];

/* ================= PAGE ================= */

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;

  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const data = await getKategori(q, page);

  return (
    <ClientPage
      kategori={data}
      initialSearch={q}
      currentPage={page}
    />
  );
}