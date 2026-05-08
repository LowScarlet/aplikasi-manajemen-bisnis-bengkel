import Link from "next/link";
import { ElementType } from "react";

type ColorVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error";

type MenuItemProps = {
  icon: ElementType;
  label: string;
  href: string;
  color?: ColorVariant;
};

const colorStyles: Record<
  ColorVariant,
  {
    container: string;
    icon: string;
  }
> = {
  primary: {
    container: "bg-primary/10 hover:bg-primary/20",
    icon: "text-primary",
  },

  secondary: {
    container: "bg-secondary/10 hover:bg-secondary/20",
    icon: "text-secondary",
  },

  accent: {
    container: "bg-accent/10 hover:bg-accent/20",
    icon: "text-accent",
  },

  success: {
    container: "bg-success/10 hover:bg-success/20",
    icon: "text-success",
  },

  warning: {
    container: "bg-warning/10 hover:bg-warning/20",
    icon: "text-warning",
  },

  error: {
    container: "bg-error/10 hover:bg-error/20",
    icon: "text-error",
  },
};

export default function MenuItem({
  icon: Icon,
  label,
  href,
  color = "primary",
}: MenuItemProps) {
  const selectedStyle = colorStyles[color];

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2"
    >
      <div
        className={`
          btn btn-square rounded-2xl border-0 shadow-none
          ${selectedStyle.container}
          transition-all duration-200
        `}
      >
        <Icon
          size={20}
          className={selectedStyle.icon}
        />
      </div>

      <span
        className="opacity-80 group-hover:opacity-100 font-medium text-xs text-base-content transition"
      >
        {label}
      </span>
    </Link>
  );
}