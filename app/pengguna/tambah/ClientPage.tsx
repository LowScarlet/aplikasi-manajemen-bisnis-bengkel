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
import { FormField, Input, Select } from "@/app/_components/Form";

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
          <GhostButton href="/pengguna">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Tambah Pengguna
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
            label="Username"
            name="username"
            error={state.errors?.username}
          >
            <Input
              id="username"
              name="username"
              defaultValue={state.values?.username}
            />
          </FormField>

          <FormField
            label="Password"
            name="password"
            error={state.errors?.password}
          >
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue={state.values?.password}
            />
          </FormField>

          <FormField
            label="Peran"
            name="peran"
            error={state.errors?.peran}
          >
            <Select
              id="peran"
              name="peran"
              defaultValue={state.values?.peran}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MEKANIK">MEKANIK</option>
            </Select>
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