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
import { Layanan } from "./page";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

export default function ClientPage({
  layanan,
}: {
  layanan: NonNullable<Layanan>;
}) {
  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/layanan">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Detail Layanan
          </h1>
        </div>

        <PrimaryButton
          href={`/layanan/${layanan.id}/edit`}
        >
          <MdEdit />
        </PrimaryButton>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        <Card className="space-y-3">

          <div>
            <p className="text-neutral-500 text-sm">Nama</p>
            <p className="font-medium">{layanan.nama}</p>
          </div>

          <div>
            <p className="text-neutral-500 text-sm">Harga</p>
            <p className="font-medium">
              {formatRupiah(layanan.harga)}
            </p>
          </div>

        </Card>

      </FragmentBody>

    </FragmentLayout>
  );
}