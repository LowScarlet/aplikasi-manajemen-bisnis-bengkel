import { db } from "@/db";
import { tagihan } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";

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
  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const data = await getDetail(id);

  if (!data) return notFound();

  return <ClientPage data={data} />;
}