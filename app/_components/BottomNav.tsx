'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiFileText, FiHome } from "react-icons/fi";

//
export function BottomNav() {
  const pathname = usePathname();

  const menus = [
    { name: "Home", icon: FiHome, href: "/dashboard" },
    { name: "Tagihan", icon: FiFileText, href: "/tagihan" },
    { name: "Saya", icon: FaRegCircleUser, href: "/saya" },
  ];

  return (
    <nav className="right-0 bottom-0 left-0 z-50 fixed flex justify-center items-center">
      <div className="grid grid-cols-3 py-2 rounded-xl w-full max-w-md">
        {menus.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col justify-center items-center text-xs"
            >
              <Icon
                size={20}
                className={isActive ? "text-blue-500" : "text-neutral-400"}
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