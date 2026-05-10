/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentBody,
  FragmentFooter,
  FragmentHeader,
  FragmentLayout,
} from "@/app/_components/Layouts/FragmentLayout";

import { Card } from "@/app/_components/Card";
import { BottomNav } from "../_components/BottomNav";

import Image from "next/image";

import { IoMdLogOut } from "react-icons/io";
import { RiUserAddLine } from "react-icons/ri";

import { logout } from "@/app/auth/logout/action";
import { FaPlus } from "react-icons/fa6";
import { LuScanLine } from "react-icons/lu";
import MenuItem from "../_components/MenuItem";

export default function ClientPage({
  user,
  stats,
}: {
  user: any;
  stats: {
    pendapatan: number;
    belumBayar: number;
  };
}) {
  return (
    <FragmentLayout>

      <FragmentHeader>
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-8 mask mask-squircle">
              <Image
                src="/android-chrome-512x512.png"
                alt="Logo"
                width={30}
                height={30}
              />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight">
              Berkat Motor Erizal
            </h1>
            <p className="text-xs">
              Selamat Datang,{" "}
              <span className="font-medium">
                {user.nama}
              </span>
            </p>
          </div>
        </div>
        <div>
          <button className="btn btn-error btn-square btn-sm" onClick={() => logout()}>
            <IoMdLogOut />
          </button>
        </div>
      </FragmentHeader>

      <FragmentBody>

        <section>
          <Card>
            <Card.Header>Pintasan</Card.Header>

            <Card.Body>
              <div className="gap-4 grid grid-cols-4 text-center">
                <MenuItem
                  icon={FaPlus}
                  label="Buat Tagihan Servis Cepat"
                  href="/tagihan/tambah?cepat"
                  color="primary"
                />

                <MenuItem
                  icon={RiUserAddLine}
                  label="Manajemen Pengguna"
                  href="/pengguna"
                  color="accent"
                />
              </div>
            </Card.Body>
          </Card>
        </section>

      </FragmentBody>

      {/* FOOTER */}
      <FragmentFooter>
        <BottomNav />
      </FragmentFooter>

    </FragmentLayout>
  );
}