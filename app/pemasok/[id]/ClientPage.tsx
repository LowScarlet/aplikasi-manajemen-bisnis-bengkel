'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
} from "@/app/_components/Layouts/FragmentLayout";
import { FaArrowLeft } from "react-icons/fa6";
import { GhostButton, PrimaryButton } from "@/app/_components/Buttons";
import { Card } from "@/app/_components/Card";
import { MdEdit } from "react-icons/md";
import { Supplier } from "./page";

export default function ClientPage({
  supplier,
}: {
  supplier: NonNullable<Supplier>;
}) {
  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/pemasok">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Detail Pemasok
          </h1>
        </div>

        <PrimaryButton
          href={`/pemasok/${supplier.id}/edit`}
        >
          <MdEdit />
        </PrimaryButton>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        <Card className="space-y-3">

          <div>
            <p className="text-neutral-500 text-sm">Nama</p>
            <p className="font-medium">{supplier.nama}</p>
          </div>

          <div>
            <p className="text-neutral-500 text-sm">Telepon</p>
            <p className="font-medium">
              {supplier.telepon ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-neutral-500 text-sm">Alamat</p>
            <p className="font-medium">
              {supplier.alamat ?? "-"}
            </p>
          </div>

        </Card>

      </FragmentBody>

    </FragmentLayout>
  );
}