// ClientPage.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter
} from "@/app/_components/Layouts/FragmentLayout";

import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

import { addItems } from "./page";

import { cn, format } from "@/libs/utils";

import { TipeBadge } from "@/app/_components/Badge";

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

  const [ongkos, setOngkos] = useState(0);

  const grandTotal =
    items.reduce(
      (acc, item) =>
        acc + (item.qty * item.harga),
      0
    ) + ongkos;

  const hasUnsavedChanges =
    items.length > 0;

  useEffect(() => {

    const handleBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {

      if (!hasUnsavedChanges) return;

      event.preventDefault();

      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };

  }, [hasUnsavedChanges]);

  const handleBack = () => {

    if (
      hasUnsavedChanges &&
      !confirm(
        "Perubahan belum disimpan. Keluar?"
      )
    ) {
      return;
    }

    router.replace(`/tagihan/${data.id}`);
  };

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

      await addItems(data.id, items, ongkos);

      router.replace(`/tagihan/${data.id}`);

    } catch (err) {

      console.error(err);

      alert("Gagal menyimpan item");

    } finally {

      setLoading(false);
    }
  };

  return (
    <FragmentLayout>

      <FragmentHeader>
        <div className="flex items-center gap-2">

          <button
            onClick={handleBack}
            className="btn btn-ghost btn-square"
          >
            <FiArrowLeft />
          </button>

          <h1 className="font-bold text-xl">
            Tambah Barang / Layanan
          </h1>

        </div>

      </FragmentHeader>

      <FragmentBody className="space-y-4">
        <div>

          {items.length <= 0 && (
            <div className="opacity-60 py-10 text-sm text-center">
              Belum ada item
            </div>
          )}

          {items.map((item, index) => {
            const isLastItem =
              index === items.length - 1

            return (
              <div
                key={item.id ?? index}
                className={cn(
                  "flex justify-between gap-2 py-3 text-sm",
                  !isLastItem &&
                  "border-b border-base-content border-dashed"
                )}
              >
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium">
                      {item.nama}
                    </p>

                    <div>
                      <TipeBadge tipe={item.tipe} />
                    </div>
                  </div>

                  <div className="flex justify-between gap-2 mt-0.5 text-xs">
                    <p className="text-neutral-400">
                      {item.qty} x Rp {format(item.harga)}
                    </p>

                    <p className="font-bold text-neutral-400 text-end">
                      Rp {format(item.qty * item.harga)}
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() =>
                      handleDeleteItem(index)
                    }
                    className="btn btn-error btn-sm btn-square"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )
          })}

        </div>

      </FragmentBody>
      <FragmentFooter className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Grand Total
            </span>

            <span className="font-bold text-xl">
              Rp{format(grandTotal)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-3">

            <span className="whitespace-nowrap">
              Ongkos
            </span>

            <label className="flex items-center gap-2 w-44 input input-bordered">

              <span>Rp</span>

              <input
                type="text"
                inputMode="numeric"
                value={
                  ongkos
                    ? format(ongkos)
                    : ""
                }
                onChange={(e) => {

                  const raw =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setOngkos(
                    Number(raw)
                  );
                }}
                className="grow"
                placeholder="0"
              />

            </label>

          </div>
        </div>
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

          <div className="gap-3 grid grid-cols-3">

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
          <div className="space-y-3 py-3">
            <button
              type="button"
              onClick={handleAddToList}
              className="w-full btn btn-secondary"
            >
              Tambah ke Daftar
            </button>

            <div className="py-4 divider" />

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
                `Simpan ${items.length} Item`
              )}
            </button>
          </div>

        </div>
      </FragmentFooter>

    </FragmentLayout>
  );
}