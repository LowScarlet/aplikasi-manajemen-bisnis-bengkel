'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
} from "@/app/_components/Layouts/FragmentLayout";
import { FaArrowLeft } from "react-icons/fa6";
import { User } from "./page";
import { GhostButton, PrimaryButton } from "@/app/_components/Buttons";
import { Card } from "@/app/_components/Card";
import { MdEdit } from "react-icons/md";

export default function ClientPage({
  user,
}: {
  user: NonNullable<User>;
}) {
  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/pengguna">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Detail Pengguna
          </h1>
        </div>

        <PrimaryButton
          href={`/pengguna/${user.id}/edit`}
        >
          <MdEdit />
        </PrimaryButton>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        <Card className="space-y-3">

          <div>
            <p className="text-neutral-500 text-sm">Nama</p>
            <p className="font-medium">{user.nama}</p>
          </div>

          <div>
            <p className="text-neutral-500 text-sm">Username</p>
            <p className="font-medium">@{user.username}</p>
          </div>

          <div>
            <p className="text-neutral-500 text-sm">Peran</p>
            <p className="font-medium">{user.peran}</p>
          </div>

        </Card>

      </FragmentBody>

    </FragmentLayout>
  );
}