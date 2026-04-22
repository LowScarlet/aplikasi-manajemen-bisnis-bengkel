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

import { deletePayment, updatePayment } from "./page";

export default function ClientPage({
  data,
  payment,
}: {
  data: any;
  payment: any;
}) {

  const router = useRouter();

  /* ================= STATE ================= */

  const [form, setForm] = useState({
    jumlah: payment.jumlah,
    metode: payment.metode ?? "",
    catatan: payment.catatan ?? "",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* ================= HANDLER ================= */

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);

      if (form.jumlah <= 0) {
        alert("Jumlah tidak valid");
        return;
      }

      if (!form.metode) {
        alert("Metode wajib diisi");
        return;
      }

      await updatePayment(payment.id, form);

      router.push(`/tagihan/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal update pembayaran");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      const confirmDelete = confirm("Hapus pembayaran ini?");
      if (!confirmDelete) return;

      setLoadingDelete(true);

      await deletePayment(id);

      router.push(`/tagihan/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal hapus pembayaran");
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
            Edit Pembayaran
          </h1>
        </div>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        {/* FORM */}
        <div className="space-y-3">

          <div>
            <p className="mb-1 text-xs">Jumlah</p>
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

        {/* ACTION */}
        <PrimaryButtonAction onClick={handleSubmit} disabled={loadingSubmit}>
          {loadingSubmit ? "Menyimpan..." : "Simpan Perubahan"}
        </PrimaryButtonAction>

        <DangerButtonAction
          onClick={() => handleDeletePayment(payment.id)}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Menghapus..." : "Hapus Pembayaran"}
        </DangerButtonAction>

      </FragmentBody>

    </FragmentLayout>
  );
}