'use client'

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function Page() {
  // 🔥 dummy data (nanti dari DB berdasarkan id)
  const initialData = {
    nama: "Oli Yamalube",
    kode: "OLI-001",
    kategori: "oli",
    satuan: "pcs",
    hargaBeli: "30000",
    hargaJual: "50000",
    stokMinimum: "5",
    catatan: "Untuk motor matic",
  };

  const [form, setForm] = useState(initialData);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 🔥 nanti update ke database
    console.log("UPDATE:", form);
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
            Edit Barang
          </h1>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input label="Nama Barang" name="nama" value={form.nama} onChange={handleChange} />

          <Input label="Kode" name="kode" value={form.kode} onChange={handleChange} />

          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-neutral-600 text-sm">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="bg-white px-3 py-2 border rounded-lg w-full text-sm"
            >
              <option value="oli">Oli</option>
              <option value="sparepart">Sparepart</option>
            </select>
          </div>

          <Input label="Satuan" name="satuan" value={form.satuan} onChange={handleChange} />

          <Input label="Harga Beli" name="hargaBeli" type="number" value={form.hargaBeli} onChange={handleChange} />

          <Input label="Harga Jual" name="hargaJual" type="number" value={form.hargaJual} onChange={handleChange} />

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
          <div className="flex gap-3">
            <Link
              href="/barang"
              className="py-3 border rounded-xl w-full text-sm text-center"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 py-3 rounded-xl w-full font-medium text-white"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

//
// 🧩 INPUT COMPONENT
//
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-neutral-600 text-sm">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="bg-white px-3 py-2 border rounded-lg w-full text-sm"
      />
    </div>
  );
}