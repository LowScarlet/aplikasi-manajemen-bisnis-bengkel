'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";
import { FaArrowLeft } from "react-icons/fa6";
import { User } from "./page";
import { DangerButtonAction, GhostButton, PrimaryButtonAction } from "@/app/_components/Buttons";
import { MdOutlineDeleteOutline } from "react-icons/md";

export default function ClientPage({
  user,
  onSubmit,
  onDelete,
}: {
  user: NonNullable<User>;
  onSubmit: (formData: FormData) => void;
  onDelete: () => void;
}) {
  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/pengguna/${user.id}`}>
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Edit Pengguna
          </h1>
        </div>

        <form action={onDelete}>
          <DangerButtonAction
            type="submit"
            onClick={(e) => {
              if (!confirm("Yakin mau hapus pengguna ini?")) {
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

        {/* FORM UPDATE */}
        <form id="update-form" action={onSubmit} className="space-y-4">

          <input
            name="nama"
            defaultValue={user.nama}
            className="p-2 border rounded w-full"
            required
          />

          <input
            name="username"
            defaultValue={user.username ?? ""}
            className="p-2 border rounded w-full"
            required
          />

          <select
            name="peran"
            defaultValue={user.peran}
            className="p-2 border rounded w-full"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MEKANIK">MEKANIK</option>
          </select>

        </form>

      </FragmentBody>

      {/* FOOTER (STICKY) */}
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