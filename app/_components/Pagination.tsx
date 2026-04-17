'use client'

import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type PaginationProps = {
  currentPage: number;
  search?: string;
  basePath: string;
};

export function Pagination({
  currentPage,
  search = "",
  basePath,
}: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <div className="flex justify-between gap-2 p-4">
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?q=${search}&page=${prevPage}`}
          className="px-3 py-1 border rounded"
        >
          <IoIosArrowBack />
        </Link>
      ) : undefined}

      <span className="px-3 py-1 text-sm">
        Halaman {currentPage}
      </span>

      <Link
        href={`${basePath}?q=${search}&page=${nextPage}`}
        className="px-3 py-1 border rounded"
      >
        <IoIosArrowForward />
      </Link>
    </div>
  );
}