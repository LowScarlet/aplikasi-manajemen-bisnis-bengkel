import { db } from "@/db";
import { tagihan } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

const getDetail = async (id: string) => {
  return db.query.tagihan.findFirst({
    where: eq(tagihan.id, id),
    with: {
      details: true,
      pembayaran: true,
    },
  });
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const data = await getDetail(id);

  if (!data) return notFound();

  return <ClientPage data={data} />;
}