import { db } from "@/db";
import { pengguna } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import ClientPage from "./ClientPage";

/* ================= QUERY ================= */

const getUsers = async (q: string, page: number) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  return db
    .select({
      id: pengguna.id,
      nama: pengguna.nama,
      username: pengguna.username,
      peran: pengguna.peran,
    })
    .from(pengguna)
    .where(
      q
        ? or(
            ilike(pengguna.nama, `%${q}%`),
            ilike(pengguna.username, `%${q}%`)
          )
        : undefined
    )
    .limit(limit)
    .offset(offset);
};

/* ================= TYPE ================= */

export type User = Awaited<ReturnType<typeof getUsers>>[number];

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

  const users = await getUsers(q, page);

  return (
    <ClientPage
      users={users}
      initialSearch={q}
      currentPage={page}
    />
  );
}