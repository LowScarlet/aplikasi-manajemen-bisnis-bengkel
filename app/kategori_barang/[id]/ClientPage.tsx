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
import { Kategori } from "./page";

export default function ClientPage({
  kategori,
}: {
  kategori: NonNullable<Kategori>;
}) {
  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/kategori_barang">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Detail Kategori
          </h1>
        </div>

        <PrimaryButton
          href={`/kategori_barang/${kategori.id}/edit`}
        >
          <MdEdit />
        </PrimaryButton>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        <Card className="space-y-3">

          <div>
            <p className="text-neutral-500 text-sm">Nama</p>
            <p className="font-medium">{kategori.nama}</p>
          </div>

          <div>
            <p className="text-neutral-500 text-sm">Kode</p>
            <p className="font-medium">
              {kategori.kode ?? "-"}
            </p>
          </div>

        </Card>

      </FragmentBody>

    </FragmentLayout>
  );
}