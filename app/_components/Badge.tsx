'use client'

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN: "bg-blue-100 text-blue-600",
    MEKANIK: "bg-green-100 text-green-600",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${map[role]}`}>
      {role}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    BATAL: "bg-red-100 text-red-600",
    PROSES: "bg-yellow-100 text-yellow-600",
    SELESAI: "bg-green-100 text-green-600",

    BELUM_BAYAR: "bg-red-100 text-red-600",
    SEBAGIAN: "bg-yellow-100 text-yellow-600",
    LUNAS: "bg-green-100 text-green-600",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${map[status]} text-center`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function TipeBadge({ tipe }: { tipe: string }) {
  const map: Record<string, string> = {
    BARANG: "bg-blue-100 text-blue-600",
    LAYANAN: "bg-green-100 text-green-600",
    CUSTOM: "bg-neutral-200 text-neutral-600",
  };

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded ${map[tipe]}`}>
      {tipe}
    </span>
  );
}