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
import { Layanan } from "./page";

export default function ClientPage({
  layanan,
  onSubmit,
  onDelete,
}: {
  layanan: NonNullable<Layanan>;
  onSubmit: (prevState: any, formData: FormData) => any;
  onDelete: () => void;
}) {
  const [state, formAction] = useActionState(onSubmit, {
    errors: {},
    values: {
      nama: layanan.nama,
      harga: layanan.harga,
    },
  });

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/layanan/${layanan.id}`}>
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Edit Layanan
          </h1>
        </div>

        {/* DELETE */}
        <form action={onDelete}>
          <DangerButtonAction
            type="submit"
            onClick={(e) => {
              if (!confirm("Yakin mau hapus layanan ini?")) {
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
            label="Nama Layanan"
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
            label="Harga"
            name="harga"
            error={state.errors?.harga}
          >
            <Input
              id="harga"
              name="harga"
              type="number"
              defaultValue={state.values?.harga}
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