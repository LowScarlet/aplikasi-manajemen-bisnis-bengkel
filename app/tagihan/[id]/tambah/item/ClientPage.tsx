/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody
} from "@/app/_components/Layouts/FragmentLayout";

import {
  GhostButton,
  PrimaryButtonAction
} from "@/app/_components/Buttons";

import { FiArrowLeft } from "react-icons/fi";

import { addItem } from "./page";
import { format } from "@/libs/utils";

export default function ClientPage({ data }: { data: any }) {

  const router = useRouter();

  /* ================= STATE ================= */

  const [itemForm, setItemForm] = useState({
    nama: "",
    qty: 1,
    harga: 0,
    barangId: null as string | null,
    layananId: null as string | null,
    tipe: "CUSTOM" as "LAYANAN" | "CUSTOM",
  });

  const [loading, setLoading] = useState(false);

  /* ================= CALC ================= */

  const subtotal = (itemForm.qty || 0) * (itemForm.harga || 0);

  /* ================= HANDLER ================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (itemForm.tipe === "CUSTOM") {
        if (!itemForm.nama || itemForm.harga <= 0 || itemForm.qty <= 0) {
          alert("Isi data dengan benar");
          return;
        }
      }

      if (itemForm.tipe === "LAYANAN") {
        if (!itemForm.layananId) {
          alert("Pilih layanan");
          return;
        }
      }

      await addItem(data.id, itemForm);

      router.push(`/tagihan/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan item");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <FragmentLayout>

      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/tagihan/${data.id}`}>
            <FiArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Tambah Barang / Layanan
          </h1>
        </div>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        <div className="space-y-3">

          {/* TIPE */}
          <div>
            <p className="mb-1 text-xs">Tipe</p>
            <select
              value={itemForm.tipe}
              onChange={(e) =>
                setItemForm({
                  ...itemForm,
                  tipe: e.target.value as any,
                  barangId: null,
                  layananId: null,
                  nama: "",
                  harga: 0,
                })
              }
              className="px-3 py-2 border rounded-lg w-full text-sm"
            >
              <option value="CUSTOM">Lainnya</option>
              <option value="LAYANAN">Layanan</option>
            </select>
          </div>

          {/* CUSTOM */}
          {itemForm.tipe === "CUSTOM" && (
            <>
              <div>
                <p className="mb-1 text-xs">Nama</p>
                <input
                  value={itemForm.nama}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, nama: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                />
              </div>

              <div className="gap-2 grid grid-cols-2">
                <div>
                  <p className="mb-1 text-xs">Qty</p>
                  <input
                    type="number"
                    value={itemForm.qty}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, qty: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg w-full text-sm"
                  />
                </div>

                <div>
                  <p className="mb-1 text-xs">Harga</p>
                  <input
                    type="number"
                    value={itemForm.harga}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, harga: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg w-full text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* LAYANAN */}
          {itemForm.tipe === "LAYANAN" && (
            <>
              <div>
                <p className="mb-1 text-xs">Pilih Layanan</p>
                <select
                  value={itemForm.layananId ?? ""}
                  onChange={(e) => {
                    const selected = data.layananList.find(
                      (l: any) => l.id === e.target.value
                    );

                    setItemForm({
                      ...itemForm,
                      layananId: selected?.id ?? null,
                      nama: selected?.nama ?? "",
                      harga: selected?.harga ?? 0,
                    });
                  }}
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                >
                  <option value="">Pilih layanan</option>
                  {data.layananList?.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.nama} - Rp {format(l.harga)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="gap-2 grid grid-cols-2">
                <div>
                  <p className="mb-1 text-xs">Qty</p>
                  <input
                    type="number"
                    value={itemForm.qty}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, qty: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg w-full text-sm"
                  />
                </div>

                <div>
                  <p className="mb-1 text-xs">Harga</p>
                  <input
                    type="number"
                    value={itemForm.harga}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, harga: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg w-full text-sm"
                  />
                </div>
              </div>
            </>
          )}

        </div>

        {/* SUBTOTAL */}
        <div className="text-neutral-500 text-sm">
          Total:{" "}
          <span className="font-semibold text-black">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        <PrimaryButtonAction onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Tambah"}
        </PrimaryButtonAction>

      </FragmentBody>

    </FragmentLayout>
  );
}