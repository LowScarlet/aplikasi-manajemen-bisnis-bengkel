'use client'

import Link from "next/link";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

export default function Page() {
  // 🔥 dummy data (ganti dari DB)
  const barang = {
    id: 1,
    nama: "Oli Yamalube",
    kode: "OLI-001",
    kategori: "Oli",
    satuan: "pcs",
    hargaBeli: 30000,
    hargaJual: 50000,
    stok: 3,
    stokMinimum: 5,
    catatan: "Untuk motor matic",
  };

  const isLow = barang.stok <= barang.stokMinimum;

  return (
    <main className="bg-neutral-100 pb-20 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/barang">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-neutral-800 text-xl">
              Detail Barang
            </h1>
          </div>

          <Link
            href={`/barang/${barang.id}/edit`}
            className="flex items-center gap-1 bg-blue-500 px-3 py-2 rounded-lg text-white text-sm"
          >
            <FiEdit2 size={14} />
            Edit
          </Link>
        </header>

        {/* INFO UTAMA */}
        <section className="space-y-2 bg-white shadow p-4 rounded-xl">
          <h2 className="font-semibold text-neutral-800 text-lg">
            {barang.nama}
          </h2>

          <p className="text-neutral-500 text-sm">
            Kode: {barang.kode || "-"}
          </p>

          <p className="text-neutral-500 text-sm">
            Kategori: {barang.kategori}
          </p>

          <p className="text-neutral-500 text-sm">
            Satuan: {barang.satuan}
          </p>
        </section>

        {/* HARGA */}
        <section className="gap-3 grid grid-cols-2">
          <Box label="Harga Beli" value={barang.hargaBeli} />
          <Box label="Harga Jual" value={barang.hargaJual} />
        </section>

        {/* STOK */}
        <section className="flex justify-between items-center bg-white shadow p-4 rounded-xl">
          <div>
            <p className="text-neutral-500 text-sm">Stok</p>
            <p
              className={`text-xl font-bold ${isLow ? "text-red-500" : "text-neutral-800"
                }`}
            >
              {barang.stok}
            </p>
          </div>

          <div className="space-y-2 text-right">
            <p className="text-neutral-500 text-sm">Minimum</p>
            <p className="font-medium text-neutral-800">
              {barang.stokMinimum}
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-500 px-3 py-1 rounded text-white text-xs"
              >
                Tambah Stok
              </button>

              <button
                className="bg-orange-500 px-3 py-1 rounded text-white text-xs"
              >
                Koreksi
              </button>
            </div>
          </div>
        </section>

        {/* WARNING */}
        {isLow && (
          <div className="bg-red-50 p-3 border border-red-200 rounded-lg text-red-600 text-sm">
            ⚠ Stok menipis, segera restock
          </div>
        )}

        {/* CATATAN */}
        {barang.catatan && (
          <section className="bg-white shadow p-4 rounded-xl">
            <h3 className="mb-1 font-medium text-neutral-800">
              Catatan
            </h3>
            <p className="text-neutral-600 text-sm">
              {barang.catatan}
            </p>
          </section>
        )}

        {/* RIWAYAT (dummy) */}
        <section className="bg-white shadow p-4 rounded-xl">
          <h3 className="mb-2 font-semibold text-neutral-800">
            Riwayat Stok
          </h3>

          <ul className="space-y-1 text-neutral-600 text-sm">
            <li>+10 dari supplier</li>
            <li>-2 penjualan (INV-001)</li>
            <li>-1 penjualan (INV-002)</li>
          </ul>
        </section>

      </div>
    </main>
  );
}

//
// 🧩 COMPONENT BOX
//
function Box({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl">
      <p className="text-neutral-500 text-xs">{label}</p>
      <p className="font-bold text-neutral-800">
        Rp {value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}