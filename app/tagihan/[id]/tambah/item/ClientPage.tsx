// ClientPage.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter
} from "@/app/_components/Layouts/FragmentLayout";

import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

import { addItems } from "./page";

import { format } from "@/libs/utils";

import Link from "next/link";

export default function ClientPage({
  data,
}: {
  data: any;
}) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [itemForm, setItemForm] = useState({
    nama: "",
    qty: 1,
    harga: 0,
    barangId: null as string | null,
    layananId: null as string | null,
    tipe: "CUSTOM" as "LAYANAN" | "CUSTOM",
  });

  const [items, setItems] = useState<any[]>([]);

  const subtotal =
    (itemForm.qty || 0) *
    (itemForm.harga || 0);

  const grandTotal = items.reduce(
    (acc, item) =>
      acc + (item.qty * item.harga),
    0
  );

  const handleAddToList = () => {

    if (
      !itemForm.nama ||
      itemForm.qty <= 0 ||
      itemForm.harga <= 0
    ) {
      alert("Isi data dengan benar");
      return;
    }

    setItems([
      ...items,
      itemForm,
    ]);

    setItemForm({
      nama: "",
      qty: 1,
      harga: 0,
      barangId: null,
      layananId: null,
      tipe: "CUSTOM",
    });
  };

  const handleDeleteItem = (
    index: number
  ) => {

    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {

    try {

      setLoading(true);

      if (!items.length) {
        alert("Belum ada item");
        return;
      }

      await addItems(data.id, items);

      router.push(`/tagihan/${data.id}`);

    } catch (err) {

      console.error(err);

      alert("Gagal menyimpan item");

    } finally {

      setLoading(false);
    }
  };

  return (
    <FragmentLayout>

      <FragmentHeader className="flex">
        <div>


          <div className="flex items-center gap-2">

            <Link
              href={`/tagihan/${data.id}`}
              className="btn btn-ghost btn-square"
            >
              <FiArrowLeft />
            </Link>

            <h1 className="font-bold text-xl">
              Tambah Barang / Layanan
            </h1>

          </div>



          <div className="p-4 border rounded-2xl">

            <div className="flex justify-between items-center">

              <span className="font-medium">
                Grand Total
              </span>

              <span className="font-bold text-xl">
                Rp{format(grandTotal)}
              </span>

            </div>

          </div>
        </div>

      </FragmentHeader>

      <FragmentBody className="space-y-4">
        <div>

          {items.length <= 0 && (
            <div className="opacity-60 py-10 text-sm text-center">
              Belum ada item
            </div>
          )}

          {items.map((item, index) => (

            <div
              key={index}
              className="flex justify-between items-center p-4 border rounded-2xl"
            >

              <div>

                <div className="font-bold">
                  {item.nama}
                </div>

                <div className="opacity-70 text-sm">
                  {item.qty} x Rp
                  {format(item.harga)}
                </div>

                <div className="mt-1 font-bold">
                  Rp
                  {format(
                    item.qty * item.harga
                  )}
                </div>

              </div>

              <button
                onClick={() =>
                  handleDeleteItem(index)
                }
                className="btn btn-error btn-sm btn-square"
              >
                <FiTrash2 />
              </button>

            </div>
          ))}

        </div>

      </FragmentBody>
      <FragmentFooter>


        <div>
          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Nama
            </legend>

            <input
              value={itemForm.nama}
              onChange={(e) =>
                setItemForm({
                  ...itemForm,
                  nama: e.target.value,
                })
              }
              placeholder="Masukkan nama item"
              className="w-full input input-bordered"
            />

          </fieldset>

          <div className="gap-3 grid grid-cols-2">

            <fieldset className="fieldset">

              <legend className="fieldset-legend">
                Qty
              </legend>

              <input
                type="number"
                min={1}
                value={itemForm.qty || ""}
                onChange={(e) => {

                  const raw = e.target.value;

                  if (raw === "") {

                    setItemForm({
                      ...itemForm,
                      qty: 0,
                    });

                    return;
                  }

                  const cleaned =
                    raw.replace(/^0+(?=\d)/, "");

                  setItemForm({
                    ...itemForm,
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
                    itemForm.harga
                      ? format(itemForm.harga)
                      : ""
                  }
                  onChange={(e) => {

                    const raw =
                      e.target.value.replace(/\D/g, "");

                    setItemForm({
                      ...itemForm,
                      harga: Number(raw),
                    });
                  }}
                  placeholder="0"
                  className="grow"
                />

              </label>

            </fieldset>

          </div>

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

          <button
            type="button"
            onClick={handleAddToList}
            className="w-full btn btn-secondary"
          >
            Tambah ke Daftar
          </button>


          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading
              ? "Menyimpan..."
              : `Simpan ${items.length} Item`}
          </button>

        </div>
      </FragmentFooter>

    </FragmentLayout>
  );
}