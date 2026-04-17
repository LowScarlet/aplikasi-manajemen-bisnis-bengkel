'use client'

import Link from "next/link";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

export default function Page() {
  // 🔥 dummy data (ambil dari tagihan nanti)
  const data = {
    kode: "INV-001",
    tanggal: "14/04/2026",
    customer: "Budi",
    total: 190000,
    dibayar: 200000,
    kembalian: 10000,
    items: [
      { nama: "Oli Yamalube", qty: 1, harga: 50000 },
      { nama: "Busi NGK", qty: 2, harga: 20000 },
      { nama: "Servis Mesin", qty: 1, harga: 100000 },
    ],
  };

  return (
    <main className="bg-neutral-100 py-10 min-h-screen">
      <div className="space-y-6 mx-auto px-4 w-full max-w-md">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <Link href={`/tagihan/${data.kode}`}>
            <FiArrowLeft size={20} />
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-sm"
          >
            <FiPrinter /> Print
          </button>
        </div>

        {/* KUITANSI */}
        <div className="bg-white shadow p-6 rounded-xl text-neutral-800 text-sm">

          {/* TITLE */}
          <div className="pb-3 border-b text-center">
            <h1 className="font-bold text-lg">Berkat Motor</h1>
            <p className="text-xs">Jl. Contoh No.123</p>
          </div>

          {/* INFO */}
          <div className="flex justify-between py-3 text-xs">
            <div>
              <p>No: {data.kode}</p>
              <p>{data.tanggal}</p>
            </div>
            <div className="text-right">
              <p>{data.customer}</p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="space-y-2 py-3 border-t border-b">
            {data.items.map((item, i) => (
              <div key={i} className="flex justify-between">
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
          </div>

          {/* TOTAL */}
          <div className="space-y-1 py-3">
            <Row label="Total" value={data.total} />
            <Row label="Bayar" value={data.dibayar} />
            <Row label="Kembali" value={data.kembalian} />
          </div>

          {/* FOOTER */}
          <div className="pt-3 border-t text-xs text-center">
            <p>Terima kasih 🙏</p>
          </div>

        </div>

      </div>
    </main>
  );
}

//
// 🧩 ROW
//
function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium">
        Rp {value.toLocaleString("id-ID")}
      </span>
    </div>
  );
}