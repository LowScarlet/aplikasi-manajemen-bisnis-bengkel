'use client'

import Link from "next/link";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

export default function Page() {
  const data = {
    kode: "INV-001",
    tanggal: "14/04/2026",
    customer: "Budi",
    total: 190000,
    dibayar: 200000,
    kembalian: 10000,
    items: [
      { nama: "Oli Yamalube", qty: 1, harga: 50000 },
      { nama: "Busi NGK", qty: 2, harga: 20000 },
      { nama: "Servis Mesin", qty: 1, harga: 100000 },
    ],
  };

  return (
    <main className="bg-neutral-100 py-6 min-h-screen">

      {/* STYLE SCREEN + PRINT */}
      <style jsx global>{`
        /* ===== SCREEN ===== */
        #print-area {
          width: 320px;
          margin: 0 auto;
          font-size: 12px;
        }

        /* ===== PRINT ===== */
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

      <div className="space-y-4 mx-auto px-4 max-w-md">

        {/* HEADER */}
        <div className="print:hidden flex justify-between items-center">
          <Link href={`/tagihan/${data.kode}`}>
            <FiArrowLeft size={20} />
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-sm"
          >
            <FiPrinter /> Print
          </button>
        </div>

        {/* STRUK */}
        <div
          id="print-area"
          className="bg-white p-3 font-mono text-black"
        >

          {/* HEADER */}
          <div className="text-center">
            <p className="font-bold text-[14px]">Berkat Motor / Erizal</p>
            <p className="text-xs">Jl. Sudirman</p> 
          </div>

          <Divider />

          {/* INFO */}
          <div className="flex justify-between text-xs">
            <div>
              <p>No: {data.kode}</p>
              <p>{data.tanggal}</p>
            </div>
            <div className="text-right">
              <p>{data.customer}</p>
            </div>
          </div>

          <Divider />

          {/* ITEMS */}
          <div className="space-y-2 text-xs">
            {data.items.map((item, i) => (
              <div key={i}>
                <p>{item.nama}</p>
                <div className="flex justify-between">
                  <span>
                    {item.qty} x {item.harga.toLocaleString("id-ID")}
                  </span>
                  <span>
                    {(item.qty * item.harga).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* TOTAL */}
          <div className="space-y-1 text-xs">
            <Row label="Total" value={data.total} />
            <Row label="Bayar" value={data.dibayar} />
            <Row label="Kembali" value={data.kembalian} />
          </div>

          <Divider />

          {/* FOOTER + QR */}
          <div className="mt-2 text-xs text-center">

            <p>Terima kasih</p>

            {/* QR CODE */}
            <div className="flex justify-center mt-2">
              <QRCodeSVG
                value={`https://www.lowscarlet.my.id/projects/webs`}
                size={70}
                level="M"
              />
            </div>

            <p className="mt-1 text-[8px]">
              Scan untuk cek invoice online
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

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