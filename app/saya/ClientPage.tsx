/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";

import { Card } from "@/app/_components/Card";
import { BottomNav } from "../_components/BottomNav";

import Image from "next/image";
import { IoMdLogOut } from "react-icons/io";
import { DangerButtonAction } from "../_components/Buttons";
import { logout } from "@/app/auth/logout/action";

export default function ClientPage({ user }: { user: any }) {
  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-3">
          <Image
            src="/android-chrome-512x512.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <div>
            <h1 className="font-semibold text-sm">
              Halaman Saya
            </h1>
            <p className="text-neutral-500 text-xs">
              Profil pengguna
            </p>
          </div>
        </div>

        <DangerButtonAction onClick={() => logout()}>
          <IoMdLogOut />
        </DangerButtonAction>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody>

        <Card>
          <Card.Header>Informasi Pengguna</Card.Header>
          <Card.Body>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-neutral-500">Nama</p>
                <p className="font-medium">{user.nama}</p>
              </div>

              <div>
                <p className="text-neutral-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-neutral-500">Role</p>
                <p className="font-medium">{user.role}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

      </FragmentBody>

      {/* FOOTER */}
      <FragmentFooter>
        <BottomNav />
      </FragmentFooter>

    </FragmentLayout>
  );
}