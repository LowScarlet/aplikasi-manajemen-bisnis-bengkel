import { cookies } from "next/headers";
import { db } from "@/db";
import { pengguna } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUser() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;

  if (!userId) return null;

  return db.query.pengguna.findFirst({
    where: eq(pengguna.id, userId),
  });
}

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}