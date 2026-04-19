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
          <GhostButton href="/tagihan">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Tambah Tagihan
          </h1>
        </div>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {state.errors?.global && (
          <p className="text-red-500 text-sm">
            {state.errors.global}
          </p>
        )}

        <form id="create-form" action={formAction} className="space-y-4">

          <FormField
            label="Nama Customer"
            name="namaCustomer"
            error={state.errors?.namaCustomer}
          >
            <Input
              id="namaCustomer"
              name="namaCustomer"
              defaultValue={state.values?.namaCustomer}
            />
          </FormField>

          <FormField
            label="Catatan"
            name="catatan"
            error={state.errors?.catatan}
          >
            <Input
              id="catatan"
              name="catatan"
              defaultValue={state.values?.catatan}
            />
          </FormField>

        </form>

      </FragmentBody>

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