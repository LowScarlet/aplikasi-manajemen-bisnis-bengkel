import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function format(num: number) {
  return num.toLocaleString("id-ID");
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("id-ID");
}