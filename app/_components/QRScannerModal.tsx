'use client'

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

import {
  Modal,
  ModalHeader,
  ModalBody
} from "@/app/_components/Modal";

import { PrimaryButtonAction } from "@/app/_components/Buttons";
import { FiX } from "react-icons/fi";

export function QRScannerModal({
  open,
  onClose,
  onScan,
}: {
  open: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const [result, setResult] = useState<string | null>(null);

  /* ================= STOP SCANNER ================= */

  const stopScanner = useCallback(async () => {
    if (isRunningRef.current && scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}

      isRunningRef.current = false;
    }

    scannerRef.current = null;
  }, []);

  /* ================= CAMERA ================= */

  useEffect(() => {
    if (!open) {
      stopScanner();
      return;
    }

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    let isMounted = true;

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      },
      (decodedText) => {
        if (!isMounted) return;

        setResult(decodedText);

        if (isRunningRef.current) {
          stopScanner();
          onScan(decodedText);
          onClose();
        }
      },
      () => {}
    ).then(() => {
      if (isMounted) isRunningRef.current = true;
    });

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [open, onScan, onClose, stopScanner]);

  /* ================= FILE ================= */

  const scanFromFile = async (file: File) => {
    const scanner = new Html5Qrcode("reader-file");

    try {
      const decodedText = await scanner.scanFile(file, true);
      setResult(decodedText);
      onScan(decodedText);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CLOSE HANDLER ================= */

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <ModalHeader>
          Scan QR Code
        </ModalHeader>

        <button
          onClick={handleClose}
          className="hover:bg-neutral-100 p-2 rounded-full transition"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* BODY */}
      <ModalBody>

        {/* CAMERA */}
        <div className="bg-black border rounded-xl w-full aspect-square overflow-hidden">
          <div id="reader" className="w-full h-full" />
        </div>

        <p className="mt-2 text-neutral-500 text-xs text-center">
          Arahkan kamera ke QR Code
        </p>

        {/* UPLOAD */}
        <div className="mt-4">
          <label className="block bg-neutral-100 hover:bg-neutral-200 p-3 rounded-lg text-sm text-center transition cursor-pointer">
            Upload dari gambar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) scanFromFile(file);
              }}
            />
          </label>
        </div>

        <div id="reader-file" className="hidden" />

        {/* RESULT */}
        {result && (
          <div className="mt-3 font-medium text-green-600 text-sm text-center">
            {result}
          </div>
        )}

      </ModalBody>

    </Modal>
  );
}