'use client'

type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "neutral";

const badgeStyles: Record<BadgeVariant, string> = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  neutral: "badge-neutral",
};

function formatLabel(text: string) {
  return text
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, BadgeVariant> = {
    ADMIN: "primary",
    MEKANIK: "success",
  };

  const variant = map[role] || "neutral";

  return (
    <span className={`badge badge-sm ${badgeStyles[variant]}`}>
      {formatLabel(role)}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    BATAL: "error",
    PROSES: "warning",
    SELESAI: "success",

    BELUM_BAYAR: "error",
    SEBAGIAN: "warning",
    LUNAS: "success",
  };

  const variant = map[status] || "neutral";

  return (
    <span className={`badge badge-sm ${badgeStyles[variant]}`}>
      {formatLabel(status)}
    </span>
  );
}

export function TipeBadge({ tipe }: { tipe: string }) {
  const map: Record<string, BadgeVariant> = {
    BARANG: "primary",
    LAYANAN: "success",
    CUSTOM: "neutral",
  };

  const variant = map[tipe] || "neutral";

  return (
    <span className={`badge badge-xs ${badgeStyles[variant]}`}>
      {formatLabel(tipe)}
    </span>
  );
}