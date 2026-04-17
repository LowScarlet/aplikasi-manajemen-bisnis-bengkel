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
    <div className={cn("bg-white shadow p-4 rounded-xl", className)}>
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
      className={cn("block bg-white shadow p-4 rounded-xl", className)}
    >
      {children}
    </Link>
  );
};

/* ================= HEADER ================= */

Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={cn("mb-2 font-medium text-neutral-800", className)}>
      {children}
    </div>
  );
};

/* ================= BODY ================= */

Card.Body = function CardBody({ children, className }) {
  return (
    <div className={cn("text-neutral-600 text-sm", className)}>
      {children}
    </div>
  );
};

/* ================= FOOTER ================= */

Card.Footer = function CardFooter({ children, className }) {
  return (
    <div className={cn("mt-3 pt-3 border-t", className)}>
      {children}
    </div>
  );
};