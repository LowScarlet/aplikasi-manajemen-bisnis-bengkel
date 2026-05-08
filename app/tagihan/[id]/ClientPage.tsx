/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter
} from "@/app/_components/Layouts/FragmentLayout";

import {
  PrimaryButton
} from "@/app/_components/Buttons";


import { FiArrowLeft, FiPlus, FiPrinter } from "react-icons/fi";
import { cn, format, formatDate } from "@/libs/utils";
import { StatusBadge, TipeBadge } from "@/app/_components/Badge";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import { updateStatusTagihan } from "./page";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRupiahSign } from "react-icons/fa6";
import { RiProgress2Fill } from "react-icons/ri";

export default function ClientPage({ data }: { data: any }) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const subtotal = data.subtotal ?? 0;
  const ongkos = data.ongkos ?? 0;
  const diskon = data.diskon ?? 0;
  const total = data.total ?? 0;

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

      <FragmentHeader>
        <div className="flex items-center gap-2">
          <Link href="/tagihan" className="btn btn-ghost btn-square">
            <FiArrowLeft />
          </Link>

          <h1 className="font-bold text-xl">
            Detail Tagihan
          </h1>
        </div>
        <Link href={`/tagihan/${data.id}/kuitansi`} className="btn btn-primary btn-square btn-sm">
          <FiPrinter size={14} />
        </Link>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        {data.status === "PROSES" && (
          <div role="alert" className="alert alert-warning">
            <RiProgress2Fill size={30} />
            <div>
              <h3 className="font-bold">Apakah Pengerjaan Motor Ini Telah Selesai?</h3>
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleChangeStatus('SELESAI')}
            >
              Ya, Sudah Selesai!
            </button>
          </div>
        )}

        {data.statusPembayaran === "BELUM_BAYAR" && (
          <div role="alert" className="alert alert-warning">
            <FaRupiahSign size={30} />
            <div>
              <h3 className="font-bold">Apakah Pembayaran Untuk Tagihan Ini Telah Dibayar?</h3>
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleChangeStatus('SELESAI')}
            >
              Ya, Sudah Dibayar!
            </button>
          </div>
        )}

        <div className="bg-base-100 card">
          <div className="card-body">
            <div className="flex justify-between gap-2">
              <div className="grow">
                <div className="flex justify-between">
                  <p className="font-medium text-xs">{data.kode}</p>
                  <p className="text-xs text-end">
                    {formatDate(data.dibuatPada)}
                  </p>
                </div>

                <p className="text-lg">
                  {data.namaCustomer ?? "-"}
                </p>

                <p className="mt-2 text-sm">
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
                  className="bg-white p-1 rounded w-24 h-24 object-contain aspect-square"
                  width={100}
                  height={100}
                />
              </div>
            </div>

            <div className="mt-3">
              <Link href={`/tagihan/${data.id}/ubah`} className="w-full btn btn-primary">
                <MdEdit /> Ubah Informasi
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-base-100 card">
          <div className="card-body">
            <p className="font-medium text-sm">Barang & Layanan</p>

            {data.details.length === 0 && (
              <p className="text-neutral-500 text-sm text-center">
                Tidak ada item
              </p>
            )}

            {data.details.map((item: any, index: number) => (
              <div
                key={item.id}
                className={cn('flex justify-between gap-2 py-3 text-sm', index !== data.details.length - 1 ? "border-b border-base-content border-dashed" : "")}
              >
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium">{item.nama}</p>

                    <div>
                      <TipeBadge tipe={item.tipe} />
                    </div>
                  </div>

                  <div className="flex justify-between gap-2 mt-0.5 text-xs">
                    <p className="text-neutral-400">
                      {item.qty} x Rp {format(item.harga)}
                    </p>

                    <p className="font-bold text-neutral-400 text-end">
                      Rp {format(item.qty * item.harga)}
                    </p>
                  </div>
                </div>

                <div>
                  <Link href={`/tagihan/${data.id}/ubah/item/${item.id}`} className="btn-outline btn btn-primary btn-square">
                    <MdEdit size={24} />
                  </Link>
                </div>
              </div>
            ))}

          </div>
        </div>
      </FragmentBody>
      <FragmentFooter>
        <div className="space-y-3 p-4">
          <div className="bg-base-100 text-xs card">
            <div className="py-3 card-body">
              <p className="font-medium">Detail Pembayaran</p>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>+ Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between">
                <span>Ongkos</span>
                <span>+ Rp {ongkos.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between">
                <span>Diskon</span>
                <span>- Rp {diskon.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between mb-1 border-base-content border-t">
                <span>Total Pembayaran</span>
                <span>= Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <Link href={`/tagihan/${data.id}/tambah/item`} className="btn-outline w-full btn btn-primary btn-sm">
            <MdEdit /> Ubah Ongkos / Diskon
          </Link>
          <Link href={`/tagihan/${data.id}/tambah/item`} className="w-full btn btn-primary btn-sm">
            <FiPlus /> Tambah Barang / Layanan
          </Link>
        </div>
      </FragmentFooter>
    </FragmentLayout>
  );
}