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

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { logout } from "@/app/auth/logout/action";
import MenuItem from "../_components/MenuItem";

export default function ClientPage({
  user,
  stats,
  omzetHarian = [],
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

    mingguLabel: string;
    bulanLabel: string;

    mingguGrowth: {
      naik: boolean;
      persen: string | number;
    };

    bulanGrowth: {
      naik: boolean;
      persen: string | number;
    };
  };
  omzetHarian?: Array<{
    tanggal: string;
    total: number;
  }>;
}) {
  // Format data untuk chart
  const chartData = omzetHarian.map((item) => ({
    name: new Date(item.tanggal).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    }),
    total: item.total,
  }));

  const total30Hari =
    omzetHarian.reduce(
      (acc, item) => acc + item.total,
      0
    );

  const firstValue =
    omzetHarian[0]?.total ?? 0;

  const lastValue =
    omzetHarian[
      omzetHarian.length - 1
    ]?.total ?? 0;

  const growth30Hari =
    firstValue === 0
      ? 100
      : (
        (
          (lastValue - firstValue)
          /
          firstValue
        ) * 100
      );

  const isGrowthPositive =
    growth30Hari >= 0;

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

              <div className="gap-4 grid grid-cols-3 text-center">

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

        {chartData.length > 0 && (
          <section>

            <div className="bg-base-100 border border-base-300 card">

              <div className="py-4 card-body">

                <div className="flex justify-between items-start">

                  <div>
                    <h2 className="text-base card-title">
                      Grafik Omzet (30 Hari)
                    </h2>

                    <p className="text-sm text-base-content/60">
                      Performa omzet harian
                    </p>
                  </div>

                  <div className="text-right">

                    <div className="font-semibold text-sm">
                      Rp{" "}
                      {total30Hari.toLocaleString("id-ID")}
                    </div>

                    <div
                      className={
                        isGrowthPositive
                          ? "text-success text-xs font-medium"
                          : "text-error text-xs font-medium"
                      }
                    >
                      {isGrowthPositive ? "⬆" : "⬇"}{" "}
                      {Math.abs(growth30Hari).toFixed(1)}%
                    </div>

                  </div>

                </div>

                <div
                  className="w-full h-64 select-none"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        stroke="#d1d5db"
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        stroke="#d1d5db"
                        tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--b1))",
                          border: "1px solid hsl(var(--b3))",
                          borderRadius: "0.5rem",
                          color: "hsl(var(--bc))",
                        }}
                        formatter={(value: any) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#0d47a1"
                        strokeWidth={3}
                        dot={{
                          fill: "#0d47a1",
                          r: 4,
                          style: {
                            outline: "none",
                          },
                        }}
                        activeDot={{
                          r: 6,
                          style: {
                            outline: "none",
                          },
                        }}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

              </div>

            </div>

          </section>
        )}

        <section>

          <div className="bg-base-100 border border-base-300 card">

            <div className="py-4 card-body">

              <div className="flex justify-between items-center">

                <div>
                  <h2 className="text-base card-title">
                    Ringkasan Omzet
                  </h2>

                  <p className="text-sm text-base-content/60">
                    Statistik transaksi lunas
                  </p>
                </div>

              </div>

              <div className="space-y-3 mt-2">

                {/* Minggu Ini */}
                <div className="bg-base-200/40 rounded-xl stat">

                  <div className="stat-title">
                    Minggu Ini
                  </div>

                  <div className="text-primary text-2xl stat-value">
                    Rp{" "}
                    {stats.mingguIni.toLocaleString("id-ID")}
                  </div>

                  <div className="flex justify-between items-center mt-1 stat-desc">

                    <span>
                      {stats.mingguLabel}
                    </span>

                    <span
                      className={
                        stats.mingguGrowth.naik
                          ? "text-success font-medium"
                          : "text-error font-medium"
                      }
                    >
                      {stats.mingguGrowth.naik ? "⬆" : "⬇"}{" "}
                      {stats.mingguGrowth.persen}%
                    </span>

                  </div>

                  <div className="mt-1 text-xs stat-desc">
                    Dibanding minggu lalu
                  </div>

                </div>

                {/* Bulan Ini */}
                <div className="bg-base-200/40 rounded-xl stat">

                  <div className="stat-title">
                    Bulan Ini
                  </div>

                  <div className="text-success text-2xl stat-value">
                    Rp{" "}
                    {stats.bulanIni.toLocaleString("id-ID")}
                  </div>

                  <div className="flex justify-between items-center mt-1 stat-desc">

                    <span>
                      {stats.bulanLabel}
                    </span>

                    <span
                      className={
                        stats.bulanGrowth.naik
                          ? "text-success font-medium"
                          : "text-error font-medium"
                      }
                    >
                      {stats.bulanGrowth.naik ? "⬆" : "⬇"}{" "}
                      {stats.bulanGrowth.persen}%
                    </span>

                  </div>

                  <div className="mt-1 text-xs stat-desc">
                    Dibanding bulan lalu
                  </div>

                </div>

                {/* Semua Waktu */}
                <div className="bg-base-200/40 rounded-xl stat">

                  <div className="stat-title">
                    Semua Waktu
                  </div>

                  <div className="text-secondary text-2xl stat-value">
                    Rp{" "}
                    {stats.semuaWaktu.toLocaleString("id-ID")}
                  </div>

                  <div className="mt-1 stat-desc">
                    Total seluruh transaksi lunas
                  </div>

                  <div className="mt-1 text-xs stat-desc">
                    Sejak awal penggunaan sistem
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