/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FiArrowLeft, FiPrinter } from "react-icons/fi";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";
import { format, formatDate } from "@/libs/utils";
import { toPng } from "html-to-image";
import { IoMdShare } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineContentCut } from "react-icons/md";
import { useMemo, useState } from "react";

export default function ClientPage({ data, userAuth }: { data: any, userAuth: any }) {
  const [enableCut, setEnableCut] = useState(true);

  const [cutMode, setCutMode] = useState<
    "equal" | "per12"
  >("equal");

  const subtotal = data.subtotal ?? 0;
  const ongkos = data.ongkos ?? 0;
  const diskon = data.diskon ?? 0;
  const total = data.total ?? 0;
  const details = data.details ?? [];

  const groupedDetails = useMemo(() => {

    // tanpa potong
    if (!enableCut) {
      return [details];
    }

    // potong per 12 item
    if (cutMode === "per12") {

      const result = [];

      for (let i = 0; i < details.length; i += 12) {
        result.push(details.slice(i, i + 12));
      }

      return result;
    }

    // ratakan otomatis
    const half = Math.ceil(details.length / 2);

    return [
      details.slice(0, half),
      details.slice(half),
    ];

  }, [details, enableCut, cutMode]);


  const handleShare = async () => {
    const element = document.getElementById("png-area");
    if (!element) return;

    try {
      const width = element.scrollWidth;
      const height = element.scrollHeight;

      const scale = 3; // 2 = bagus, 3 = HD, 4 = kalau mau overkill

      const dataUrl = await toPng(element, {
        cacheBust: true,
        width: width * scale,
        height: height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
        },
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const file = new File([blob], `e-receipt_${data.id}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.download = "e-receipt_${data.id}.png";
        link.href = dataUrl;
        link.click();
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FragmentLayout>

      <style jsx global>{`
        #print-area {
          width: 58mm;
          margin: 0 auto;
          font-size: 12px;
        }

        @media print {
          @page {
            size: 58mm auto;
            margin: 0;
          }

          body * {
            visibility: hidden;
          }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm;
            font-size: 10px;
          }
        }
      `}</style>

      <FragmentHeader>
        <div className="flex items-center gap-2">

          {userAuth ? (
            <Link href={`/tagihan/${data.id}`} className="btn btn-ghost btn-square">
              <FiArrowLeft />
            </Link>
          ) : undefined}

          <h1 className="font-bold text-xl">
            Kuintansi
          </h1>
        </div>

        <div className="flex gap-2">

          <button
            onClick={handleShare}
            className="btn-outline btn btn-primary btn-square btn-sm"
          >
            <IoMdShare size={14} />
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-primary btn-square btn-sm"
          >
            <FiPrinter size={14} />
          </button>
        </div>
      </FragmentHeader>

      <FragmentBody className="py-6" id="png-area">


        <div style={{ width: "58mm" }} className="mx-auto">

          <div
            id="print-area"
            className="bg-white mx-auto p-2 font-mono text-black"
          >
            <div className="text-center">
              <p className="font-bold text-[14px]">
                Berkat Motor / Erizal
              </p>
              <p className="px-4 text-xs">
                Perkebunan Sungai Lala, Indragiri Hulu, Riau
              </p>
            </div>

            <Divider />

            <div className="text-xs">
              <p>Kode: {data.kode}</p>
              <p>Tanggal: {formatDate(data.dibuatPada)}</p>
            </div>

            {/* CUSTOMER */}
            {(data.namaCustomer || data.catatan) && (
              <div className="space-y-1 mt-2 text-xs">
                <p>{data.namaCustomer ?? "-"}</p>
                {data.catatan && (
                  <p className="text-neutral-600">
                    {data.catatan}
                  </p>
                )}
              </div>
            )}

            <Divider />

            {groupedDetails.map((group: any[], groupIndex: number) => (
              <div key={groupIndex}>

                <Section title="Barang / Jasa">
                  {group.map((item: any) => (
                    <div key={item.id}>
                      <p>{item.nama}</p>

                      <div className="flex justify-between">
                        <span>
                          {item.qty} x {format(item.harga)}
                        </span>

                        <span>
                          {format(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </Section>

                {/* Divider khusus potong */}
                {groupIndex !== groupedDetails.length - 1 && (
                  <div className="py-8">

                    <div className="mb-2 font-bold text-[10px] text-center">
                      Selanjutnya →
                    </div>

                    <div className="flex items-center gap-4 w-full text-center">
                      <div className="border-black border-t border-dashed grow" />

                      <p>
                        <MdOutlineContentCut size={8} />
                      </p>

                      <div className="border-black border-t border-dashed grow" />
                    </div>

                  </div>
                )}
              </div>
            ))}

            <Divider />

            <div className="space-y-1 text-xs">
              <Row label="Subtotal" value={subtotal} />
              <Row label="Ongkos" value={ongkos} />
              {diskon > 0 && <Row label="Diskon" value={diskon} />}


              <Divider />
              <Row label="Total" value={total} />
            </div>

            <Divider />

            <div className="mt-2 text-xs text-center">

              <p>Terima kasih</p>

              <p className="mt-1 text-[10px]">
                Whatsapp: 0813-7250-1295
              </p>

              <div className="flex justify-center mt-2">
                <div className="min-w-2 shrink-0">
                  <Image
                    src={`/tagihan/${data.id}/qrcode`}
                    alt="QR Code"
                    className="bg-white p-1 rounded w-34 h-34 object-contain aspect-square"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <p className="mt-1 text-[8px]">
                Scan untuk cek invoice
              </p>

            </div>
          </div>

        </div>

      </FragmentBody>
      <FragmentFooter>
        <div className="space-y-3 mb-4">

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={enableCut}
              onChange={(e) => setEnableCut(e.target.checked)}
            />

            <span className="text-sm">
              Buat tanda potong
            </span>
          </label>

          {enableCut && (

            <div className="space-y-2 pl-6">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="radio radio-sm"
                  checked={cutMode === "equal"}
                  onChange={() => setCutMode("equal")}
                />

                <span className="text-sm">
                  Potong ratakan otomatis
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="radio radio-sm"
                  checked={cutMode === "per12"}
                  onChange={() => setCutMode("per12")}
                />

                <span className="text-sm">
                  Potong per 12 item
                </span>
              </label>

            </div>
          )}

        </div>
      </FragmentFooter>

    </FragmentLayout>
  );
}

/* ================= COMPONENT ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 text-xs">
      <p className="font-medium">{title}</p>
      {children}
    </div>
  );
}

/* ================= HELPER ================= */

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value.toLocaleString("id-ID")}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-2 border-t border-dashed" />
  );
}