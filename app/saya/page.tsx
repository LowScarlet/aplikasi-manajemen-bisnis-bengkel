'use server'

import { redirect } from "next/navigation";
import { getUser } from "@/libs/auth";

import ClientPage from "./ClientPage";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <ClientPage user={user} />;
}