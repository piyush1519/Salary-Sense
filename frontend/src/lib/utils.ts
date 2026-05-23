import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format number as USD salary */
export function formatSalary(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

/** Format large numbers with k/m suffix */
export function formatCompact(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
  return val.toString();
}

/** Convert R² to a readability percentage string */
export function r2Pct(r2: number): string {
  return `${(r2 * 100).toFixed(1)}%`;
}

/** Determine badge color class from a percentage gap */
export function gapColor(gap: number): string {
  if (gap > 40) return "bg-red-500/10 text-red-400 border-red-500/20";
  if (gap > 20) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-green-500/10 text-green-400 border-green-500/20";
}
