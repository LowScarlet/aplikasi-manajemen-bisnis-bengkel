/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from "next/link";

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

import { Card } from "@/app/_components/Card";

import { FiArrowLeft, FiPlus, FiPrinter } from "react-icons/fi";
import { format } from "@/libs/utils";
import { StatusBadge, TipeBadge } from "@/app/_components/Badge";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={highlight ? "font-semibold text-red-500" : "font-medium"}>
        Rp {value.toLocaleString("id-ID")}
      </span>
    </div>
  );
}

export default function ClientPage({ data }: { data: any }) {
  const total = data.total ?? 0;
  const dibayar = data.dibayar ?? 0;
  const sisa = total - dibayar;

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/tagihan">
            <FiArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Detail Tagihan
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/tagihan/${data.id}/kuitansi`}>
            <PrimaryButtonAction>
              <FiPrinter size={14} />
            </PrimaryButtonAction>
          </Link>
        </div>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* INFO */}
        <Card className="">
          <div className="flex justify-between items-start gap-2 space-y-2">
            <div className="flex-1">
              <p className="font-medium">{data.kode}</p>
              <p className="text-neutral-500 text-sm">
                {data.namaCustomer ?? "-"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <StatusBadge status={data.status} />
              <StatusBadge status={data.statusPembayaran} />
            </div>
          </div>

          <p className="mt-4 text-neutral-500 text-sm">
            {data.catatan ?? "Tidak Ada Catatan!"}
          </p>
        </Card>

        <div className="flex gap-2 py-2">
          <PrimaryButtonAction>
            <MdEdit /> Ubah Informasi
          </PrimaryButtonAction>
          <PrimaryButtonAction>
            <MdEdit /> Ubah Status
          </PrimaryButtonAction>
        </div>

        {/* ITEMS */}
        <Card className="space-y-3">
          <p className="font-medium text-sm">
            Barang & Layanan
          </p>

          {data.details.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada item
            </p>
          )}

          {data.details.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.nama}</p>

                <p className="text-neutral-400 text-xs">
                  {item.qty} x Rp {format(item.harga)}
                </p>

                <TipeBadge tipe={item.tipe} />
              </div>

              <p className="font-semibold">
                Rp {format(item.subtotal)}
              </p>
            </div>
          ))}


          <div className="flex gap-2">
            <button
              className="flex justify-center items-center gap-2 py-3 border border-dashed rounded-xl w-full text-sm"
            >
              <FiPlus /> Jasa
            </button>
            <button
              className="flex justify-center items-center gap-2 py-3 border border-dashed rounded-xl w-full text-sm"
            >
              <FiPlus /> Lainnya
            </button>
          </div>
        </Card>

        {/* TOTAL */}
        <Card className="space-y-2 text-sm">
          <Row label="Total" value={total} />
          <Row label="Dibayar" value={dibayar} />
          {sisa <= 0 ? (
            <Row label="Kembalian" value={Math.abs(sisa)} />
          ) : (
            <Row label="Sisa" value={sisa} highlight />
          )}
        </Card>

        {/* RIWAYAT */}
        <Card className="space-y-2 text-sm">
          <p className="font-medium">Riwayat Pembayaran</p>

          {data.pembayaran.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Belum ada pembayaran
            </p>
          )}

          {data.pembayaran.map((p: any) => (
            <div key={p.id} className="flex justify-between items-start gap-8 cursor-pointer">
              <div className="flex justify-between grow">
                <div>
                  <p className="font-medium">
                    Rp {format(p.jumlah)}
                  </p>
                  <p className="text-neutral-500 text-xs">
                    {p.metode ?? "-"}
                  </p>
                </div>

                <p className="text-neutral-400 text-xs">
                  {new Date(p.dibuatPada).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="">
                <DangerButtonAction>
                  <MdDelete />
                </DangerButtonAction>
              </div>
            </div>
          ))}
        </Card>

      </FragmentBody>

      {/* FOOTER */}
      {sisa > 0 && (
        <FragmentFooter>
          <div className="space-y-2 px-4 py-2">
            <PrimaryButtonAction>
              <FaPlus /> Tambah Pembayaran
            </PrimaryButtonAction>
          </div>

        </FragmentFooter>
      )}

    </FragmentLayout>
  );
}