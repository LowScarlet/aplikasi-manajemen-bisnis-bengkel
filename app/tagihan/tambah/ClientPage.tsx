/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody
} from "@/app/_components/Layouts/FragmentLayout";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { useActionState } from "react";

export default function ClientPage({
  onSubmit,
}: {
  onSubmit: (prevState: any, formData: FormData) => any;
}) {
  const [state, formAction] = useActionState(onSubmit, {
    errors: {},
    values: {},
  });

  return (
    <FragmentLayout>

      <FragmentHeader>
        <div className="flex items-center gap-2">

          <Link
            href="/tagihan"
            className="btn btn-ghost btn-square"
          >
            <FaArrowLeft />
          </Link>

          <h1 className="font-bold text-xl">
            Tambah Tagihan
          </h1>

        </div>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        {state.errors?.global && (
          <div className="alert alert-error">
            <span>{state.errors.global}</span>
          </div>
        )}

        <form
          id="create-form"
          action={formAction}
        >
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Nama Customer
            </legend>

            <input
              id="namaCustomer"
              name="namaCustomer"
              type="text"
              defaultValue={state.values?.namaCustomer}
              placeholder="Masukkan nama customer"
              className="w-full input input-bordered"
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />

            {state.errors?.namaCustomer && (
              <p className="text-error label">
                {state.errors.namaCustomer}
              </p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Catatan
            </legend>

            <textarea
              id="catatan"
              name="catatan"
              defaultValue={state.values?.catatan}
              placeholder="Tambahkan catatan"
              className="w-full h-24 textarea textarea-bordered"
            />

            {state.errors?.catatan && (
              <p className="text-error label">
                {state.errors.catatan}
              </p>
            )}
          </fieldset>

        </form>

        <button
          type="submit"
          form="create-form"
          className="w-full btn btn-primary"
        >
          Simpan
        </button>

      </FragmentBody>

    </FragmentLayout>
  );
}