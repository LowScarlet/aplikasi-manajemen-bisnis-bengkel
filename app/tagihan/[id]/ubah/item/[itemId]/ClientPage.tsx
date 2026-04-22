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
  DangerButtonAction,
  GhostButton,
  PrimaryButtonAction
} from "@/app/_components/Buttons";

import { FiArrowLeft } from "react-icons/fi";

import { deleteItem, updateItem } from "./page";
import { format } from "@/libs/utils";

export default function ClientPage({
  data,
  item,
}: {
  data: any;
  item: any;
}) {

  const router = useRouter();

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

  /* ================= CALC ================= */

  const subtotal = (form.qty || 0) * (form.harga || 0);

  /* ================= HANDLER ================= */

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

          {/* CUSTOM */}
          {form.tipe === "CUSTOM" && (
            <>
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
            </>
          )}

          {/* LAYANAN */}
          {form.tipe === "LAYANAN" && (
            <>
              <div>
                <p className="mb-1 text-xs">Pilih Layanan</p>
                <select
                  value={form.layananId ?? ""}
                  onChange={(e) => {
                    const selected = data.layananList.find(
                      (l: any) => l.id === e.target.value
                    );

                    setForm({
                      ...form,
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
            </>
          )}

          {/* SUBTOTAL */}
          <div className="text-neutral-500 text-sm">
            Total:{" "}
            <span className="font-semibold text-black">
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </div>

        </div>

        <PrimaryButtonAction onClick={handleSubmit} disabled={loadingSubmit}>
          {loadingSubmit ? "Menyimpan..." : "Simpan Perubahan"}
        </PrimaryButtonAction>

        <DangerButtonAction
          onClick={() => handleDeleteItem(item.id)}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Menghapus..." : "Hapus Item"}
        </DangerButtonAction>

      </FragmentBody>

    </FragmentLayout>
  );
}