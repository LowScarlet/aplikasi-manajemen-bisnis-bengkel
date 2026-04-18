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
    <main
      className={cn(
        "bg-linear-to-b from-blue-50 to-neutral-100 min-h-screen",
        className
      )}
    >
      <div className="flex flex-col bg-inherit mx-auto max-w-md min-h-screen">
        {children}
      </div>
    </main>
  );
}

/* ================= HEADER ================= */

type FragmentHeaderType = React.FC<{
  children: ReactNode;
  className?: string;
}>;

const FragmentHeaderBase: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <header
      className={cn(
        "top-0 z-10 sticky backdrop-blur px-4 py-3",
        className
      )}
    >
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
  return (
    <div className={cn("space-y-6 px-4 pb-24 grow", className)}>
      {children}
    </div>
  );
}

/* ================= FOOTER ================= */

export function FragmentFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bottom-0 z-10 sticky bg-inherit backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}