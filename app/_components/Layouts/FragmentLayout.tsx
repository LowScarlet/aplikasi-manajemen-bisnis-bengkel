'use client'

import { cn } from "@/libs/utils";
import {
  ReactNode,
  forwardRef,
  HTMLAttributes,
} from "react";

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
          "bg-base-200 min-h-screen",
          className
        )}
      >
        <div className="flex flex-col bg-base-200 mx-auto max-w-md min-h-screen">
          {children}
        </div>
      </main>
    );
  }
);

FragmentLayout.displayName = "FragmentLayout";

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
          "top-0 z-10 sticky bg-base-200 px-4 py-3",
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

type FragmentBodyProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const FragmentBody = forwardRef<HTMLDivElement, FragmentBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("space-y-4 px-4 pb-12 grow", className)}
      >
        {children}
      </div>
    );
  }
);

FragmentBody.displayName = "FragmentBody";

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
          "bottom-0 z-10 sticky bg-base-200",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

FragmentFooter.displayName = "FragmentFooter";