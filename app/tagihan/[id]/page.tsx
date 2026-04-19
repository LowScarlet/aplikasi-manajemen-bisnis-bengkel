import { db } from "@/db";
import { tagihan } from "@/db/schema";
import { eq } from "drizzle-orm";
import ClientPage from "./ClientPage";

const getDetail = async (id: string) => {
  return db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
    with: {
      details: true,      // 🔥 barang & layanan
      pembayaran: true,   // 🔥 cicilan
    },
  });
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getDetail(id);

  if (!data) {
    return <div>Tagihan tidak ditemukan</div>;
  }

  return <ClientPage data={data} />;
}