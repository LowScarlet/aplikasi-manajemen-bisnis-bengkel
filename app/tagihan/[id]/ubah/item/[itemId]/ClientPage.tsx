/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";

import {
  useRouter,
  useSearchParams
} from "next/navigation";

import {
  format
} from "@/libs/utils";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody
} from "@/app/_components/Layouts/FragmentLayout";

import Link from "next/link";

import { FiArrowLeft } from "react-icons/fi";

import {
  deleteItem,
  updateItem
} from "./page";

export default function ClientPage({
  data,
  item
}: any) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    nama: item.nama,
    qty: item.qty,
    harga: item.harga,
    barangId: item.barangId ?? null,
    layananId: item.layananId ?? null,
    tipe: item.tipe as "BARANG" | "CUSTOM",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

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
        if (
          !form.nama ||
          form.qty <= 0 ||
          form.harga <= 0
        ) {
          alert("Isi data dengan benar");
          return;
        }
      }

      if (form.tipe === "BARANG") {
        if (!form.layananId) {
          alert("Pilih layanan");
          return;
        }
      }

      await updateItem(item.id, form);

      router.replace(`/tagihan/${data.id}`);

    } catch (err) {

      console.error(err);

      alert("Gagal update item");

    } finally {

      setLoadingSubmit(false);

    }
  };

  const handleDeleteItem = async (
    id: string
  ) => {
    try {

      const confirmDelete = confirm(
        "Hapus item ini?"
      );

      if (!confirmDelete) return;

      setLoadingDelete(true);

      await deleteItem(id);

      router.replace(`/tagihan/${data.id}`);

    } catch (err) {

      console.error(err);

      alert("Gagal hapus item");

    } finally {

      setLoadingDelete(false);

    }
  };

  const subtotal =
    (form.qty || 0) *
    (form.harga || 0);

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
            Edit Barang / Layanan
          </h1>

        </div>

      </FragmentHeader>

      <FragmentBody className="space-y-4">
        <div>
          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Nama
            </legend>

            <input
              value={form.nama}
              onChange={(e) =>
                setForm({
                  ...form,
                  nama: e.target.value
                })
              }
              placeholder="Masukkan nama item"
              className="w-full input input-bordered"
            />

          </fieldset>

          <div className="gap-3 grid grid-cols-3">

            <fieldset className="fieldset">

              <legend className="fieldset-legend">
                Qty
              </legend>

              <input
                type="number"
                min={1}
                value={form.qty || ""}
                onChange={(e) => {

                  const raw = e.target.value;

                  if (raw === "") {

                    setForm({
                      ...form,
                      qty: 0,
                    });

                    return;
                  }

                  const cleaned =
                    raw.replace(/^0+(?=\d)/, "");

                  setForm({
                    ...form,
                    qty: Number(cleaned),
                  });
                }}
                className="w-full input input-bordered"
              />

            </fieldset>

            <fieldset className="fieldset">

              <legend className="fieldset-legend">
                Harga
              </legend>

              <label className="flex items-center gap-2 w-full input input-bordered">

                <span>Rp</span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    form.harga
                      ? format(form.harga)
                      : ""
                  }
                  onChange={(e) => {

                    const raw =
                      e.target.value.replace(/\D/g, "");

                    setForm({
                      ...form,
                      harga: Number(raw),
                    });
                  }}
                  placeholder="0"
                  className="grow"
                />

              </label>

            </fieldset>

            <fieldset className="fieldset">

              <legend className="fieldset-legend">
                Subtotal
              </legend>

              <label className="flex items-center gap-2 w-full input input-bordered">

                <span>Rp</span>

                <input
                  value={format(subtotal)}
                  className="font-bold grow"
                  readOnly
                />

              </label>

            </fieldset>

          </div>

        </div>

        <div className="space-y-2">

          <button
            onClick={handleSubmit}
            disabled={loadingSubmit}
            className="w-full btn btn-primary"
          >
            {loadingSubmit ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>

          <div className="py-4 divider" />

          <button
            onClick={() =>
              handleDeleteItem(item.id)
            }
            disabled={loadingDelete}
            className="btn-outline w-full btn btn-error"
          >
            {loadingDelete ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menghapus...
              </>
            ) : (
              "Hapus Item"
            )}
          </button>

        </div>

      </FragmentBody>

    </FragmentLayout>
  );
}