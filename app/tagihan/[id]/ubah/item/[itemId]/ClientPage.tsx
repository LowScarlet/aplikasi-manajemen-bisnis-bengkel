/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn, format } from "@/libs/utils";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody
} from "@/app/_components/Layouts/FragmentLayout";

import {
  DangerButtonAction,
  GhostButton,
  PrimaryButtonAction
} from "@/app/_components/Buttons";

import { FiArrowLeft } from "react-icons/fi";
import { deleteItem, updateItem } from "./page";

export default function ClientPage({ data, item }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ================= STATE ================= */

  const [form, setForm] = useState({
    nama: item.nama,
    qty: item.qty,
    harga: item.harga,
    barangId: item.barangId ?? null,
    layananId: item.layananId ?? null,
    tipe: item.tipe as "LAYANAN" | "CUSTOM",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* ================= HANDLER ================= */

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);

      if (form.tipe === "CUSTOM") {
        if (!form.nama || form.qty <= 0 || form.harga <= 0) {
          alert("Isi data dengan benar");
          return;
        }
      }

      if (form.tipe === "LAYANAN") {
        if (!form.layananId) {
          alert("Pilih layanan");
          return;
        }
      }

      await updateItem(item.id, form);
      router.push(`/tagihan/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal update item");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const confirmDelete = confirm("Hapus item ini?");
      if (!confirmDelete) return;

      setLoadingDelete(true);

      await deleteItem(id);
      router.push(`/tagihan/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal hapus item");
    } finally {
      setLoadingDelete(false);
    }
  };

  const subtotal = (form.qty || 0) * (form.harga || 0);

  /* ================= RENDER ================= */

  return (
    <FragmentLayout>
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/tagihan/${data.id}`}>
            <FiArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Edit Barang / Layanan
          </h1>
        </div>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        <div className="space-y-3">

          {/* TIPE */}
          <div>
            <p className="mb-1 text-xs">Tipe</p>
            <select
              value={form.tipe}
              onChange={(e) =>
                setForm({
                  ...form,
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

          {/* ================= LAYANAN ================= */}
          {form.tipe === "LAYANAN" && (
            <div>
              <p className="mb-1 text-xs">Pilih Layanan</p>

              <input
                placeholder="Cari layanan..."
                defaultValue={searchParams.get("search") ?? ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="mb-2 px-3 py-2 border rounded-lg w-full text-sm"
              />

              <div className="border rounded-lg max-h-48 overflow-auto">
                {data.layananList.length === 0 && (
                  <div className="p-2 text-neutral-500 text-sm">
                    Tidak ada layanan
                  </div>
                )}
                
                {data.layananList.map((l: any) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        layananId: l.id,
                        nama: l.nama,
                        harga: l.harga,
                      }))
                    }
                    className={cn(
                      "flex justify-between items-center px-3 py-2 border rounded-md w-full text-sm text-left transition",
                      form.layananId === l.id
                        ? "bg-blue-100 border-blue-500 font-semibold"
                        : "hover:bg-neutral-100 border-transparent"
                    )}
                  >
                    <span>
                      {l.nama} - Rp {format(l.harga)}
                    </span>

                    {form.layananId === l.id && (
                      <span className="text-blue-600 text-xs">✔</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= CUSTOM ================= */}
          {form.tipe === "CUSTOM" && (
            <div>
              <p className="mb-1 text-xs">Nama</p>
              <input
                value={form.nama}
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
                className="px-3 py-2 border rounded-lg w-full text-sm"
              />
            </div>
          )}

          {/* QTY & HARGA */}
          <div className="gap-2 grid grid-cols-2">
            <div>
              <p className="mb-1 text-xs">Qty</p>
              <input
                type="number"
                value={form.qty}
                onChange={(e) =>
                  setForm({ ...form, qty: Number(e.target.value) })
                }
                className="px-3 py-2 border rounded-lg w-full text-sm"
              />
            </div>

            <div>
              <p className="mb-1 text-xs">Harga</p>
              <input
                type="number"
                value={form.harga}
                onChange={(e) =>
                  setForm({ ...form, harga: Number(e.target.value) })
                }
                className="px-3 py-2 border rounded-lg w-full text-sm"
              />
            </div>
          </div>

          {/* SUBTOTAL */}
          <div className="text-neutral-500 text-sm">
            Total:{" "}
            <span className="font-semibold text-black">
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </div>

        </div>

        <PrimaryButtonAction onClick={handleSubmit}>
          Simpan Perubahan
        </PrimaryButtonAction>

        <DangerButtonAction
          onClick={() => handleDeleteItem(item.id)}
        >
          Hapus Item
        </DangerButtonAction>

      </FragmentBody>
    </FragmentLayout>
  );
}