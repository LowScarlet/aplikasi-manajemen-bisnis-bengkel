/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { pengguna } from "@/db/schema";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUser } from "@/libs/auth";

export const createUserSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  username: z.string().min(3, "Username minimal 3 karakter").trim(),
  password: z.string().min(6, "Password minimal 6 karakter"),
  peran: z.enum(["ADMIN", "MEKANIK"]),
});

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }
  
  async function createUser(prevState: any, formData: FormData) {
    "use server";

    const raw = {
      nama: formData.get("nama"),
      username: formData.get("username"),
      password: formData.get("password"),
      peran: formData.get("peran"),
    };

    const result = createUserSchema.safeParse(raw);

    /* ================= VALIDASI ================= */

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return {
        errors: {
          nama: errors.nama?.[0],
          username: errors.username?.[0],
          password: errors.password?.[0],
          peran: errors.peran?.[0],
        },
        values: raw,
      };
    }

    const data = result.data;

    /* ================= HASH PASSWORD ================= */

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      await db.insert(pengguna).values({
        ...data,
        password: hashedPassword,
      });
    } catch (err: any) {
      if (err.code === "23505") {
        return {
          errors: {
            username: "Username sudah digunakan",
          },
          values: raw,
        };
      }

      return {
        errors: {
          global: "Terjadi kesalahan server",
        },
        values: raw,
      };
    }

    redirect("/pengguna");
  }

  return <ClientPage onSubmit={createUser} />;
}