'use client'

import Link from "next/link";
import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BottomNav } from "../_components/BottomNav";
import { StatusBadge } from "../_components/Badge";
import { LuScanLine } from "react-icons/lu";

export default function Page() {
  const [search, setSearch] = useState("");

  // 🔥 dummy data (ganti dari DB)
  const data = [
    {
      id: 1,
      kode: "INV-001",
      customer: "Budi",
      total: 150000,
      status: "LUNAS",
    },
    {
      id: 2,
      kode: "INV-002",
      customer: "Andi",
      total: 80000,
      status: "BELUM_BAYAR",
    },
    {
      id: 3,
      kode: "INV-003",
      customer: "Siti",
      total: 120000,
      status: "SEBAGIAN",
    },
  ];

  const filtered = data.filter(
    (item) =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-neutral-100 pb-20 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-neutral-800 text-xl">
            Tagihan
          </h1>

          <Link
            href="/tagihan/buat"
            className="flex items-center gap-1 bg-blue-500 px-3 py-2 rounded-lg text-white text-sm"
          >
            <FiPlus size={16} />
            Buat
          </Link>
        </header>

        {/* SEARCH */}
        <div className="flex gap-2">
          <div className="relative grow">
            <FiSearch className="top-1/2 left-3 absolute text-neutral-400 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tagihan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white px-3 py-2 pl-10 border rounded-lg w-full text-sm"
            />
          </div>

          <Link
            href="/tagihan/buat"
            className="flex items-center gap-2 bg-blue-500 px-3 py-2 rounded-lg text-white text-sm"
          >
            <LuScanLine size={16} />
            Scan QR
          </Link>
        </div>

        {/* LIST */}
        <section className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada tagihan
            </p>
          )}

          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/tagihan/${item.id}`}
              className="flex justify-between items-center bg-white shadow p-4 rounded-xl"
            >
              <div>
                <p className="font-medium text-neutral-800">
                  {item.kode}
                </p>
                <p className="text-neutral-500 text-xs">
                  {item.customer || "-"}
                </p>
              </div>

              <div className="space-y-1 text-right">
                <p className="font-semibold text-neutral-800 text-sm">
                  Rp {item.total.toLocaleString("id-ID")}
                </p>

                <StatusBadge status={item.status} />
              </div>
            </Link>
          ))}
        </section>

      </div>

      {/* NAV */}
      <BottomNav />
    </main>
  );
}