/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FragmentBody,
  FragmentFooter,
  FragmentHeader,
  FragmentLayout,
} from "@/app/_components/Layouts/FragmentLayout";

import { BottomNav } from "../_components/BottomNav";

import Image from "next/image";

import { IoMdLogOut } from "react-icons/io";
import { RiUserAddLine } from "react-icons/ri";
import {
  FaPlus,
  FaRupiahSign,
} from "react-icons/fa6";

import { MdOutlineReceiptLong } from "react-icons/md";

import { logout } from "@/app/auth/logout/action";
import MenuItem from "../_components/MenuItem";

export default function ClientPage({
  user,
  stats,
}: {
  user: any;
  stats: {
    pendapatan: number;
    belumBayar: number;

    proses: number;
    selesai: number;
    hariIni: number;

    mingguIni: number;
    bulanIni: number;
    semuaWaktu: number;
  };
}) {
  return (
    <FragmentLayout>

      <FragmentHeader>
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-8 mask mask-squircle">
              <Image
                src="/android-chrome-512x512.png"
                alt="Logo"
                width={30}
                height={30}
              />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight">
              Berkat Motor Erizal
            </h1>
            <p className="text-xs">
              Selamat Datang,{" "}
              <span className="font-medium">
                {user.nama}
              </span>
            </p>
          </div>
        </div>
        <div>
          <button className="btn btn-error btn-square btn-sm" onClick={() => logout()}>
            <IoMdLogOut />
          </button>
        </div>
      </FragmentHeader>

      <FragmentBody>

        <section>

          <div className="bg-base-100 border border-base-300 w-full stats stats-vertical lg:stats-horizontal">

            <div className="stat">

              <div className="text-success stat-figure">
                <FaRupiahSign size={20} />
              </div>

              <div className="stat-title">
                Omzet Hari Ini
              </div>

              <div className="text-success text-2xl stat-value">
                Rp {stats.pendapatan.toLocaleString("id-ID")}
              </div>

            </div>

            <div className="stat">

              <div className="text-warning stat-figure">
                <MdOutlineReceiptLong size={22} />
              </div>

              <div className="stat-title">
                Belum Lunas
              </div>

              <div className="text-warning text-2xl stat-value">
                {stats.belumBayar}
              </div>

              <div className="stat-desc">
                Tagihan aktif
              </div>

            </div>

          </div>

        </section>

        <section>

          <div className="bg-base-100 border border-base-300 card">

            <div className="py-4 card-body">

              <h2 className="text-base card-title">
                Pintasan
              </h2>

              <div className="gap-4 grid grid-cols-4 text-center">

                <MenuItem
                  icon={FaPlus}
                  label="Buat Tagihan Servis Cepat"
                  href="/tagihan/tambah?cepat"
                  color="primary"
                />

                <MenuItem
                  icon={RiUserAddLine}
                  label="Manajemen Pengguna"
                  href="/pengguna"
                  color="accent"
                />

              </div>

            </div>

          </div>

        </section>

        <section>

          <div className="bg-base-100 border border-base-300 card">

            <div className="py-4 card-body">

              <h2 className="text-base card-title">
                Ringkasan Aktivitas
              </h2>

              <div className="w-full stats stats-horizontal">

                <div className="px-2! stat">

                  <div className="stat-title">
                    Tagihan Hari Ini
                  </div>

                  <div className="text-primary stat-value">
                    {stats.hariIni}
                  </div>

                </div>

                <div className="px-2! stat">

                  <div className="stat-title">
                    Sedang Proses
                  </div>

                  <div className="text-warning stat-value">
                    {stats.proses}
                  </div>

                </div>

                <div className="px-2! stat">

                  <div className="stat-title">
                    Selesai
                  </div>

                  <div className="text-success stat-value">
                    {stats.selesai}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section>

          <div className="bg-base-100 border border-base-300 card">

            <div className="py-4 card-body">

              <h2 className="text-base card-title">
                Ringkasan Omzet
              </h2>

              <div className="w-full stats stats-vertical">

                <div className="px-2! stat">

                  <div className="stat-title">
                    Minggu Ini
                  </div>

                  <div className="text-primary text-2xl stat-value">
                    Rp{" "}
                    {stats.mingguIni.toLocaleString("id-ID")}
                  </div>

                </div>

                <div className="px-2! stat">

                  <div className="stat-title">
                    Bulan Ini
                  </div>

                  <div className="text-success text-2xl stat-value">
                    Rp{" "}
                    {stats.bulanIni.toLocaleString("id-ID")}
                  </div>

                </div>

                <div className="px-2! stat">

                  <div className="stat-title">
                    Semua Waktu
                  </div>

                  <div className="text-secondary text-2xl stat-value">
                    Rp{" "}
                    {stats.semuaWaktu.toLocaleString("id-ID")}
                  </div>

                  <div className="stat-desc">
                    Total seluruh transaksi lunas
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </FragmentBody>

      {/* FOOTER */}
      <FragmentFooter>
        <BottomNav />
      </FragmentFooter>

    </FragmentLayout>
  );
}