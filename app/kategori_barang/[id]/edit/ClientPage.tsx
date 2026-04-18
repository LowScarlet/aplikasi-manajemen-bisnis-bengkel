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
import { Kategori } from "./page";

export default function ClientPage({
  kategori,
  onSubmit,
  onDelete,
}: {
  kategori: NonNullable<Kategori>;
  onSubmit: (prevState: any, formData: FormData) => any;
  onDelete: () => void;
}) {
  const [state, formAction] = useActionState(onSubmit, {
    errors: {},
    values: {
      nama: kategori.nama,
      kode: kategori.kode ?? "",
    },
  });

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/kategori_barang/${kategori.id}`}>
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Edit Kategori
          </h1>
        </div>

        {/* DELETE */}
        <form action={onDelete}>
          <DangerButtonAction
            type="submit"
            onClick={(e) => {
              if (!confirm("Yakin mau hapus kategori ini?")) {
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
          form="update-form"
        >
          Update
        </PrimaryButtonAction>
      </FragmentFooter>

    </FragmentLayout>
  );
}