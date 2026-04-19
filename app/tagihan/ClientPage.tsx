'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";

import {
  PrimaryButton,
  PrimaryButtonAction
} from "@/app/_components/Buttons";

import { Card } from "@/app/_components/Card";
import { StatusBadge } from "@/app/_components/Badge";
import { Pagination } from "@/app/_components/Pagination";
import { SearchInput } from "@/app/_components/SearchInput";

import { FiPlus } from "react-icons/fi";
import { LuScanLine } from "react-icons/lu";

import { Html5Qrcode } from "html5-qrcode";

import { Tagihan } from "./page";
import { BottomNav } from "../_components/BottomNav";

export default function ClientPage({
  data,
  initialSearch,
  currentPage,
}: {
  data: Tagihan[];
  initialSearch: string;
  currentPage: number;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  const router = useRouter();

  /* ================= SEARCH ================= */

  function handleSearch(value: string) {
    setSearch(value);
    router.push(`/tagihan?q=${value}&page=1`);
  }

  /* ================= CAMERA ================= */

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
            }
          });
        }
      },
      () => { }
    ).then(() => {
      if (isMounted) isRunningRef.current = true;
    });

    return () => {
      isMounted = false;

      if (isRunningRef.current && scannerRef.current) {
        scannerRef.current.stop().catch(() => { });
        isRunningRef.current = false;
      }
    };
  }, [scanning, router]);

  /* ================= FILE ================= */

  const scanFromFile = async (file: File) => {
    const scanner = new Html5Qrcode("reader-file");

    try {
      const decodedText = await scanner.scanFile(file, true);

      setResult(decodedText);

      if (decodedText.startsWith("INV-")) {
        router.push(`/tagihan/${decodedText}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <h1 className="font-bold text-xl">Tagihan</h1>

        <PrimaryButton href="/tagihan/tambah">
          <FiPlus size={16} />
        </PrimaryButton>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* SEARCH + SCAN */}
        <div className="flex gap-2">
          <div className="grow">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Cari tagihan..."
            />
          </div>

          <PrimaryButtonAction
            onClick={() => setScanning(true)}
            className="px-3 w-auto"
          >
            <LuScanLine />
          </PrimaryButtonAction>
        </div>

        {/* CAMERA */}
        {scanning && (
          <Card>
            <Card.Body>
              <div id="reader" className="w-full" />

              <PrimaryButtonAction
                onClick={() => {
                  if (isRunningRef.current && scannerRef.current) {
                    scannerRef.current.stop().catch(() => { });
                    isRunningRef.current = false;
                  }
                  setScanning(false);
                }}
                className="bg-red-500 mt-3"
              >
                Tutup Kamera
              </PrimaryButtonAction>

              <p className="mt-2 text-neutral-500 text-xs text-center">
                Arahkan ke QR code
              </p>
            </Card.Body>
          </Card>
        )}

        {/* UPLOAD */}
        <Card>
          <Card.Header>Scan dari gambar</Card.Header>

          <Card.Body>
            <label className="block bg-neutral-100 hover:bg-neutral-200 p-3 rounded-lg text-sm text-center cursor-pointer">
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
          </Card.Body>
        </Card>

        <div id="reader-file" className="hidden" />

        {/* RESULT */}
        {result && (
          <p className="text-green-600 text-sm text-center">
            {result}
          </p>
        )}

        {/* LIST */}
        <section className="space-y-3">
          {data.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada tagihan
            </p>
          )}

          {data.map((item) => {
            const total = item.total ?? 0;
            const dibayar = item.dibayar ?? 0;
            const sisa = total - dibayar;

            return (
              <Card.Link
                key={item.id}
                href={`/tagihan/${item.id}`}
                className="space-y-2"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-800">
                      {item.kode}
                    </p>
                    <p className="text-neutral-500 text-xs">
                      {item.namaCustomer ?? "Null"} - {item.catatan ?? "Tidak ada catatan!"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <StatusBadge
                      status={item.status ?? "NULL"}
                    />

                    <StatusBadge
                      status={item.statusPembayaran ?? "NULL"}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-neutral-600 text-sm">
                  <span>
                    Rp {total.toLocaleString("id-ID")}
                  </span>

                  {sisa >= 0 ? (
                    <span className="font-medium text-neutral-800">
                      Sisa: Rp {sisa.toLocaleString("id-ID")}
                    </span>
                  ) : undefined}
                </div>
              </Card.Link>
            );
          })}
        </section>

      </FragmentBody>

      {/* FOOTER */}
      <FragmentFooter>
        <Pagination
          currentPage={currentPage}
          search={search}
          basePath="/tagihan"
        />

        <BottomNav />
      </FragmentFooter>

    </FragmentLayout>
  );
}