/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useState,
} from "react";

import {
  FiArrowLeft,
  FiCamera,
  FiImage,
} from "react-icons/fi";

import imageCompression from "browser-image-compression";

import { useRouter } from "next/navigation";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter
} from "@/app/_components/Layouts/FragmentLayout";

import {
  format
} from "@/libs/utils";

import { parseInvoices, saveScanItems } from "./page";

export default function ClientPage({
  data,
}: {
  data: any;
}) {

  const router = useRouter();

  const [items, setItems] =
    useState<any[]>([]);

  const [ongkos, setOngkos] =
    useState(0);

  const [files, setFiles] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const grandTotal =
    items.reduce(
      (acc, item) =>
        acc + item.harga,
      0
    ) + ongkos;

  async function compressImages(
    files: File[]
  ) {

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    };

    return await Promise.all(
      files.map(async (file) => {

        try {

          return await imageCompression(
            file,
            options
          );

        } catch {

          return file;
        }
      })
    );
  }

  async function processFiles(
    selectedFiles: File[]
  ) {

    if (
      selectedFiles.length <= 0 ||
      loading
    ) return;

    try {

      setLoading(true);

      setFiles(selectedFiles);

      const compressedFiles =
        await compressImages(
          selectedFiles
        );

      const formData =
        new FormData();

      compressedFiles.forEach(
        (file) => {

          formData.append(
            "files",
            file,
            file.name
          );
        }
      );

      const result =
        await parseInvoices(
          formData
        );

      setItems((prev) => [
        ...prev,
        ...(result.item || []),
      ]);

      setOngkos((prev) =>
        prev + (result.ongkos || 0)
      );

      // reset file setelah scan berhasil
      setFiles([]);

    } catch (err) {

      console.error(err);

      alert(
        "Gagal scan invoice"
      );

    } finally {

      setLoading(false);
    }
  }

  async function handleSave() {

    if (items.length <= 0) return;

    try {

      setSaving(true);

      await saveScanItems(
        data.id,
        items,
        ongkos
      );

      router.push(`/tagihan/${data.id}`);

    } catch (err) {

      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Gagal simpan items"
      );

    } finally {

      setSaving(false);
    }
  }

  return (
    <FragmentLayout>

      <FragmentHeader>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              router.back()
            }
            className="btn btn-ghost btn-square"
          >
            <FiArrowLeft />
          </button>

          <h1 className="font-bold text-xl">
            Scan Invoice
          </h1>

        </div>

      </FragmentHeader>

      <FragmentBody className="space-y-4">

        {items.length <= 0 && !loading && (

          <div
            className="flex flex-col justify-center items-center opacity-60 py-20 text-center"
          >

            <FiCamera
              size={40}
              className="mb-3"
            />

            <p className="font-medium">
              Belum ada hasil scan
            </p>

            <p className="text-sm">
              Ambil foto invoice
              untuk mulai scan
            </p>

          </div>
        )}

        {/* loading */}
        {loading && items.length <= 0 && (

          <div className="py-20 text-center">

            <span className="loading loading-spinner loading-lg" />

            <p className="opacity-60 mt-3 text-sm">
              Memproses invoice...
            </p>

          </div>
        )}

        {/* LIST ITEMS */}
        {items.length > 0 && (

          <div className="space-y-3">

            {items.map((item, index) => (

              <div
                key={index}
                className="bg-base-100 shadow-sm card"
              >

                <div className="space-y-4 p-4">

                  <div className="flex justify-between items-start gap-3">

                    <div className="flex-1 space-y-4">

                      {/* nama */}
                      <fieldset className="fieldset">

                        <legend className="fieldset-legend">
                          Nama
                        </legend>

                        <input
                          type="text"
                          value={item.nama}
                          onChange={(e) => {

                            const value =
                              e.target.value;

                            setItems((prev) =>
                              prev.map(
                                (x, i) =>
                                  i === index
                                    ? {
                                      ...x,
                                      nama: value,
                                    }
                                    : x
                              )
                            );
                          }}
                          className="w-full input input-bordered"
                        />

                      </fieldset>

                      <div className="gap-3 grid grid-cols-5">

                        {/* qty */}
                        <fieldset className="col-span-1 fieldset">

                          <legend className="fieldset-legend">
                            Qty
                          </legend>

                          <input
                            value="1"
                            readOnly
                            className="w-full input input-bordered"
                          />

                        </fieldset>

                        {/* harga */}
                        <fieldset className="col-span-2 fieldset">

                          <legend className="fieldset-legend">
                            Harga
                          </legend>

                          <label
                            className="flex items-center gap-2 w-full input input-bordered"
                          >

                            <span>Rp</span>

                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                item.harga
                                  ? format(
                                    item.harga
                                  )
                                  : ""
                              }
                              onChange={(e) => {

                                const raw =
                                  e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );

                                const harga =
                                  Number(raw);

                                setItems((prev) =>
                                  prev.map(
                                    (x, i) =>
                                      i === index
                                        ? {
                                          ...x,
                                          harga,
                                        }
                                        : x
                                  )
                                );
                              }}
                              placeholder="0"
                              className="grow"
                            />

                          </label>

                        </fieldset>

                        {/* subtotal */}
                        <fieldset className="col-span-2 fieldset">

                          <legend className="fieldset-legend">
                            Subtotal
                          </legend>

                          <label
                            className="flex items-center gap-2 w-full input input-bordered"
                          >

                            <span>Rp</span>

                            <input
                              value={
                                format(item.harga)
                              }
                              className="font-bold grow"
                              readOnly
                            />

                          </label>

                        </fieldset>

                      </div>

                    </div>

                  </div>

                  <div>

                    <button
                      type="button"
                      onClick={() => {

                        setItems((prev) =>
                          prev.filter(
                            (_, i) =>
                              i !== index
                          )
                        );
                      }}
                      className="w-full btn btn-error btn-sm"
                    >
                      Hapus
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </FragmentBody>

      <FragmentFooter>

        <div className="space-y-3 p-4">

          <div className="collapse collapse-arrow bg-base-100 border border-base-300">

            <input
              type="checkbox"
              className="peer"
              defaultChecked
            />

            <div className="collapse-title font-medium text-sm">
              Detail Pembelian ({items.length} Item)
            </div>

            <div className="collapse-content text-sm">

              <div className="space-y-4">

                {/* ongkos */}
                <div className="flex justify-between items-center gap-3">

                  <span className="opacity-70 whitespace-nowrap">
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

                {/* grand total */}
                <div
                  className="flex justify-between items-center pt-2 border-base-300 border-t font-medium"
                >

                  <span>
                    Grand Total
                  </span>

                  <span className="font-bold text-lg">
                    Rp{format(grandTotal)}
                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="space-y-3">



            {/* list file */}
            {files.length > 0 && (

              <div className="bg-base-100 shadow-sm card">

                <div className="divide-y">

                  {files.map(
                    (file, index) => (

                      <div
                        key={index}
                        className="flex justify-between items-center p-3 text-sm"
                      >

                        <div className="flex items-center gap-2 min-w-0">

                          <FiImage
                            className="opacity-60 shrink-0"
                          />

                          <span className="truncate">
                            {file.name}
                          </span>

                        </div>

                        <div className="opacity-60 text-xs whitespace-nowrap">

                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {files.length <= 0 ? (

              <label
                className="btn-outline w-full btn"
              >

                <FiCamera />

                Pilih / Foto Invoice

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {

                    const selected =
                      Array.from(
                        e.target.files || []
                      );

                    setFiles(selected);
                  }}
                />

              </label>

            ) : (

              <button
                type="button"
                onClick={() => {

                  processFiles(files);
                }}
                disabled={loading}
                className="btn-outline w-full btn btn-secondary"
              >

                {loading
                  ? "Memproses..."
                  : "Scan Invoice"}

              </button>

            )}

            {/* simpan */}
            {items.length > 0 && (

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full grow btn btn-primary"
              >

                {saving
                  ? "Menyimpan..."
                  : "Simpan"}

              </button>
            )}


          </div>

        </div>

      </FragmentFooter>

    </FragmentLayout>
  );
}