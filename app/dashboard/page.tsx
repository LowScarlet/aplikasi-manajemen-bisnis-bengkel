/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from "next/link";
import {
  FiPackage
} from "react-icons/fi";
import { BottomNav } from "../_components/BottomNav";
import { GrUserWorker } from "react-icons/gr";
import { RiUserAddLine } from "react-icons/ri";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";

export default function Page() {
  return (
    <main className="bg-neutral-100 pb-20 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header>
          <h1 className="font-bold text-neutral-800 text-xl">
            Berkat Motor Erizal
          </h1>
          <p className="text-neutral-500 text-sm">
            Selamat Siang, Tegar Maulana Fahreza
          </p>
        </header>

        {/* STATS */}
        <section className="gap-3 grid grid-cols-2">
          <Card title="Pendapatan" value="Rp 1.250.000" />
          <Card title="Tagihan Belum Dibayar" value="5 Tagihan" />
        </section>

        {/* MENU CEPAT */}
        <section className="bg-white shadow p-4 rounded-xl">
          <h2 className="mb-3 font-semibold text-neutral-800 text-sm">
            Manajamen Data Master
          </h2>

          <div className="gap-3 grid grid-cols-5 text-xs text-center">
            <MenuItem icon={FiPackage} label="Barang" href="/barang" />
            <MenuItem icon={LuShoppingBag} label="Pemasok" href="/pemasok" />
            <MenuItem icon={MdOutlineCategory} label="Kategori" href="/kategori_barang" />
            <MenuItem icon={GrUserWorker} label="Layanan" href="/layanan" />
            <MenuItem icon={RiUserAddLine} label="Pengguna" href="/pengguna" />
          </div>
        </section>

        {/* AKTIVITAS */}
        <section className="bg-white shadow p-4 rounded-xl">
          <h2 className="mb-3 font-semibold text-neutral-800">
            Aktivitas Terbaru
          </h2>

          <ul className="space-y-2 text-neutral-600 text-sm">
            <li>INV-001 • Jual Oli</li>
            <li>INV-002 • Servis Mesin</li>
            <li>Restok Busi dari Supplier</li>
          </ul>
        </section>

      </div>

      {/* NAV */}
      <BottomNav />
    </main>
  );
}

//
// 🧩 CARD
//
function Card({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="bg-white shadow p-4 rounded-xl">
      <p className="text-neutral-500 text-xs">{title}</p>
      <h3
        className={`text-lg font-bold ${
          danger ? "text-red-500" : "text-neutral-800"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

//
// 🧩 MENU ITEM
//
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
      className="flex flex-col items-center gap-1"
    >
      <div className="flex justify-center items-center bg-blue-50 rounded-xl w-12 h-12">
        <Icon size={20} className="text-blue-500" />
      </div>
      <span className="text-neutral-600">{label}</span>
    </Link>
  );
}