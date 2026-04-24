/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody
} from "@/app/_components/Layouts/FragmentLayout";

import {
  DangerButtonAction,
  GhostButton,
  PrimaryButton,
  PrimaryButtonAction,
} from "@/app/_components/Buttons";

import { Card } from "@/app/_components/Card";

import { FiArrowLeft, FiPlus, FiPrinter } from "react-icons/fi";
import { format, formatDate } from "@/libs/utils";
import { StatusBadge, TipeBadge } from "@/app/_components/Badge";
import { MdCancel, MdEdit } from "react-icons/md";
import Image from "next/image";
import { updateStatusTagihan } from "./page";
import { IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientPage({ data }: { data: any }) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  /* ================= CALC ================= */

  const total = data.total ?? 0;
  const dibayar = data.dibayar ?? 0;
  const sisa = total - dibayar;

  /* ================= RENDER ================= */

  const handleChangeStatus = async (status: any) => {
    try {
      setLoading(true);

      await updateStatusTagihan(data.id, status)

      router.refresh()
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

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
          <PrimaryButton href={`/tagihan/${data.id}/kuitansi`}>
            <FiPrinter size={14} />
          </PrimaryButton>
        </div>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* ================= STATUS ALERT ================= */}
        {data.status === "PROSES" && (
          <Card className="bg-yellow-50 border border-yellow-200">
            <div className="space-y-3">

              <p className="font-medium text-yellow-800 text-sm">
                Status Pengerjaan Saat Ini{" "}
                <span className="font-semibold">Sedang Di Kerjakan</span>
              </p>

              <div className="flex gap-2">
                <DangerButtonAction
                  disabled={loading}
                  onClick={() => handleChangeStatus('BATAL')}
                >
                  <MdCancel size={16} /> Batalkan
                </DangerButtonAction>

                <PrimaryButtonAction
                  disabled={loading}
                  onClick={() => handleChangeStatus('SELESAI')}
                >
                  <IoMdCheckmark size={16} /> Sudah Selesai
                </PrimaryButtonAction>
              </div>

            </div>
          </Card>
        )}

        {/* INFO */}
        <Card>
          <div className="flex justify-between gap-2">
            <div className="grow">
              <div className="flex justify-between">
                <p className="font-medium text-sm">{data.kode}</p>
                <p className="text-neutral-500 text-xs">
                  {formatDate(data.dibuatPada)}
                </p>
              </div>

              <p className="text-neutral-500 text-sm">
                {data.namaCustomer ?? "-"}
              </p>

              <p className="mt-2 text-neutral-500 text-sm">
                {data.catatan ?? "Tidak Ada Catatan!"}
              </p>

              <div className="space-y-1 mt-2 text-xs">
                <div>
                  Pengerjaan: <StatusBadge status={data.status} />
                </div>
                <div>
                  Pembayaran: <StatusBadge status={data.statusPembayaran} />
                </div>
              </div>
            </div>
            <div className="min-w-20 shrink-0">
              <Image
                src={`/tagihan/${data.id}/qrcode`}
                alt="QR Code"
                className="bg-white p-1 rounded w-20 h-20 object-contain aspect-square"
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="mt-3">
            <PrimaryButton href={`/tagihan/${data.id}/ubah`}>
              <MdEdit /> Ubah
            </PrimaryButton>
          </div>
        </Card>

        {/* ITEMS */}
        <Card className="space-y-3">
          <p className="font-medium text-sm">Barang & Layanan</p>

          {data.details.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada item
            </p>
          )}

          {data.details.map((item: any) => (
            <div key={item.id} className="flex justify-between gap-2 text-sm">
              <div className="flex-1">
                <div className="flex justify-between gap-2">
                  <p className="font-medium">{item.nama}</p>
                  <div>
                    <TipeBadge tipe={item.tipe} />
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <p className="text-neutral-400 text-xs">
                    {item.qty} x Rp {format(item.harga)}
                  </p>

                  <p className="text-neutral-400 text-xs">
                    Rp {format(item.qty * item.harga)}
                  </p>
                </div>
              </div>
              <div>
                <PrimaryButton
                  href={`/tagihan/${data.id}/ubah/item/${item.id}`}
                >
                  <MdEdit />
                </PrimaryButton>
              </div>

            </div>
          ))}

          <PrimaryButton href={`/tagihan/${data.id}/tambah/item`}>
            <FiPlus /> Tambah Barang/Jasa
          </PrimaryButton>
        </Card>

        {/* PEMBAYARAN */}
        <Card className="space-y-2 text-sm">
          <p className="font-medium">Pembayaran</p>

          {data.pembayaran.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Belum ada pembayaran
            </p>
          )}

          {data.pembayaran.map((p: any) => (
            <div key={p.id} className="flex justify-between items-center gap-2 text-sm">
              <div>
                <p>Rp {format(p.jumlah)}</p>
                {(p.metode?.trim() || p.catatan?.trim()) && (
                  <p className="text-neutral-500 text-xs">
                    {(p.metode?.trim() || "Tidak diketahui")} - {(p.catatan?.trim() || "Tidak ada catatan")}
                  </p>
                )}
              </div>
              <div>
                <PrimaryButton
                  href={`/tagihan/${data.id}/ubah/pembayaran/${p.id}`}
                >
                  <MdEdit />
                </PrimaryButton>
              </div>

            </div>
          ))}

          <PrimaryButton href={`/tagihan/${data.id}/tambah/pembayaran`}>
            <FiPlus /> Tambah Pembayaran
          </PrimaryButton>
        </Card>

        {/* TOTAL */}
        <Card className="space-y-2 text-sm">
          <p className="font-medium">Detail Pembayaran</p>

          <div className="flex justify-between">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span>Dibayar</span>
            <span className={dibayar < total ? "text-red-500 font-semibold" : ""}>
              Rp {dibayar.toLocaleString("id-ID")}
            </span>
          </div>

          {sisa <= 0 ? (
            <div className="flex justify-between">
              <span>Kembalian</span>
              <span>Rp {Math.abs(sisa).toLocaleString("id-ID")}</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span>Sisa</span>
              <span className="font-semibold text-red-500">
                Rp {sisa.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </Card>

      </FragmentBody>

    </FragmentLayout>
  );
}