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
    BELUM_BAYAR: "bg-red-100 text-red-600",
    SEBAGIAN: "bg-yellow-100 text-yellow-600",
    LUNAS: "bg-green-100 text-green-600",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${map[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}