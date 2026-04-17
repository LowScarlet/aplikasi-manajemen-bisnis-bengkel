'use client'

import { cn } from "@/libs/utils";
import { ReactNode } from "react";

/* ================= ROOT ================= */

export function FragmentLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("bg-neutral-100", className)}>
      <div className="flex flex-col mx-auto max-w-md min-h-screen">
        {children}
      </div>
    </main>
  )
}

/* ================= HEADER ================= */

type FragmentHeaderType = React.FC<{
  children: ReactNode;
  className?: string;
}>

const FragmentHeaderBase: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <header className={cn("top-0 z-10 sticky bg-neutral-100 p-4", className)}>
      <div className="flex justify-between items-center">
        {children}
      </div>
    </header>
  );
};

export const FragmentHeader = FragmentHeaderBase as FragmentHeaderType;

/* ================= BODY ================= */

export function FragmentBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-4 grow", className)}>{children}</div>;
}

/* ================= FOOTER ================= */

export function FragmentFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("bottom-0 z-10 sticky bg-neutral-100", className)}>{children}</div>;
}