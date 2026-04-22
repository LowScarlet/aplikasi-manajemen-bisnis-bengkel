import { db } from "@/db";
import { layanan } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";

/* ================= QUERY ================= */

const getLayanan = async (id: string) => {
  const result = await db
    .select({
      id: layanan.id,
      nama: layanan.nama,
      harga: layanan.harga,
    })
    .from(layanan)
    .where(eq(layanan.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ================= TYPE ================= */

export type Layanan = Awaited<ReturnType<typeof getLayanan>>;

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const data = await getLayanan(id);

  if (!data) {
    notFound();
  }

  return <ClientPage layanan={data} />;
}