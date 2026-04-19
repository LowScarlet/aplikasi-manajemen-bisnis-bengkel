'use client'

import {
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

/* ================= ROOT ================= */

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* ================= ESC + SCROLL LOCK ================= */

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  /* ================= FOCUS ================= */

  useEffect(() => {
    if (open && ref.current) {
      ref.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="z-50 fixed inset-0 flex justify-center items-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* CONTENT */}
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="relative bg-white shadow-xl mx-4 p-4 rounded-2xl outline-none w-full max-w-md animate-in duration-150 fade-in zoom-in-95"
      >
        {children}
      </div>

    </div>,
    document.body
  );
}

/* ================= HEADER ================= */

export function ModalHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-2 font-semibold text-lg">
      {children}
    </div>
  );
}

/* ================= BODY ================= */

export function ModalBody({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-4 text-neutral-700 text-sm">
      {children}
    </div>
  );
}

/* ================= FOOTER ================= */

export function ModalFooter({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex justify-end gap-2">
      {children}
    </div>
  );
}