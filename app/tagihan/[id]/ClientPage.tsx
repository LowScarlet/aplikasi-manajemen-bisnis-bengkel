/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from "next/link";
import { useState } from "react";

import {
  FragmentLayout,
  FragmentHeader,
  FragmentBody
} from "@/app/_components/Layouts/FragmentLayout";

import {
  GhostButton,
  PrimaryButtonAction
} from "@/app/_components/Buttons";

import { Card } from "@/app/_components/Card";

import { FiArrowLeft, FiPlus, FiPrinter } from "react-icons/fi";
import { format, formatDate } from "@/libs/utils";
import { StatusBadge, TipeBadge } from "@/app/_components/Badge";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/app/_components/Modal";

import { addItem, addPayment, changeStatus, deletePayment, updateInformation, updateItem } from "./page";

export default function ClientPage({ data }: { data: any }) {

  /* ================= STATE ================= */
  const [modal, setModal] = useState<null | "info" | "status" | "pembayaran" | "item">(null);

  const [form, setForm] = useState({
    namaCustomer: data.namaCustomer ?? "",
    catatan: data.catatan ?? "",
  });

  const [status, setStatus] = useState(data.status);

  const [pembayaranForm, setPembayaranForm] = useState({
    jumlah: 0,
    metode: "",
    catatan: "",
  });

  const [itemForm, setItemForm] = useState({
    nama: "",
    qty: 1,
    harga: 0,
    barangId: null as string | null,
    layananId: null as string | null,
    tipe: "CUSTOM" as "LAYANAN" | "CUSTOM",
  });

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  /* ================= CALC ================= */

  const total = data.total ?? 0;
  const dibayar = data.dibayar ?? 0;
  const sisa = total - dibayar;

  /* ================= HANDLER ================= */

  const handleSubmit = async () => {
    if (modal === "info") {
      await updateInformation(data.id, form);
    }

    if (modal === "status") {
      await changeStatus(data.id, status);
    }

    if (modal === "pembayaran") {
      await addPayment(data.id, pembayaranForm);
    }

    if (modal === "item") {
      if (itemForm.tipe === "CUSTOM") {
        if (!itemForm.nama || itemForm.harga <= 0 || itemForm.qty <= 0) return;
      }

      if (itemForm.tipe === "LAYANAN") {
        if (!itemForm.layananId) return;
      }

      if (editingItemId) {
        await updateItem(editingItemId, itemForm);
      } else {
        await addItem(data.id, itemForm);
      }
    }

    setModal(null);
    location.reload();
  };

  const handleDeletePayment = async (id: string) => {
    const confirmDelete = confirm("Hapus pembayaran ini?");
    if (!confirmDelete) return;

    await deletePayment(id, data.id);
    location.reload();
  };

  /* ================= RENDER ================= */

  return (
    <FragmentLayout>

      {/* HEADER */}
      <FragmentHeader>
        <div className="flex items-center gap-2">
          <GhostButton href="/tagihan">
            <FiArrowLeft />
          </GhostButton>

          <h1 className="font-bold text-xl">
            Detail Tagihan
          </h1>
        </div>

        <div className="flex gap-2">
          <Link href={`/tagihan/${data.id}/kuitansi`}>
            <PrimaryButtonAction>
              <FiPrinter size={14} />
            </PrimaryButtonAction>
          </Link>
        </div>
      </FragmentHeader>

      {/* BODY */}
      <FragmentBody className="space-y-4">

        {/* INFO */}
        <Card>
          <div className="flex justify-between items-start gap-2 space-y-2">
            <div className="flex-1">
              <div className="flex justify-between gap-2">
                <p className="font-medium">{data.kode}</p>
                <p className="text-neutral-500 text-sm">{formatDate(data.dibuatPada)}</p>
              </div>
              <p className="text-neutral-500 text-sm">
                {data.namaCustomer ?? "-"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-neutral-500 text-sm">
            {data.catatan ?? "Tidak Ada Catatan!"}
          </p>

          <div className="flex flex-col gap-1 mt-4 text-neutral-500 text-sm">
            <span>
              Pengerjaan: <StatusBadge status={data.status} />
            </span>
            <span>
              Pembayaran: <StatusBadge status={data.statusPembayaran} />
            </span>
          </div>

          <div className="mt-2 py-2">
            <PrimaryButtonAction onClick={() => setModal("status")}>
              <MdEdit /> Ubah
            </PrimaryButtonAction>
          </div>
        </Card>

        {/* ACTION */}

        {/* ITEMS */}
        <Card className="space-y-3">
          <p className="font-medium text-sm">Barang & Layanan</p>

          {data.details.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Tidak ada item
            </p>
          )}

          {data.details.map((item: any) => (
            <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
              <div className="flex flex-1 justify-between">
                <div className="">
                  <p className="font-medium">{item.nama}</p>

                  <p className="text-neutral-400 text-xs">
                    {item.qty} x Rp {format(item.harga)}
                  </p>
                </div>
                <div>
                  <TipeBadge tipe={item.tipe} />
                </div>
              </div>

              <div className="flex gap-1">
                <PrimaryButtonAction
                  onClick={() => {
                    setItemForm({
                      nama: item.nama,
                      qty: item.qty,
                      harga: item.harga,
                      barangId: item.barangId,
                      layananId: item.layananId,
                      tipe: item.tipe,
                    });

                    setEditingItemId(item.id);
                    setModal("item");
                  }}
                >
                  <MdEdit />
                </PrimaryButtonAction>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <PrimaryButtonAction
              onClick={() => {
                setItemForm({
                  nama: "",
                  qty: 1,
                  harga: 0,
                  barangId: null,
                  layananId: null,
                  tipe: "CUSTOM",
                });
                setModal("item");
              }}
            >
              <FiPlus /> Tambah Barang/Jasa
            </PrimaryButtonAction>
          </div>
        </Card>

        {/* RIWAYAT */}
        <Card className="space-y-2 text-sm">
          <p className="font-medium">Pembayaran</p>

          {data.pembayaran.length === 0 && (
            <p className="text-neutral-500 text-sm text-center">
              Belum ada pembayaran
            </p>
          )}

          {data.pembayaran.map((p: any) => (
            <div key={p.id} className="flex justify-between items-start gap-2">
              <div className="flex justify-between grow">
                <div>
                  <p className="font-sm">
                    Rp {format(p.jumlah)}
                  </p>
                  <p className="text-neutral-500 text-xs">
                    {p.metode ?? "Tidak diketahui"}
                  </p>
                </div>

                <p className="text-neutral-400 text-xs">
                  {new Date(p.dibuatPada).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div>
                <PrimaryButtonAction onClick={() => handleDeletePayment(p.id)}>
                  <MdEdit />
                </PrimaryButtonAction>
              </div>
            </div>
          ))}
        </Card>

        {/* TOTAL */}
        <Card className="space-y-2 text-sm">
          <p className="font-medium">Detail Pembayaran</p>

          <div className="flex justify-between">
            <span>Total</span>
            <span className={false ? "font-semibold text-red-500" : "font-medium"}>
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Dibayar</span>
            <span className={dibayar < total ? "font-semibold text-red-500" : "font-medium"}>
              Rp {dibayar.toLocaleString("id-ID")}
            </span>
          </div>
          {sisa <= 0 ? (
            <div className="flex justify-between">
              <span>Kembalian</span>
              <span className={false ? "font-semibold text-red-500" : "font-medium"}>
                Rp {Math.abs(sisa).toLocaleString("id-ID")}
              </span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span>Sisa</span>
              <span className={true ? "font-semibold text-red-500" : "font-medium"}>
                Rp {sisa.toLocaleString("id-ID")}
              </span>
            </div>
          )}


          <PrimaryButtonAction onClick={() => setModal("pembayaran")}>
            <FaPlus /> Tambah Pembayaran
          </PrimaryButtonAction>
        </Card>

      </FragmentBody>

      {/* ================= MODAL ================= */}
      <Modal open={modal !== null} onClose={() => setModal(null)}>

        <ModalHeader>
          {modal === "info" && "Ubah Informasi"}
          {modal === "status" && "Ubah Status"}
          {modal === "pembayaran" && "Tambah Pembayaran"}
          {modal === "item" && (editingItemId ? "Edit Item" : "Tambah Item")}
        </ModalHeader>

        <ModalBody>
          {modal === "info" && (
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs">Nama Customer</p>
                <input
                  value={form.namaCustomer}
                  onChange={(e) =>
                    setForm({ ...form, namaCustomer: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                />
              </div>

              <div>
                <p className="mb-1 text-xs">Catatan</p>
                <textarea
                  value={form.catatan}
                  onChange={(e) =>
                    setForm({ ...form, catatan: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                />
              </div>
            </div>
          )}

          {modal === "status" && (
            <div>
              <p className="mb-1 text-xs">Status Pengerjaan</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg w-full text-sm"
              >
                <option value="MENUNGGU">Menunggu</option>
                <option value="PROSES">Proses</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>
          )}

          {modal === "pembayaran" && (
            <div className="space-y-3">

              <div>
                <p className="mb-1 text-xs">Jumlah</p>
                <input
                  type="number"
                  value={pembayaranForm.jumlah}
                  onChange={(e) =>
                    setPembayaranForm({
                      ...pembayaranForm,
                      jumlah: Number(e.target.value),
                    })
                  }
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                />
              </div>

              <div>
                <p className="mb-1 text-xs">Metode</p>
                <input
                  value={pembayaranForm.metode}
                  onChange={(e) =>
                    setPembayaranForm({
                      ...pembayaranForm,
                      metode: e.target.value,
                    })
                  }
                  placeholder="Cash / Transfer / dll"
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                />
              </div>

            </div>
          )}

          {modal === "item" && (
            <div className="space-y-3">

              {/* TIPE */}
              <div>
                <p className="mb-1 text-xs">Tipe</p>
                <select
                  value={itemForm.tipe}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      tipe: e.target.value as any,
                      barangId: null,
                      layananId: null,
                      nama: "",
                      harga: 0,
                    })
                  }
                  className="px-3 py-2 border rounded-lg w-full text-sm"
                >
                  <option value="CUSTOM">Lainnya</option>
                  <option value="LAYANAN">Layanan</option>
                </select>
              </div>

              {/* ================= LAINNYA ================= */}
              {itemForm.tipe === "CUSTOM" && (
                <>
                  <div>
                    <p className="mb-1 text-xs">Nama</p>
                    <input
                      value={itemForm.nama}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, nama: e.target.value })
                      }
                      className="px-3 py-2 border rounded-lg w-full text-sm"
                    />
                  </div>

                  <div className="gap-2 grid grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs">Qty</p>
                      <input
                        type="number"
                        value={itemForm.qty}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, qty: Number(e.target.value) })
                        }
                        className="px-3 py-2 border rounded-lg w-full text-sm"
                      />
                    </div>

                    <div>
                      <p className="mb-1 text-xs">Harga</p>
                      <input
                        type="number"
                        value={itemForm.harga}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, harga: Number(e.target.value) })
                        }
                        className="px-3 py-2 border rounded-lg w-full text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ================= LAYANAN ================= */}
              {itemForm.tipe === "LAYANAN" && (
                <>
                  <div>
                    <p className="mb-1 text-xs">Pilih Layanan</p>
                    <select
                      value={itemForm.layananId ?? ""}
                      onChange={(e) => {
                        const selected = data.layananList.find(
                          (l: any) => l.id === e.target.value
                        );

                        setItemForm({
                          ...itemForm,
                          layananId: selected?.id ?? null,
                          nama: selected?.nama ?? "",
                          harga: selected?.harga ?? 0,
                        });
                      }}
                      className="px-3 py-2 border rounded-lg w-full text-sm"
                    >
                      <option value="">Pilih layanan</option>
                      {data.layananList?.map((l: any) => (
                        <option key={l.id} value={l.id}>
                          {l.nama} - Rp {format(l.harga)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="gap-2 grid grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs">Qty</p>
                      <input
                        type="number"
                        value={itemForm.qty}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, qty: Number(e.target.value) })
                        }
                        className="px-3 py-2 border rounded-lg w-full text-sm"
                      />
                    </div>

                    <div>
                      <p className="mb-1 text-xs">Harga</p>
                      <input
                        type="number"
                        value={itemForm.harga}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, harga: Number(e.target.value) })
                        }
                        className="px-3 py-2 border rounded-lg w-full text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {/* <GhostButton onClick={() => setModal(null)}>
            Batal
          </GhostButton> */}

          <PrimaryButtonAction onClick={handleSubmit}>
            Simpan
          </PrimaryButtonAction>
        </ModalFooter>

      </Modal>

    </FragmentLayout>
  );
}