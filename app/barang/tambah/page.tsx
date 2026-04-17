'use client'

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Input } from "@/app/_components/Input";

export default function Page() {
  const [form, setForm] = useState({
    nama: "",
    kode: "",
    kategori: "",
    satuan: "pcs",
    hargaBeli: "",
    hargaJual: "",
    stok: "",
    stokMinimum: "",
    catatan: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 🔥 nanti ganti dengan API / drizzle
    console.log(form);
  }

  return (
    <main className="bg-neutral-100 pb-20 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header className="flex items-center gap-3">
          <Link href="/barang">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-neutral-800 text-xl">
            Tambah Barang
          </h1>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input label="Nama Barang" name="nama" value={form.nama} onChange={handleChange} />

          <Input label="Kode (opsional)" name="kode" value={form.kode} onChange={handleChange} />

          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-neutral-600 text-sm">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="bg-white px-3 py-2 border rounded-lg w-full text-sm"
            >
              <option value="">Pilih kategori</option>
              <option value="oli">Oli</option>
              <option value="sparepart">Sparepart</option>
            </select>
          </div>

          <Input label="Satuan" name="satuan" value={form.satuan} onChange={handleChange} />

          <Input label="Harga Beli" name="hargaBeli" type="number" value={form.hargaBeli} onChange={handleChange} />

          <Input label="Harga Jual" name="hargaJual" type="number" value={form.hargaJual} onChange={handleChange} />

          <Input label="Stok Awal" name="stok" type="number" value={form.stok} onChange={handleChange} />

          <Input label="Stok Minimum" name="stokMinimum" type="number" value={form.stokMinimum} onChange={handleChange} />

          {/* CATATAN */}
          <div className="space-y-1">
            <label className="text-neutral-600 text-sm">Catatan</label>
            <textarea
              name="catatan"
              value={form.catatan}
              onChange={handleChange}
              className="bg-white px-3 py-2 border rounded-lg w-full text-sm"
              rows={3}
            />
          </div>

          {/* ACTION */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 py-3 rounded-xl w-full font-medium text-white"
          >
            Simpan Barang
          </button>

        </form>
      </div>
    </main>
  );
}