import { db } from "@/db";
import { kategori } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

/* ================= QUERY ================= */

const getKategori = async (id: string) => {
  const result = await db
    .select({
      id: kategori.id,
      nama: kategori.nama,
      kode: kategori.kode,
    })
    .from(kategori)
    .where(eq(kategori.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ================= TYPE ================= */

export type Kategori = Awaited<ReturnType<typeof getKategori>>;

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getKategori(id);

  if (!data) {
    notFound();
  }

  return <ClientPage kategori={data} />;
}