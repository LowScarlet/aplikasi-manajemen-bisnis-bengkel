'use client'

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/libs/utils";

/* ================= TYPES ================= */

type BaseProps = {
  children?: ReactNode;
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
};

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/* ================= STYLES ================= */

const base =
  "flex items-center justify-center gap-2 text-sm rounded-lg transition";

const styles = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  ghost: "text-neutral-700 hover:bg-neutral-200",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

/* ================= LINK BUTTON ================= */

export function PrimaryButton({ children, href, className }: LinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, styles.primary, "px-3 py-2", className)}
    >
      {children}
    </Link>
  );
}

export function GhostButton({ children, href, className }: LinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, styles.ghost, "px-3 py-2", className)}
    >
      {children}
    </Link>
  );
}

/* ================= ACTION BUTTON ================= */

export function PrimaryButtonAction({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(base, styles.primary, "w-full p-2", className)}
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
      className={cn(base, styles.danger, "w-full p-2", className)}
    >
      {children}
    </button>
  );
}