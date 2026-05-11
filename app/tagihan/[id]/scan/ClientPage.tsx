/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useState,
  useTransition,
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

import { parseInvoices } from "./page";

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

  const [loading, startTransition] =
    useTransition();

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

      setItems(result.item || []);
      setOngkos(result.ongkos || 0);

    } catch (err) {

      console.error(err);

      alert(
        "Gagal scan invoice"
      );
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
        {loading && (

          <div className="py-20 text-center">

            <span className="loading loading-spinner loading-lg" />

            <p className="opacity-60 mt-3 text-sm">
              Memproses invoice...
            </p>

          </div>
        )}

        {/* LIST ITEMS */}
        {items.length > 0 && (

          <div className="bg-base-100 shadow-sm card">

            <div className="divide-y">

              {items.map((item, index) => (

                <div
                  key={index}
                  className="space-y-4 p-4"
                >

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

                      <div className="gap-3 grid grid-cols-3">

                        {/* qty */}
                        <fieldset className="fieldset">

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
                        <fieldset className="fieldset">

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
                        <fieldset className="fieldset">

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

                    {/* hapus */}
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
                      className="btn btn-error btn-sm"
                    >
                      Hapus
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </div>
        )}

      </FragmentBody>

      <FragmentFooter className="space-y-4 p-4">

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
          className="flex justify-between items-center"
        >

          <span className="font-medium">
            Grand Total
          </span>

          <span className="font-bold text-xl">
            Rp{format(grandTotal)}
          </span>

        </div>

        <div className="space-y-3">

          <div className="gap-3 grid grid-cols-2">

            {/* pilih galeri */}
            <label
              className="btn-outline btn"
            >

              <FiImage />

              Pilih Foto

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

            {/* kamera */}
            <label
              className="btn-outline btn"
            >

              <FiCamera />

              Foto Langsung

              <input
                type="file"
                accept="image/*"
                capture="environment"
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

          </div>

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

          {/* tombol */}
          {items.length > 0 ? (

            <button
              type="button"
              className="w-full btn btn-primary"
            >
              Simpan
            </button>

          ) : (

            <button
              type="button"
              onClick={() => {

                startTransition(() => {
                  processFiles(files);
                });
              }}
              disabled={
                loading ||
                files.length <= 0
              }
              className="w-full btn btn-primary"
            >

              {loading
                ? "Memproses..."
                : "Scan Invoice"}

            </button>

          )}

        </div>

      </FragmentFooter>

    </FragmentLayout>
  );
}