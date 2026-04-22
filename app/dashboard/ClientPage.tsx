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

import Link from "next/link";
import Image from "next/image";

import { FiPackage, FiTrendingUp } from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { RiUserAddLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";

import { DangerButtonAction } from "../_components/Buttons";
import { logout } from "@/app/auth/logout/action";

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
            <h1 className="font-semibold text-neutral-800 text-sm leading-tight">
              Berkat Motor Erizal
            </h1>
            <p className="text-neutral-500 text-xs">
              Selamat Datang,{" "}
              <span className="font-medium">
                {user.nama}
              </span>
            </p>
          </div>
        </div>
        <div>
          <DangerButtonAction onClick={() => logout()}>
            <IoMdLogOut />
          </DangerButtonAction>
        </div>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody>

        {/* ================= STATS ================= */}
        <section className="gap-3 grid grid-cols-2">

          {/* PENDAPATAN */}
          <Card>
            <Card.Header>Pendapatan</Card.Header>
            <Card.Body>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-neutral-800 text-lg">
                  Rp {stats.pendapatan.toLocaleString("id-ID")}
                </h3>
                <FiTrendingUp className="text-neutral-400" />
              </div>
            </Card.Body>
          </Card>

          {/* BELUM BAYAR */}
          <Card.Link href="/tagihan">
            <Card.Header>Belum Dibayar</Card.Header>
            <Card.Body>
              <h3 className="font-bold text-red-500 text-lg">
                {stats.belumBayar} Tagihan
              </h3>
            </Card.Body>
          </Card.Link>

        </section>

        {/* ================= MENU ================= */}
        <section>
          <Card>
            <Card.Header>Manajemen Data</Card.Header>
            <Card.Body>
              <div className="gap-4 grid grid-cols-5 text-xs text-center">
                <MenuItem icon={FiPackage} label="Barang" href="/barang" />
                <MenuItem icon={LuShoppingBag} label="Pemasok" href="/pemasok" />
                <MenuItem icon={MdOutlineCategory} label="Kategori" href="/kategori_barang" />
                <MenuItem icon={GrUserWorker} label="Layanan" href="/layanan" />
                <MenuItem icon={RiUserAddLine} label="Pengguna" href="/pengguna" />
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* ================= AKTIVITAS ================= */}
        <section>
          <Card>
            <Card.Header>Aktivitas Terbaru</Card.Header>
            <Card.Body>
              <ul className="divide-y text-sm">
                <ActivityItem title="INV-001" desc="Jual Oli" />
                <ActivityItem title="INV-002" desc="Servis Mesin" />
                <ActivityItem title="RESTOK" desc="Busi dari Supplier" />
              </ul>
            </Card.Body>

            <Card.Footer>
              <Link
                href="/transaksi"
                className="font-medium text-blue-500 text-xs"
              >
                Lihat Semua
              </Link>
            </Card.Footer>
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

/* ================= MENU ================= */

function MenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: any;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-1"
    >
      <div className="flex justify-center items-center bg-blue-50 group-hover:bg-blue-100 rounded-xl w-12 h-12 transition">
        <Icon size={20} className="text-blue-500" />
      </div>
      <span className="text-neutral-600 group-hover:text-neutral-800">
        {label}
      </span>
    </Link>
  );
}

/* ================= ACTIVITY ================= */

function ActivityItem({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <li className="flex justify-between items-center py-2">
      <div>
        <p className="font-medium text-neutral-700 text-xs">
          {title}
        </p>
        <p className="text-neutral-500 text-xs">
          {desc}
        </p>
      </div>

      <span className="text-[10px] text-neutral-400">
        Hari ini
      </span>
    </li>
  );
}