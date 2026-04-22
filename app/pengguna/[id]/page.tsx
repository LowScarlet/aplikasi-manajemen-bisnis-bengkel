import { db } from "@/db";
import { pengguna } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";

/* ================= QUERY ================= */

const getUser_ = async (id: string) => {
  const result = await db
    .select({
      id: pengguna.id,
      nama: pengguna.nama,
      username: pengguna.username,
      peran: pengguna.peran,
    })
    .from(pengguna)
    .where(eq(pengguna.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ================= TYPE ================= */

export type User = Awaited<ReturnType<typeof getUser_>>;

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }
  
  const { id } = await params;

  const user = await getUser_(id);

  if (!user) {
    notFound();
  }

  return <ClientPage user={user} />;
}