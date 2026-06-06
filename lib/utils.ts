import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApplicationStatus } from "@prisma/client";

/**
 * Merges Tailwind CSS class names, handling conflicts correctly.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date value to a localized Danish date string.
 */
export function formatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("da-DK", options);
}

/**
 * Formats a date value to a localized Danish date and time string.
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("da-DK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a monetary amount to a localized currency string.
 * Amounts in cents are converted to the major unit (e.g. 21000 -> 210.00 EUR).
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "EUR",
  fromCents: boolean = false
): string {
  if (amount == null) return "—";
  const value = fromCents ? amount / 100 : amount;
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const STATUS_LABELS_DA: Record<ApplicationStatus, string> = {
  RECEIVED: "Modtaget",
  PROCESSING: "Under behandling",
  AT_NOTARY: "Hos notar",
  AT_LAWYER: "Hos advokat",
  AWAITING_CLIENT: "Afventer dig",
  COMPLETED: "Færdigbehandlet",
  CANCELLED: "Annulleret",
};

/**
 * Returns the Danish display label for an application status.
 */
export function getStatusLabel(status: ApplicationStatus): string {
  return STATUS_LABELS_DA[status] ?? status;
}

type StatusColorVariant = "badge" | "text" | "bg" | "border";

interface StatusColors {
  badge: string;
  text: string;
  bg: string;
  border: string;
}

const STATUS_COLORS: Record<ApplicationStatus, StatusColors> = {
  RECEIVED: {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  PROCESSING: {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  AT_NOTARY: {
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    text: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  AT_LAWYER: {
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    text: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  AWAITING_CLIENT: {
    badge: "bg-orange-100 text-orange-800 border-orange-200",
    text: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  COMPLETED: {
    badge: "bg-green-100 text-green-800 border-green-200",
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  CANCELLED: {
    badge: "bg-red-100 text-red-800 border-red-200",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

/**
 * Returns the Tailwind CSS color classes for an application status.
 * Pass a variant to get specific class groups: 'badge' (default), 'text', 'bg', 'border'.
 */
export function getStatusColor(
  status: ApplicationStatus,
  variant: StatusColorVariant = "badge"
): string {
  return STATUS_COLORS[status]?.[variant] ?? "bg-gray-100 text-gray-800";
}

/**
 * Truncates a string to a maximum length, adding an ellipsis if needed.
 */
export function truncate(
  str: string | null | undefined,
  maxLength: number = 100
): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Generates initials from a full name (up to 2 characters).
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Returns a relative time string in Danish (e.g. "for 2 dage siden").
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return "lige nu";
  if (diffMinutes < 60) return `for ${diffMinutes} ${diffMinutes === 1 ? "minut" : "minutter"} siden`;
  if (diffHours < 24) return `for ${diffHours} ${diffHours === 1 ? "time" : "timer"} siden`;
  if (diffDays < 7) return `for ${diffDays} ${diffDays === 1 ? "dag" : "dage"} siden`;
  if (diffWeeks < 5) return `for ${diffWeeks} ${diffWeeks === 1 ? "uge" : "uger"} siden`;
  if (diffMonths < 12) return `for ${diffMonths} ${diffMonths === 1 ? "måned" : "måneder"} siden`;
  return formatDate(d);
}

/**
 * Generates a slug from a string.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
