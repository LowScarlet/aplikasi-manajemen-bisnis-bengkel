/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";

import {
  useRouter,
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
import { updateTagihan } from "./page";

export default function ClientPage({
  data,
}: any) {

  const router = useRouter();

  const [form, setForm] = useState({
    ongkos: data.ongkos,
    diskon: data.diskon,
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleSubmit = async () => {
    try {

      setLoadingSubmit(true);

      await updateTagihan(data.id, form);

      router.push(`/tagihan/${data.id}`);

    } catch (err) {

      console.error(err);

      alert("Gagal update item");

    } finally {
      setLoadingSubmit(false);
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
            Edit Detail Pembayaran
          </h1>

        </div>

      </FragmentHeader>

      <FragmentBody className="space-y-4">
        <div>
          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Ongkos
            </legend>

            <label className="flex items-center gap-2 w-full input input-bordered">

              <span>Rp</span>

              <input
                type="text"
                inputMode="numeric"
                value={
                  form.ongkos
                    ? format(form.ongkos)
                    : ""
                }
                onChange={(e) => {

                  const raw =
                    e.target.value.replace(/\D/g, "");

                  setForm({
                    ...form,
                    ongkos: Number(raw),
                  });
                }}
                placeholder="0"
                className="grow"
              />

            </label>

          </fieldset>

          <fieldset className="fieldset">

            <legend className="fieldset-legend">
              Diskon
            </legend>

            <label className="flex items-center gap-2 w-full input input-bordered">

              <span>Rp</span>

              <input
                type="text"
                inputMode="numeric"
                value={
                  form.diskon
                    ? format(form.diskon)
                    : ""
                }
                onChange={(e) => {

                  const raw =
                    e.target.value.replace(/\D/g, "");

                  setForm({
                    ...form,
                    diskon: Number(raw),
                  });
                }}
                placeholder="0"
                className="grow"
              />

            </label>

          </fieldset>

        </div>

        <div className="space-y-2">

          <button
            onClick={handleSubmit}
            disabled={loadingSubmit}
            className="w-full btn btn-primary"
          >
            {loadingSubmit
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </button>

        </div>

      </FragmentBody>

    </FragmentLayout>
  );
}