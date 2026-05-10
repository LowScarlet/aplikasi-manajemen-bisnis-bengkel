'use server'

import { db } from "@/db";
import { pengguna } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";

/* ================= LOGIN ================= */

export async function login(form: {
  username: string;
  password: string;
}) {
  const user = await db.query.pengguna.findFirst({
    where: eq(pengguna.username, form.username),
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const valid = await bcrypt.compare(
    form.password,
    user.password ?? ""
  );

  if (!valid) {
    throw new Error("Password salah");
  }
  const cookieStore = await cookies();

  cookieStore.set("user_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
  });

  redirect("/dashboard");
}

/* ================= PAGE ================= */

export default async function Page() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <ClientPage />;
}