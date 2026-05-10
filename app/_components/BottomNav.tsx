'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaRegCircleUser } from "react-icons/fa6";

import {
  FiFileText,
  FiHome,
  FiPlus,
} from "react-icons/fi";

import { MdQrCodeScanner } from "react-icons/md";

export function BottomNav() {

  const pathname = usePathname();

  const menus = [
    {
      name: "Home",
      icon: FiHome,
      href: "/dashboard",
    },
    {
      name: "Tagihan",
      icon: FiFileText,
      href: "/tagihan",
    },
    {
      name: "Scan QR",
      icon: MdQrCodeScanner,
      href: "/scan",
    },
    {
      name: "Saya",
      icon: FaRegCircleUser,
      href: "/saya",
    },
  ];

  return (
    <nav className="flex justify-center items-end">

      <div className="items-end grid grid-cols-5 py-2 rounded-xl w-full max-w-md">

        {/* kiri */}
        {menus.slice(0, 2).map((item) => {

          const isActive =
            pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col justify-center items-center text-xs"
            >

              <Icon
                size={20}
                className={
                  isActive
                    ? "text-blue-500"
                    : "text-neutral-400"
                }
              />

              <span
                className={
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-neutral-400"
                }
              >
                {item.name}
              </span>

            </Link>
          );
        })}

        {/* tengah */}
        <Link
          href="/tagihan/tambah"
          className="flex flex-col justify-center items-center -mt-5 text-xs"
        >

          <div className="btn btn-primary btn-circle btn-sm">
            <FiPlus size={18} />
          </div>

          <span className="mt-1 font-medium text-neutral-400">
            Tambah Tagihan
          </span>

        </Link>

        {/* kanan */}
        {menus.slice(2).map((item) => {

          const isActive =
            pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col justify-center items-center text-xs"
            >

              <Icon
                size={20}
                className={
                  isActive
                    ? "text-blue-500"
                    : "text-neutral-400"
                }
              />

              <span
                className={
                  isActive
                    ? "text-blue-500 font-medium"
                    : "text-neutral-400"
                }
              >
                {item.name}
              </span>

            </Link>
          );
        })}

      </div>

    </nav>
  );
}