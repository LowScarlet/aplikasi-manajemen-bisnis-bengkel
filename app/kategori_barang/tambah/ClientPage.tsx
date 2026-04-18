/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";
import { GhostButton, PrimaryButtonAction } from "@/app/_components/Buttons";
import { FaArrowLeft } from "react-icons/fa6";
import { useActionState } from "react";
import { FormField, Input } from "@/app/_components/Form";

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

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/kategori_barang">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Tambah Kategori
          </h1>
        </div>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* GLOBAL ERROR */}
        {state.errors?.global && (
          <p className="text-red-500 text-sm">
            {state.errors.global}
          </p>
        )}

        <form id="create-form" action={formAction} className="space-y-4">

          <FormField
            label="Nama Kategori"
            name="nama"
            error={state.errors?.nama}
          >
            <Input
              id="nama"
              name="nama"
              defaultValue={state.values?.nama}
            />
          </FormField>

          <FormField
            label="Kode (Opsional)"
            name="kode"
            error={state.errors?.kode}
          >
            <Input
              id="kode"
              name="kode"
              defaultValue={state.values?.kode}
            />
          </FormField>

        </form>

      </FragmentBody>

      {/* FOOTER */}
      <FragmentFooter className="py-4">
        <PrimaryButtonAction
          type="submit"
          form="create-form"
        >
          Simpan
        </PrimaryButtonAction>
      </FragmentFooter>

    </FragmentLayout>
  );
}