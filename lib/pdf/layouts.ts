import type { PdfType } from "@prisma/client";

/**
 * Shared layout/brand constants for all generated PDFs.
 * Mirrors the navy/gold palette used in `lib/email.ts` so emailed
 * documents and the branded PDFs feel like one consistent system.
 */

/** A4 page size in points (1pt = 1/72in). */
export const PAGE_SIZE = {
  width: 595,
  height: 842,
} as const;

export const MARGINS = {
  top: 56,
  right: 48,
  bottom: 56,
  left: 48,
} as const;

export const BRAND_COLORS = {
  navy: "#0f172a",
  gold: "#d4af37",
  white: "#ffffff",
  lightGray: "#f8fafc",
  textGray: "#475569",
  borderGray: "#e2e8f0",
} as const;

export const FONT_SIZES = {
  title: 20,
  heading: 13,
  subheading: 11,
  body: 10,
  label: 8.5,
  small: 8,
} as const;

export const HEADER = {
  /** Height of the navy brand bar at the top of every page. */
  height: 84,
  /** Height of the thin gold accent line directly under the brand bar. */
  accentHeight: 3,
} as const;

export const FOOTER = {
  height: 54,
} as const;

interface PdfLayoutConfig {
  /** Document title shown in the header subtitle area. */
  documentLabel: string;
  /** Section heading color accent — all use gold by default but kept configurable. */
  accentColor: string;
  /** Spacing between key-value rows within a section. */
  rowHeight: number;
  /** Spacing between sections. */
  sectionGap: number;
}

/**
 * Per-`PdfType` layout configuration. Every generator should read its
 * config from here so tweaks to spacing/labels stay centralized.
 */
export const PDF_LAYOUTS: Record<PdfType, PdfLayoutConfig> = {
  EX18_FORM: {
    documentLabel: "Forberedt grundlag for EX-18 ansøgning",
    accentColor: BRAND_COLORS.gold,
    rowHeight: 22,
    sectionGap: 28,
  },
  CUSTOMER_RECEIPT: {
    documentLabel: "Kvittering for betaling",
    accentColor: BRAND_COLORS.gold,
    rowHeight: 22,
    sectionGap: 28,
  },
  CASE_OVERVIEW: {
    documentLabel: "Sagsoverblik",
    accentColor: BRAND_COLORS.gold,
    rowHeight: 22,
    sectionGap: 26,
  },
  NOTARY_PACKAGE: {
    documentLabel: "Dokumentpakke til notar",
    accentColor: BRAND_COLORS.gold,
    rowHeight: 22,
    sectionGap: 26,
  },
  LAWYER_PACKAGE: {
    documentLabel: "Dokumentpakke til advokat",
    accentColor: BRAND_COLORS.gold,
    rowHeight: 22,
    sectionGap: 26,
  },
} as const;

/** Usable content width inside the page margins. */
export const CONTENT_WIDTH = PAGE_SIZE.width - MARGINS.left - MARGINS.right;
