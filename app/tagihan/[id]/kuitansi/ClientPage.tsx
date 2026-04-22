/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
} from "@/app/_components/Layouts/FragmentLayout";
import { format, formatDate } from "@/libs/utils";
import { toPng } from "html-to-image";
import { GhostButton, PrimaryButtonAction } from "@/app/_components/Buttons";
import { IoMdShare } from "react-icons/io";

export default function ClientPage({ data }: { data: any }) {
  const total = data.total ?? 0;
  const dibayar = data.dibayar ?? 0;

  const kembalian = dibayar > total ? dibayar - total : 0;
  const sisa = dibayar < total ? total - dibayar : 0;

  const details = data.details ?? [];
  const pembayaran = data.pembayaran ?? [];

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.origin + `/tagihan/${data.id}`
      : "";

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
        link.download = "kuitansi.png";
        link.href = dataUrl;
        link.click();
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FragmentLayout>

      {/* PRINT STYLE */}
      <style jsx global>{`
        #print-area {
          width: 320px;
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

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href={`/tagihan/${data.id}`}>
            <FiArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Kuitansi
          </h1>
        </div>

        <div className="flex gap-2">

          <PrimaryButtonAction
            onClick={handleShare}
          >
            <IoMdShare size={14} />
          </PrimaryButtonAction>

          <PrimaryButtonAction
            onClick={() => window.print()}
          >
            <FiPrinter size={14} />
          </PrimaryButtonAction>
        </div>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="py-6" id="png-area">

        <div
          id="print-area"
          className="bg-white mx-auto px-3 py-5 font-mono text-black"
        >

          {/* HEADER TOKO */}
          <div className="text-center">
            <p className="font-bold text-[14px]">
              Berkat Motor / Erizal
            </p>
            <p className="px-4 text-xs">
              Perkebunan Sungai Lala, Indragiri Hulu, Riau
            </p>
          </div>

          <Divider />

          {/* INFO */}
          <div className="flex justify-between text-xs">
            <p>Kode: {data.kode}</p>
            <p>{formatDate(data.dibuatPada)}</p>
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

          {/* ITEMS */}
          <Section title="Barang / Jasa">
            {details.length === 0 ? (
              <Empty text="Tidak ada barang / jasa" />
            ) : (
              details.map((item: any) => (
                <div key={item.id}>
                  <p>{item.nama}</p>
                  <div className="flex justify-between">
                    <span>
                      {item.qty} x {format(item.harga)}
                    </span>
                    <span>{format(item.subtotal)}</span>
                  </div>
                </div>
              ))
            )}
          </Section>

          <Divider />

          {/* TOTAL */}
          <div className="space-y-1 text-xs">
            <Row label="Total" value={total} />
          </div>

          <Divider />

          {/* PEMBAYARAN */}
          <Section title="Riwayat Pembayaran">
            {pembayaran.length === 0 ? (
              <Empty text="Belum ada pembayaran" />
            ) : (
              pembayaran.map((p: any) => (
                <div key={p.id} className="flex justify-between">
                  <span>{formatDate(p.dibuatPada)}</span>
                  <span>{format(p.jumlah)}</span>
                </div>
              ))
            )}
          </Section>

          <Divider />

          {/* RINGKASAN */}
          <div className="space-y-1 text-xs">
            <Row label="Bayar" value={dibayar} />

            {dibayar >= total ? (
              <Row label="Kembalian" value={kembalian} />
            ) : (
              <Row label="Sisa" value={sisa} />
            )}
          </div>

          <Divider />

          {/* FOOTER */}
          <div className="mt-2 text-xs text-center">

            <p>Terima kasih</p>

            <p className="mt-1 text-[10px]">
              Whatsapp: 0812-xxxx-xxxx
            </p>

            <div className="flex justify-center mt-2">
              {currentUrl && (
                <QRCodeSVG value={currentUrl} size={70} />
              )}
            </div>

            <p className="mt-1 text-[8px]">
              Scan untuk cek invoice
            </p>

          </div>

        </div>

      </FragmentBody>

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

function Empty({ text }: { text: string }) {
  return (
    <p className="text-neutral-400 text-center">
      {text}
    </p>
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