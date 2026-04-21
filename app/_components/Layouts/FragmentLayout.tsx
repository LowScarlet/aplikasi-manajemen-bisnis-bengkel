'use client'

import { cn } from "@/libs/utils";
import {
  ReactNode,
  forwardRef,
  HTMLAttributes,
} from "react";

/* ================= ROOT ================= */

type FragmentLayoutProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export const FragmentLayout = forwardRef<HTMLElement, FragmentLayoutProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        {...props}
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
);

FragmentLayout.displayName = "FragmentLayout";

/* ================= HEADER ================= */

type FragmentHeaderProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export const FragmentHeader = forwardRef<HTMLElement, FragmentHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <header
        ref={ref}
        {...props}
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
  }
);

FragmentHeader.displayName = "FragmentHeader";

/* ================= BODY ================= */

type FragmentBodyProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const FragmentBody = forwardRef<HTMLDivElement, FragmentBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("space-y-6 px-4 pb-12 grow", className)}
      >
        {children}
      </div>
    );
  }
);

FragmentBody.displayName = "FragmentBody";

/* ================= FOOTER ================= */

type FragmentFooterProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const FragmentFooter = forwardRef<HTMLDivElement, FragmentFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "bottom-0 z-10 sticky bg-inherit backdrop-blur",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

FragmentFooter.displayName = "FragmentFooter";