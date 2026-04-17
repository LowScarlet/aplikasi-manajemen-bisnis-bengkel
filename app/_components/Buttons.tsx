'use client'

import { cn } from "@/libs/utils";
import Link from "next/link";
import { ReactNode } from "react";

/* ================= LINK BUTTON ================= */

export function PrimaryButton({
  children,
  href,
}: {
  children?: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 bg-blue-500 px-3 py-2 rounded-lg text-white text-sm"
    >
      {children}
    </Link>
  );
}

export function GhostButton({
  children,
  href,
  className,
}: {
  children?: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1 hover:bg-neutral-200 px-3 py-2 rounded-lg text-neutral-700 text-sm",
        className
      )}
    >
      {children}
    </Link>
  );
}

/* ================= REAL BUTTON ================= */

type ButtonProps = {
  children?: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButtonAction({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "bg-blue-500 p-2 rounded w-full text-white text-sm",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DangerButtonAction({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "bg-red-500 p-2 rounded w-full text-white text-sm",
        className
      )}
    >
      {children}
    </button>
  );
}