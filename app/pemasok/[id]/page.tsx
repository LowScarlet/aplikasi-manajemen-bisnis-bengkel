import { db } from "@/db";
import { supplier } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

/* ================= QUERY ================= */

const getSupplier = async (id: string) => {
  const result = await db
    .select({
      id: supplier.id,
      nama: supplier.nama,
      telepon: supplier.telepon,
      alamat: supplier.alamat,
    })
    .from(supplier)
    .where(eq(supplier.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ================= TYPE ================= */

export type Supplier = Awaited<ReturnType<typeof getSupplier>>;

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getSupplier(id);

  if (!data) {
    notFound();
  }

  return <ClientPage supplier={data} />;
}