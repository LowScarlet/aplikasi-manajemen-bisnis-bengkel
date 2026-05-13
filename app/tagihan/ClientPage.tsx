'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";


import { StatusBadge } from "@/app/_components/Badge";
import { Pagination } from "@/app/_components/Pagination";
import { BottomNav } from "../_components/BottomNav";

import { FiPlus, FiSearch } from "react-icons/fi";
import { LuCalendarSearch, LuScanLine } from "react-icons/lu";

import { Tagihan } from "./page";
import { QRScannerModal } from "../_components/QRScannerModal";
import { cn } from "@/libs/utils";
import Link from "next/link";

export default function ClientPage({
  data,
  initialSearch,
  currentPage,
}: {
  data: Tagihan[];
  initialSearch: string;
  currentPage: number;
}) {
  const searchParams = useSearchParams();

  const currentFilter =
    searchParams.get("filter") ?? "today";

  const currentTanggal =
    searchParams.get("tanggal") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [openScan, setOpenScan] = useState(false);

  const router = useRouter();

  function handleSearch(value: string) {
    setSearch(value);
    router.push(`/tagihan?q=${value}&page=1`);
  }

  function updateQuery(
    values: Record<string, string>
  ) {

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    Object.entries(values).forEach(
      ([key, value]) => {

        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }

      }
    );

    router.push(
      `/tagihan?${params.toString()}`
    );
  }

  return (
    <FragmentLayout>

      <FragmentHeader>
        <h1 className="font-bold text-xl">Tagihan</h1>

        <Link className="btn btn-primary btn-sm" href="/tagihan/tambah">
          <FiPlus /> Tambah
        </Link>
      </FragmentHeader>

      <FragmentBody className="space-y-4">

        <div className="flex gap-2">
          <label className="input grow">
            <FiSearch />
            <input
              type="search"
              className="grow"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Cari tagihan..."
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
          <button
            className="btn btn-secondary btn-square"
            onClick={() => setOpenScan(true)}
          >
            <LuScanLine />
          </button>
        </div>

        <div className="flex justify-between items-center">

          <div
            role="tablist"
            className="tabs-border tabs"
          >

            <button
              role="tab"
              className={cn(
                "tab",
                currentFilter === "today"
                && "tab-active"
              )}
              onClick={() =>
                updateQuery({
                  filter: "today",
                  tanggal: "",
                  page: "1",
                })
              }
            >
              Hari Ini
            </button>

            <button
              role="tab"
              className={cn(
                "tab",
                currentFilter === "all"
                && "tab-active"
              )}
              onClick={() =>
                updateQuery({
                  filter: "all",
                  tanggal: "",
                  page: "1",
                })
              }
            >
              Semua
            </button>

          </div>

          <label className="gap-2 btn-outline btn btn-primary">

            <LuCalendarSearch />

            Cari tanggal

            <input
              type="date"
              className="hidden"
              value={currentTanggal}
              onChange={(e) =>
                updateQuery({
                  tanggal: e.target.value,
                  filter: "all",
                  page: "1",
                })
              }
            />

          </label>

        </div>

        <section className="space-y-3">

          {data.length === 0 && (
            <p className="text-sm text-center">
              Tidak ada tagihan
            </p>
          )}

          {data.map((item) => {
            const total = item.total ?? 0;

            return (
              <Link
                className={cn("bg-base-100 border-l-4 card", item.status === "BATAL" ? 'border-error' : item.status === "PROSES" ? 'border-warning' : item.status === "SELESAI" ? 'border-success' : 'border-base-content')}
                key={item.id}
                href={`/tagihan/${item.id}`}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="text-xs italic">
                          {item.kode}
                        </p>
                        <p className="text-sm text-end">
                          {item.dibuatPada
                            ? new Date(item.dibuatPada).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                            : "Error"}
                        </p>
                      </div>

                      <p className="font-bold text-base">
                        {item.namaCustomer ?? "-"}

                        {item.catatan?.trim() && (
                          <> — {item.catatan}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <StatusBadge
                      status={item.statusPembayaran ?? "BELUM_BAYAR"}
                    />
                    <span className="text-end">
                      Total: Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

      </FragmentBody>

      <FragmentFooter>
        <Pagination
          currentPage={currentPage}
          search={search}
          basePath="/tagihan"
        />

        <BottomNav />
      </FragmentFooter>

      <QRScannerModal
        open={openScan}
        onClose={() => setOpenScan(false)}
        onScan={(value) => {
          if (value.startsWith("INV-")) {
            router.push(`/tagihan/${value}`);
          }
        }}
      />

    </FragmentLayout >
  );
}