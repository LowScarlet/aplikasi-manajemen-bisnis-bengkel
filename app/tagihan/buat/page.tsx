/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { Input, Textarea } from "@/app/_components/Input";

type Item = {
  id: number;
  nama: string;
  qty: number;
  harga: number;
};

export default function Page() {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [dibayar, setDibayar] = useState(0);

  // 🔥 tambah item (sementara dummy)
  function addItem() {
    setItems([
      ...items,
      {
        id: Date.now(),
        nama: "Item Baru",
        qty: 1,
        harga: 0,
      },
    ]);
  }

  function updateItem(id: number, field: string, value: any) {
    setItems(items.map(i =>
      i.id === id ? { ...i, [field]: value } : i
    ));
  }

  function removeItem(id: number) {
    setItems(items.filter(i => i.id !== id));
  }

  const total = items.reduce((sum, i) => sum + i.qty * i.harga, 0);
  const sisa = total - dibayar;

  function handleSubmit() {
    const payload = {
      customer,
      items,
      total,
      dibayar,
    };

    console.log(payload);
  }

  return (
    <main className="bg-neutral-100 pb-24 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header className="flex items-center gap-3">
          <Link href="/tagihan">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-neutral-800 text-xl">
            Buat Tagihan
          </h1>
        </header>

        {/* CUSTOMER */}
        <Input label="Nama Customer" name="satuan" value={customer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)} />

        <Textarea
          label="Catatan"
          name="catatan"
          value={customer}
          onChange={()=>{}}
        />

        {/* ITEM LIST */}
        {items.length > 0 && (
          <section className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="space-y-2 bg-white shadow p-3 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <input
                    value={item.nama}
                    onChange={(e) =>
                      updateItem(item.id, "nama", e.target.value)
                    }
                    className="outline-none font-medium"
                  />

                  <button onClick={() => removeItem(item.id)}>
                    <FiTrash2 className="text-red-500" />
                  </button>
                </div>

                <div className="flex justify-between gap-2">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, "qty", Number(e.target.value))
                    }
                    className="px-2 py-1 border rounded w-16 text-sm"
                  />

                  <input
                    type="number"
                    value={item.harga}
                    onChange={(e) =>
                      updateItem(item.id, "harga", Number(e.target.value))
                    }
                    className="px-2 py-1 border rounded w-full text-sm"
                  />

                  <p className="w-24 font-medium text-sm text-right">
                    Rp {(item.qty * item.harga).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ADD ITEM */}
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="flex justify-center items-center gap-2 py-3 border border-dashed rounded-xl w-full text-sm"
          >
            <FiPlus /> Barang
          </button>
          <button
            onClick={addItem}
            className="flex justify-center items-center gap-2 py-3 border border-dashed rounded-xl w-full text-sm"
          >
            <FiPlus /> Jasa
          </button>
          <button
            onClick={addItem}
            className="flex justify-center items-center gap-2 py-3 border border-dashed rounded-xl w-full text-sm"
          >
            <FiPlus /> Lainnya
          </button>
        </div>

        {/* TOTAL */}
        <section className="space-y-2 bg-white shadow p-4 rounded-xl text-sm">
          <Row label="Total" value={total} />
          <Row label="Dibayar" value={dibayar} />

          <div className="flex justify-between">
            <span>Sisa</span>
            <span className="font-semibold text-red-500">
              Rp {sisa.toLocaleString("id-ID")}
            </span>
          </div>

          <input
            type="number"
            placeholder="Input pembayaran"
            value={dibayar}
            onChange={(e) => setDibayar(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg w-full text-sm"
          />
        </section>

        {/* ACTION */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 py-3 rounded-xl w-full font-medium text-white"
        >
          Simpan Tagihan
        </button>

      </div>
    </main>
  );
}

//
// 🧩 COMPONENT
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