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
          <GhostButton href="/pemasok">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Tambah Pemasok
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
            label="Nama"
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
            label="Telepon"
            name="telepon"
            error={state.errors?.telepon}
          >
            <Input
              id="telepon"
              name="telepon"
              defaultValue={state.values?.telepon}
            />
          </FormField>

          <FormField
            label="Alamat"
            name="alamat"
            error={state.errors?.alamat}
          >
            <Input
              id="alamat"
              name="alamat"
              defaultValue={state.values?.alamat}
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