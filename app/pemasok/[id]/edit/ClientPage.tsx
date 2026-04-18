/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";

import {
  DangerButtonAction,
  GhostButton,
  PrimaryButtonAction
} from "@/app/_components/Buttons";

import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { useActionState } from "react";
import { FormField, Input } from "@/app/_components/Form";
import { Supplier } from "./page";

export default function ClientPage({
  supplier,
  onSubmit,
  onDelete,
}: {
  supplier: NonNullable<Supplier>;
  onSubmit: (prevState: any, formData: FormData) => any;
  onDelete: () => void;
}) {
  const [state, formAction] = useActionState(onSubmit, {
    errors: {},
    values: {
      nama: supplier.nama,
      telepon: supplier.telepon ?? "",
      alamat: supplier.alamat ?? "",
    },
  });

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/pemasok/${supplier.id}`}>
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Edit Pemasok
          </h1>
        </div>

        {/* DELETE */}
        <form action={onDelete}>
          <DangerButtonAction
            type="submit"
            onClick={(e) => {
              if (!confirm("Yakin mau hapus pemasok ini?")) {
                e.preventDefault();
              }
            }}
          >
            <MdOutlineDeleteOutline />
          </DangerButtonAction>
        </form>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* GLOBAL ERROR */}
        {state.errors?.global && (
          <p className="text-red-500 text-sm">
            {state.errors.global}
          </p>
        )}

        <form id="update-form" action={formAction} className="space-y-4">

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
          form="update-form"
        >
          Update
        </PrimaryButtonAction>
      </FragmentFooter>

    </FragmentLayout>
  );
}