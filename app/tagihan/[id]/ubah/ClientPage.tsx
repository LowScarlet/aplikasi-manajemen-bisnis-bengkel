/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody
} from "@/app/_components/Layouts/FragmentLayout";

import Link from "next/link";

import { FiArrowLeft } from "react-icons/fi";

import {
  deleteTagihan,
  updateTagihan
} from "./page";

export default function ClientPage({
  data
}: {
  data: any
}) {

  const router = useRouter();

  const [form, setForm] = useState({
    namaCustomer: data.namaCustomer ?? "",
    catatan: data.catatan ?? "",
    status: data.status ?? "PROSES",
    statusPembayaran: data.statusPembayaran ?? "BELUM_BAYAR",
  });

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateTagihan(data.id, form);

      router.replace(`/tagihan/${data.id}`);

    } catch (err) {
      console.error(err);

      alert("Gagal menyimpan perubahan");

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {

      const confirmDelete = confirm(
        "Hapus tagihan ini?"
      );

      if (!confirmDelete) return;

      setLoadingDelete(true);

      await deleteTagihan(data.id);

      router.replace("/tagihan");

    } catch (err) {

      console.error(err);

      alert("Gagal menghapus tagihan");

    } finally {

      setLoadingDelete(false);

    }
  };

  return (
    <FragmentLayout>

      <FragmentHeader>

        <div className="flex items-center gap-2">

          <Link
            href={`/tagihan/${data.id}`}
            className="btn btn-ghost btn-square"
          >
            <FiArrowLeft />
          </Link>

          <h1 className="font-bold text-xl">
            Ubah Informasi Tagihan
          </h1>

        </div>

      </FragmentHeader>

      <FragmentBody className="space-y-4">

        <div>
          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Nama Customer
            </legend>

            <input
              type="text"
              value={form.namaCustomer}
              placeholder="Masukkan nama customer"
              className="w-full input input-bordered"
              onChange={(e) =>
                setForm({
                  ...form,
                  namaCustomer:
                    e.target.value.toUpperCase()
                })
              }
            />

          </fieldset>

          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Catatan
            </legend>

            <textarea
              value={form.catatan}
              placeholder="Tambahkan catatan"
              className="w-full h-24 textarea textarea-bordered"
              onChange={(e) =>
                setForm({
                  ...form,
                  catatan: e.target.value
                })
              }
            />

          </fieldset>

          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Status Pengerjaan
            </legend>

            <select
              value={form.status}
              className="w-full select-bordered select"
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value
                })
              }
            >
              <option value="PROSES">
                Proses
              </option>

              <option value="SELESAI">
                Selesai
              </option>

              <option value="BATAL">
                Batal
              </option>

            </select>

          </fieldset>

          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Status Pembayaran
            </legend>

            <select
              value={form.statusPembayaran}
              className="w-full select-bordered select"
              onChange={(e) =>
                setForm({
                  ...form,
                  statusPembayaran:
                    e.target.value
                })
              }
            >
              <option value="BELUM_BAYAR">
                Belum Bayar
              </option>

              <option value="SEBAGIAN">
                Sebagian
              </option>

              <option value="LUNAS">
                Lunas
              </option>

            </select>

          </fieldset>

        </div>

        <div className="space-y-2 pt-2">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>

          <div className="py-4 divider" />

          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            className="btn-outline w-full btn btn-error"
          >
            {loadingDelete ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menghapus...
              </>
            ) : (
              "Hapus Tagihan"
            )}
          </button>

        </div>

      </FragmentBody>

    </FragmentLayout>
  );
}