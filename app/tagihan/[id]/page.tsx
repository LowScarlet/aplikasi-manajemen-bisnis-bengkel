'use client'

import Link from "next/link";
import { useState } from "react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

export default function Page() {
  const data = {
    id: 1,
    kode: "INV-001",
    customer: "Budi",
    status: "LUNAS", // ganti ke LUNAS buat test
    total: 190000,
    dibayar: 100000,
    items: [
      { nama: "Oli Yamalube", qty: 1, harga: 50000 },
      { nama: "Busi NGK", qty: 2, harga: 20000 },
      { nama: "Servis Mesin", qty: 1, harga: 100000 },
    ],
  };

  const [bayar, setBayar] = useState(0);
  const sisa = data.total - data.dibayar;

  function handleBayar() {
    console.log("bayar:", bayar);
  }

  return (
    <main className="bg-neutral-100 pb-24 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/tagihan">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-neutral-800 text-xl">
              Detail Tagihan
            </h1>
          </div>

          {/* 🔥 TOMBOL KUITANSI */}
          {data.status === "LUNAS" && (
            <Link
              href={`/tagihan/${data.id}/kuitansi`}
              className="flex items-center gap-1 bg-blue-500 px-3 py-2 rounded-lg text-white text-xs"
            >
              <FiPrinter size={14} />
              Kuitansi
            </Link>
          )}
        </header>

        {/* INFO */}
        <section className="space-y-1 bg-white shadow p-4 rounded-xl">
          <p className="font-medium">{data.kode}</p>
          <p className="text-neutral-500 text-sm">
            {data.customer || "-"}
          </p>
          <StatusBadge status={data.status} />
        </section>

        {/* ITEMS */}
        <section className="space-y-3 bg-white shadow p-4 rounded-xl">
          {data.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <p>{item.nama}</p>
                <p className="text-neutral-400 text-xs">
                  {item.qty} x {item.harga.toLocaleString("id-ID")}
                </p>
              </div>
              <p>
                Rp {(item.qty * item.harga).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </section>

        {/* TOTAL */}
        <section className="space-y-2 bg-white shadow p-4 rounded-xl text-sm">
          <Row label="Total" value={data.total} />
          <Row label="Dibayar" value={data.dibayar} />
          <Row label="Sisa" value={sisa} highlight />
        </section>

        {/* BAYAR */}
        {sisa > 0 && (
          <section className="space-y-3 bg-white shadow p-4 rounded-xl">
            <h2 className="font-medium text-sm">Bayar</h2>

            <input
              type="number"
              placeholder="Masukkan nominal"
              value={bayar}
              onChange={(e) => setBayar(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg w-full text-sm"
            />

            <button
              onClick={handleBayar}
              className="bg-blue-500 py-2 rounded-lg w-full text-white text-sm"
            >
              Simpan Pembayaran
            </button>
          </section>
        )}

      </div>
    </main>
  );
}

//
// 🧩 COMPONENT
//
function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={highlight ? "font-semibold text-red-500" : "font-medium"}>
        Rp {value.toLocaleString("id-ID")}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    BELUM_BAYAR: "bg-red-100 text-red-600",
    SEBAGIAN: "bg-yellow-100 text-yellow-600",
    LUNAS: "bg-green-100 text-green-600",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${map[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}