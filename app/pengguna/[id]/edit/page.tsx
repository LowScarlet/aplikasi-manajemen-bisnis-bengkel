import { db } from "@/db";
import { pengguna } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ClientPage from "./ClientPage";

/* ================= QUERY ================= */

const getUser = async (id: string) => {
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

export type User = Awaited<ReturnType<typeof getUser>>;

/* ================= PAGE ================= */

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const user = await getUser(id);

  if (!user) return notFound();

  /* ================= ACTIONS ================= */

  async function updateUser(formData: FormData) {
    "use server";

    const nama = formData.get("nama") as string;
    const username = formData.get("username") as string;
    const peran = formData.get("peran") as "ADMIN" | "MEKANIK";

    await db
      .update(pengguna)
      .set({ nama, username, peran })
      .where(eq(pengguna.id, id));

    redirect("/pengguna");
  }

  async function deleteUser() {
    "use server";

    await db.delete(pengguna).where(eq(pengguna.id, id));

    redirect("/pengguna");
  }

  return (
    <ClientPage
      user={user}
      onSubmit={updateUser}
      onDelete={deleteUser}
    />
  );
}