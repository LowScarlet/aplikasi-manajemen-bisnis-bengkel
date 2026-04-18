'use client'

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BottomNav } from "../_components/BottomNav";
import { StatusBadge } from "../_components/Badge";
import { LuScanLine } from "react-icons/lu";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function Page() {
  const [search, setSearch] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const router = useRouter();

  /* ================= CAMERA SCANNER ================= */
  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    let isMounted = true;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        if (!isMounted) return;

        setResult(decodedText);

        if (isRunningRef.current) {
          scanner.stop().then(() => {
            isRunningRef.current = false;
            setScanning(false);

            if (decodedText.startsWith("INV-")) {
              router.push(`/tagihan/${decodedText}`);
            } else {
              console.log("QR tidak dikenali:", decodedText);
            }
          }).catch(() => {});
        }
      },
      () => {}
    )
    .then(() => {
      if (isMounted) isRunningRef.current = true;
    })
    .catch((err) => {
      console.error(err);
      setScanning(false);
    });

    return () => {
      isMounted = false;

      if (isRunningRef.current && scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        isRunningRef.current = false;
      }
    };
  }, [scanning, router]);

  /* ================= SCAN FROM FILE ================= */
  const scanFromFile = async (file: File) => {
    const scanner = new Html5Qrcode("reader-file");

    try {
      const decodedText = await scanner.scanFile(file, true);

      setResult(decodedText);

      if (decodedText.startsWith("INV-")) {
        router.push(`/tagihan/${decodedText}`);
      } else {
        console.log("QR tidak dikenali:", decodedText);
      }
    } catch (err) {
      console.error("Gagal scan dari gambar:", err);
    }
  };

  /* ================= DATA ================= */
  const data = [
    { id: 1, kode: "INV-001", customer: "Budi", total: 150000, status: "LUNAS" },
    { id: 2, kode: "INV-002", customer: "Andi", total: 80000, status: "BELUM_BAYAR" },
    { id: 3, kode: "INV-003", customer: "Siti", total: 120000, status: "SEBAGIAN" },
  ];

  const filtered = data.filter(
    (item) =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-neutral-100 pb-20 min-h-screen">
      <div className="space-y-6 mx-auto px-4 py-6 w-full max-w-md">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-neutral-800 text-xl">
            Pencatatan Tagihan
          </h1>

          <Link
            href="/tagihan/buat"
            className="flex items-center gap-1 bg-blue-500 px-3 py-2 rounded-lg text-white text-sm"
          >
            <FiPlus size={16} />
            Buat
          </Link>
        </header>

        {/* SEARCH */}
        <div className="flex gap-2">
          <div className="relative grow">
            <FiSearch className="top-1/2 left-3 absolute text-neutral-400 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tagihan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white px-3 py-2 pl-10 border rounded-lg w-full text-sm"
            />
          </div>

          <button
            onClick={() => setScanning(true)}
            className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg text-white text-sm"
          >
            <LuScanLine size={16} />
          </button>
        </div>

        {/* CAMERA SCANNER */}
        {scanning && (
          <div className="bg-white shadow p-4 rounded-xl">
            <div id="reader" className="w-full" />

            <button
              onClick={() => {
                if (isRunningRef.current && scannerRef.current) {
                  scannerRef.current.stop().catch(() => {});
                  isRunningRef.current = false;
                }
                setScanning(false);
              }}
              className="bg-red-500 mt-3 py-2 rounded-lg w-full text-white text-sm"
            >
              Tutup Kamera
            </button>

            <p className="mt-2 text-neutral-500 text-xs text-center">
              Arahkan kamera ke QR code
            </p>
          </div>
        )}

        {/* SCAN FROM IMAGE */}
        <div className="space-y-3 bg-white shadow p-4 rounded-xl">
          <p className="font-medium text-sm">Scan dari gambar</p>

          <label className="flex justify-center items-center bg-neutral-100 hover:bg-neutral-200 p-3 rounded-lg text-sm cursor-pointer">
            Upload gambar QR
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) scanFromFile(file);
              }}
            />
          </label>
        </div>

        {/* hidden container (wajib) */}
        <div id="reader-file" className="hidden" />

        {/* RESULT */}
        {result && (
          <p className="text-green-600 text-sm text-center">
            Hasil: {result}
          </p>
        )}

        {/* LIST */}
        <section className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada tagihan
            </p>
          )}

          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/tagihan/${item.id}`}
              className="flex justify-between items-center bg-white shadow p-4 rounded-xl"
            >
              <div>
                <p className="font-medium text-neutral-800">
                  {item.kode}
                </p>
                <p className="text-neutral-500 text-xs">
                  {item.customer || "-"}
                </p>
              </div>

              <div className="space-y-1 text-right">
                <p className="font-semibold text-neutral-800 text-sm">
                  Rp {item.total.toLocaleString("id-ID")}
                </p>

                <StatusBadge status={item.status} />
              </div>
            </Link>
          ))}
        </section>

      </div>

      <BottomNav />
    </main>
  );
}