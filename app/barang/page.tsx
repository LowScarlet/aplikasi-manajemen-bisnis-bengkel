'use client'

import { useState } from "react";
import Link from "next/link";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BottomNav } from "../_components/BottomNav";

export default function Page() {
  const [search, setSearch] = useState("");

  const items = [
    { id: 1, nama: "Oli Yamalube", harga: 50000, stok: 10, min: 5 },
    { id: 2, nama: "Busi NGK", harga: 20000, stok: 3, min: 5 },
    { id: 3, nama: "Kampas Rem", harga: 45000, stok: 7, min: 5 },
  ];

  const filtered = items.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-neutral-100 pb-20 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-neutral-800 text-xl">
            Barang
          </h1>

          <Link
            href="/barang/tambah"
            className="flex items-center gap-1 bg-blue-500 px-3 py-2 rounded-lg text-white text-sm"
          >
            <FiPlus size={16} />
            Tambah
          </Link>
        </header>

        {/* SEARCH */}
        <div className="relative">
          <FiSearch className="top-1/2 left-3 absolute text-neutral-400 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white py-2 pr-3 pl-10 border rounded-lg outline-none w-full text-sm"
          />
        </div>

        {/* LIST */}
        <section className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Barang tidak ditemukan
            </p>
          )}

          {filtered.map((item) => {
            const isLow = item.stok <= item.min;

            return (
              <Link
                key={item.id}
                href={`/barang/${item.id}`}
                className="flex justify-between items-center bg-white shadow p-4 rounded-xl"
              >
                <div>
                  <p className="font-medium text-neutral-800">
                    {item.nama}
                  </p>
                  <p className="text-neutral-500 text-xs">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${isLow ? "text-red-500" : "text-neutral-800"
                      }`}
                  >
                    {item.stok}
                  </p>
                  <p className="text-neutral-400 text-xs">stok</p>
                </div>
              </Link>
            );
          })}
        </section>

      </div>

      {/* NAV */}
      <BottomNav />
    </main>
  );
}