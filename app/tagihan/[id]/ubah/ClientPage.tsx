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

import { updateTagihan } from "./page";

export default function ClientPage({ data }: { data: any }) {

  const router = useRouter();

  const [form, setForm] = useState({
    namaCustomer: data.namaCustomer ?? "",
    catatan: data.catatan ?? "",
    status: data.status ?? "PROSES",
    statusPembayaran: data.statusPembayaran ?? "BELUM_BAYAR",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateTagihan(data.id, form);

      router.push(`/tagihan/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FragmentLayout>

      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/tagihan/${data.id}`}>
            <FiArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Ubah Informasi Tagihan
          </h1>
        </div>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        <div className="space-y-3">

          {/* CUSTOMER */}
          <div>
            <p className="mb-1 text-xs">Nama Customer</p>
            <input
              value={form.namaCustomer}
              onChange={(e) =>
                setForm({ ...form, namaCustomer: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full text-sm"
            />
          </div>

          {/* CATATAN */}
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

          {/* STATUS PEKERJAAN */}
          <div>
            <p className="mb-1 text-xs">Status Pengerjaan</p>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full text-sm"
            >
              <option value="PROSES">Proses</option>
              <option value="SELESAI">Selesai</option>
              <option value="BATAL">Batal</option>
            </select>
          </div>

          {/* STATUS PEMBAYARAN */}
          <div>
            <p className="mb-1 text-xs">Status Pembayaran</p>
            <select
              value={form.statusPembayaran}
              onChange={(e) =>
                setForm({ ...form, statusPembayaran: e.target.value })
              }
              className="px-3 py-2 border rounded-lg w-full text-sm"
            >
              <option value="BELUM_BAYAR">Belum Bayar</option>
              <option value="SEBAGIAN">Sebagian</option>
              <option value="LUNAS">Lunas</option>
            </select>
          </div>

        </div>

        <PrimaryButtonAction onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </PrimaryButtonAction>

      </FragmentBody>

    </FragmentLayout>
  );
}