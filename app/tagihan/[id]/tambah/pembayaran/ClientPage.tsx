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

import { addPayment } from "./page";

export default function ClientPage({ data }: { data: any }) {

  const router = useRouter();

  /* ================= STATE ================= */

  const [form, setForm] = useState({
    jumlah: 0,
    metode: "",
    catatan: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLER ================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (form.jumlah <= 0) {
        alert("Jumlah tidak valid");
        return;
      }

      if (!form.metode) {
        alert("Pilih metode pembayaran");
        return;
      }

      await addPayment(data.id, form);

      router.push(`/tagihan/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan pembayaran");
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
            Tambah Pembayaran
          </h1>
        </div>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        <div className="space-y-3">

          <div>
            <p className="mb-1 text-xs">Jumlah Bayar</p>
            <input
              type="number"
              value={form.jumlah}
              onChange={(e) =>
                setForm({ ...form, jumlah: Number(e.target.value) })
              }
              className="px-3 py-2 border rounded-lg w-full text-sm"
            />
          </div>

          <div>
            <p className="mb-1 text-xs">Metode</p>
            <input
              value={form.metode}
              onChange={(e) =>
                setForm({ ...form, metode: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full text-sm"
              placeholder="Cash / Transfer / dll"
            />
          </div>

          <div>
            <p className="mb-1 text-xs">Catatan</p>
            <textarea
              value={form.catatan}
              onChange={(e) =>
                setForm({ ...form, catatan: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full text-sm"
            />
          </div>

        </div>

        <PrimaryButtonAction onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Tambah Pembayaran"}
        </PrimaryButtonAction>

      </FragmentBody>

    </FragmentLayout>
  );
}