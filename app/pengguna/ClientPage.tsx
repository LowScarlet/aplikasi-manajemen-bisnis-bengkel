'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { RoleBadge } from "../_components/Badge";
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
import { User } from "./page";

export default function ClientPage({
  users,
  initialSearch,
  currentPage,
}: {
  users: User[];
  initialSearch: string;
  currentPage: number;
}) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  function handleSearch(value: string) {
    setSearch(value);
    router.push(`/pengguna?q=${value}&page=1`);
  }

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton
            href="/dashboard"
          >
            <FaArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">Pengguna</h1>
        </div>

        <PrimaryButton
          href="/pengguna/tambah"
        >
          <FiPlus size={16} />
        </PrimaryButton>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* SEARCH */}
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Cari pengguna..."
        />

        {/* LIST */}
        <section className="space-y-3">
          {users.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada pengguna
            </p>
          )}

          {users.map((user) => (
            <Card.Link
              key={user.id}
              href={`/pengguna/${user.id}`}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-neutral-800">
                  {user.nama}
                </p>
                <p className="text-neutral-500 text-xs">
                  @{user.username}
                </p>
              </div>

              <RoleBadge role={user.peran} />
            </Card.Link>
          ))}
        </section>

      </FragmentBody>

      {/* FOOTER */}
      <FragmentFooter>
        <Pagination
          currentPage={currentPage}
          search={search}
          basePath="/pengguna"
        />
      </FragmentFooter>

    </FragmentLayout>
  );
}