'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { BottomNav } from "../_components/BottomNav";

import { FiPlus } from "react-icons/fi";
import { LuScanLine } from "react-icons/lu";

import { Tagihan } from "./page";
import { QRScannerModal } from "../_components/QRScannerModal";
import { formatDate } from "@/libs/utils";

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
  const [openScan, setOpenScan] = useState(false);

  const router = useRouter();

  /* ================= SEARCH ================= */

  function handleSearch(value: string) {
    setSearch(value);
    router.push(`/tagihan?q=${value}&page=1`);
  }

  /* ================= RENDER ================= */

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
            onClick={() => setOpenScan(true)}
            className="px-3 w-auto"
          >
            <LuScanLine />
          </PrimaryButtonAction>
        </div>

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
                    <div className="flex justify-between gap-2">
                      <p className="font-medium">{item.kode}</p>
                      <p className="text-neutral-500 text-sm">{item.dibuatPada ? formatDate(item.dibuatPada) : 'Error'}</p>
                    </div>

                    <p className="text-neutral-500 text-xs">
                      {item.namaCustomer ?? "-"} — {item.catatan ?? "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-4 text-xs">
                  <span>
                    Pengerjaan: {" "}
                    <StatusBadge
                      status={item.status ?? "PROSES"}
                    />
                  </span>
                  <span>
                    Pembayaran: {" "}
                    <StatusBadge
                      status={item.statusPembayaran ?? "BELUM_BAYAR"}
                    />
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600 text-sm">
                  <span>
                    Rp {total.toLocaleString("id-ID")}
                  </span>

                  {sisa >= 0 && (
                    <span className="font-medium text-neutral-800">
                      Sisa: Rp {sisa.toLocaleString("id-ID")}
                    </span>
                  )}
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

      {/* MODAL SCANNER */}
      <QRScannerModal
        open={openScan}
        onClose={() => setOpenScan(false)}
        onScan={(value) => {
          if (value.startsWith("INV-")) {
            router.push(`/tagihan/${value}`);
          }
        }}
      />

    </FragmentLayout>
  );
}