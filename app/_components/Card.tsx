'use client'

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/libs/utils";

/* ================= TYPES ================= */

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
};

/* ================= ROOT ================= */

type CardType = React.FC<BaseProps> & {
  Link: React.FC<LinkProps>;
  Header: React.FC<BaseProps>;
  Body: React.FC<BaseProps>;
  Footer: React.FC<BaseProps>;
};

/* ================= BASE ================= */

const CardBase: React.FC<BaseProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-white/90 backdrop-blur border border-neutral-200/60",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "rounded-2xl p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Card = CardBase as CardType;

/* ================= LINK ================= */

Card.Link = function CardLink({ href, children, className }) {
  return (
    <Link
      href={href}
      className={cn(
        "block bg-white/90 backdrop-blur border border-neutral-200/60",
        "shadow-sm hover:shadow-md hover:scale-[1.01]",
        "transition-all duration-200",
        "rounded-2xl p-4 active:scale-[0.99]",
        className
      )}
    >
      {children}
    </Link>
  );
};

/* ================= HEADER ================= */

Card.Header = function CardHeader({ children, className }) {
  return (
    <div
      className={cn(
        "mb-3 font-semibold text-neutral-800 text-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

/* ================= BODY ================= */

Card.Body = function CardBody({ children, className }) {
  return (
    <div
      className={cn(
        "text-neutral-600 text-sm leading-relaxed",
        className
      )}
    >
      {children}
    </div>
  );
};

/* ================= FOOTER ================= */

Card.Footer = function CardFooter({ children, className }) {
  return (
    <div
      className={cn(
        "mt-4 pt-3 border-neutral-200/70 border-t",
        "flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};