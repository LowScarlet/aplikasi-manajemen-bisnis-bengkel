'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody,
  FragmentFooter,
} from "@/app/_components/Layouts/FragmentLayout";

import { GhostButton, PrimaryButton } from "../_components/Buttons";
import { Pagination } from "../_components/Pagination";
import { SearchInput } from "../_components/SearchInput";
import { Card } from "../_components/Card";
import { FaArrowLeft } from "react-icons/fa6";

import { Kategori } from "./page";

export default function ClientPage({
  kategori,
  initialSearch,
  currentPage,
}: {
  kategori: Kategori[];
  initialSearch: string;
  currentPage: number;
}) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  function handleSearch(value: string) {
    setSearch(value);
    router.push(`/kategori?q=${value}&page=1`);
  }

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/dashboard">
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Kategori Barang
          </h1>
        </div>

        <PrimaryButton href="/kategori_barang/tambah">
          <FiPlus size={16} />
        </PrimaryButton>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* SEARCH */}
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Cari kategori..."
        />

        {/* LIST */}
        <section className="space-y-3">
          {kategori.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada kategori
            </p>
          )}

          {kategori.map((item) => (
            <Card.Link
              key={item.id}
              href={`/kategori_barang/${item.id}`}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-neutral-800">
                  {item.nama}
                </p>
                <p className="text-neutral-500 text-xs">
                  {item.kode ?? "-"}
                </p>
              </div>
            </Card.Link>
          ))}
        </section>

      </FragmentBody>

      {/* FOOTER */}
      <FragmentFooter>
        <Pagination
          currentPage={currentPage}
          search={search}
          basePath="/kategori_barang"
        />
      </FragmentFooter>

    </FragmentLayout>
  );
}