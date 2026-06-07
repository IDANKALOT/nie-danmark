import { readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Application, PdfType } from "@prisma/client";
import { formatDateTime } from "@/lib/utils";
import { mapApplicationToOfficialEx18Fields } from "./ex18-field-mapper";
import {
  PAGE_SIZE,
  MARGINS,
  BRAND_COLORS,
  FONT_SIZES,
  HEADER,
  FOOTER,
  CONTENT_WIDTH,
  PDF_LAYOUTS,
} from "./layouts";

/**
 * Shared, branded PDF generation built on `pdf-lib`.
 *
 * Four of the five generated documents (customer receipt, case overview,
 * notary package, lawyer package) are original NIE Danmark-branded documents
 * built from scratch with the helpers below. The fifth — the EX-18 form
 * itself — is produced by filling the *official* Spanish government template
 * at `lib/pdf/templates/ex18-official.pdf` (see `generateOfficialEx18Form`),
 * not facsimiled.
 *
 * The branded generators share:
 *  - a branded navy header with gold "NIE Danmark" wordmark + gold accent line
 *  - a footer with page number, generation timestamp and a disclaimer
 *  - a generic "key-value section" drawing helper for consistent layout
 *  - graceful text wrapping/truncation so long names/addresses never overflow
 */

// ── low-level helpers ────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

const COLOR = {
  navy: hexToRgb(BRAND_COLORS.navy),
  gold: hexToRgb(BRAND_COLORS.gold),
  white: hexToRgb(BRAND_COLORS.white),
  lightGray: hexToRgb(BRAND_COLORS.lightGray),
  textGray: hexToRgb(BRAND_COLORS.textGray),
  borderGray: hexToRgb(BRAND_COLORS.borderGray),
};

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

/** Tracks the current page and vertical cursor while drawing a document. */
interface DrawCursor {
  doc: PDFDocument;
  fonts: Fonts;
  type: PdfType;
  page: PDFPage;
  /** Distance from the top of the page where the next element should start. */
  y: number;
  pageCount: number;
}

/**
 * Wraps a string into lines that fit within `maxWidth`, using the given font
 * and size. Falls back to hard character-splitting for unbroken long tokens
 * (e.g. very long emails) so nothing ever overflows the page.
 */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return [""];

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";

  const pushHardSplit = (word: string) => {
    let remainder = word;
    while (font.widthOfTextAtSize(remainder, size) > maxWidth && remainder.length > 1) {
      let cut = remainder.length - 1;
      while (cut > 1 && font.widthOfTextAtSize(remainder.slice(0, cut), size) > maxWidth) {
        cut -= 1;
      }
      lines.push(remainder.slice(0, cut));
      remainder = remainder.slice(cut);
    }
    return remainder;
  };

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = "";
    }

    if (font.widthOfTextAtSize(word, size) > maxWidth) {
      current = pushHardSplit(word);
    } else {
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

// ── header / footer ──────────────────────────────────────────────────

/**
 * Draws the branded navy header (with gold "NIE Danmark" wordmark, document
 * label and gold accent line) on the given page. Returns the y-position
 * (distance from top) where body content may safely start.
 */
function drawHeader(page: PDFPage, fonts: Fonts, type: PdfType): number {
  const { width, height } = page.getSize();
  const layout = PDF_LAYOUTS[type];

  // Navy bar across the top
  page.drawRectangle({
    x: 0,
    y: height - HEADER.height,
    width,
    height: HEADER.height,
    color: COLOR.navy,
  });

  // Gold accent line directly under the bar
  page.drawRectangle({
    x: 0,
    y: height - HEADER.height - HEADER.accentHeight,
    width,
    height: HEADER.accentHeight,
    color: COLOR.gold,
  });

  // Wordmark
  page.drawText("NIE Danmark", {
    x: MARGINS.left,
    y: height - 38,
    size: FONT_SIZES.title,
    font: fonts.bold,
    color: COLOR.gold,
  });

  page.drawText("Spansk NIE Nummer Service", {
    x: MARGINS.left,
    y: height - 56,
    size: FONT_SIZES.small,
    font: fonts.regular,
    color: COLOR.white,
    opacity: 0.7,
  });

  // Document label, right-aligned
  const labelSize = FONT_SIZES.subheading;
  const labelWidth = fonts.bold.widthOfTextAtSize(layout.documentLabel, labelSize);
  page.drawText(layout.documentLabel, {
    x: width - MARGINS.right - labelWidth,
    y: height - 48,
    size: labelSize,
    font: fonts.bold,
    color: COLOR.gold,
  });

  return height - HEADER.height - HEADER.accentHeight - 28;
}

/**
 * Draws the footer (page number, generation timestamp, disclaimer) on the
 * given page.
 */
function drawFooter(page: PDFPage, fonts: Fonts, pageNumber: number, generatedAt: Date): void {
  const { width } = page.getSize();
  const baseY = MARGINS.bottom - 18;

  page.drawLine({
    start: { x: MARGINS.left, y: baseY + 22 },
    end: { x: width - MARGINS.right, y: baseY + 22 },
    thickness: 0.75,
    color: COLOR.borderGray,
  });

  page.drawText(
    "Genereret af NIE Danmark — ikke et officielt myndighedsdokument",
    {
      x: MARGINS.left,
      y: baseY + 8,
      size: FONT_SIZES.small,
      font: fonts.regular,
      color: COLOR.textGray,
    }
  );

  page.drawText(`Genereret: ${formatDateTime(generatedAt)}`, {
    x: MARGINS.left,
    y: baseY - 4,
    size: FONT_SIZES.small,
    font: fonts.regular,
    color: COLOR.textGray,
  });

  const pageLabel = `Side ${pageNumber}`;
  const pageLabelWidth = fonts.regular.widthOfTextAtSize(pageLabel, FONT_SIZES.small);
  page.drawText(pageLabel, {
    x: width - MARGINS.right - pageLabelWidth,
    y: baseY - 4,
    size: FONT_SIZES.small,
    font: fonts.regular,
    color: COLOR.textGray,
  });
}

/** Minimum y (distance from bottom) body content may occupy before the footer area starts. */
const BODY_BOTTOM_LIMIT = FOOTER.height + 12;

/**
 * Adds a new page to the cursor's document, draws its header, and resets the
 * vertical position. Used both for the first page and for overflow.
 */
function addPage(cursor: DrawCursor): void {
  const page = cursor.doc.addPage([PAGE_SIZE.width, PAGE_SIZE.height]);
  cursor.page = page;
  cursor.pageCount += 1;
  cursor.y = drawHeader(page, cursor.fonts, cursor.type);
}

/** Ensures there is room for `neededHeight` more content; starts a new page if not. */
function ensureSpace(cursor: DrawCursor, neededHeight: number): void {
  if (cursor.y - neededHeight < BODY_BOTTOM_LIMIT) {
    addPage(cursor);
  }
}

// ── generic content helpers ──────────────────────────────────────────

/** Draws a section heading (bold, navy, with a thin gold underline). */
function drawSectionHeading(cursor: DrawCursor, title: string): void {
  ensureSpace(cursor, 34);
  const { page, fonts, y } = cursor;

  page.drawText(title, {
    x: MARGINS.left,
    y,
    size: FONT_SIZES.heading,
    font: fonts.bold,
    color: COLOR.navy,
  });

  page.drawLine({
    start: { x: MARGINS.left, y: y - 8 },
    end: { x: MARGINS.left + 36, y: y - 8 },
    thickness: 2,
    color: COLOR.gold,
  });

  cursor.y = y - 26;
}

/**
 * Generic key-value section drawer shared by every generator: renders a
 * bordered card with a title and a list of label/value rows. Long values wrap
 * onto multiple lines (never overflow the page width); the card height grows
 * to fit and a new page is started automatically if needed.
 */
function drawKeyValueSection(
  cursor: DrawCursor,
  title: string,
  rows: { label: string; value: string }[]
): void {
  drawSectionHeading(cursor, title);

  const { fonts } = cursor;
  const labelWidth = 150;
  const valueWidth = CONTENT_WIDTH - labelWidth - 32;
  const lineHeight = FONT_SIZES.body + 5;
  const rowPaddingY = 10;

  // Pre-compute wrapped lines so we know the card height up front.
  const wrappedRows = rows.map((row) => ({
    label: row.label,
    lines: wrapText(row.value || "—", fonts.regular, FONT_SIZES.body, valueWidth),
  }));

  const cardHeight =
    wrappedRows.reduce((sum, r) => sum + r.lines.length * lineHeight + rowPaddingY, 0) + rowPaddingY;

  ensureSpace(cursor, cardHeight + 12);

  const { page } = cursor;
  const cardTop = cursor.y;
  const cardX = MARGINS.left;

  page.drawRectangle({
    x: cardX,
    y: cardTop - cardHeight,
    width: CONTENT_WIDTH,
    height: cardHeight,
    color: COLOR.lightGray,
    borderColor: COLOR.borderGray,
    borderWidth: 1,
  });

  let rowY = cardTop - rowPaddingY - FONT_SIZES.body;

  wrappedRows.forEach((row, index) => {
    page.drawText(row.label, {
      x: cardX + 16,
      y: rowY,
      size: FONT_SIZES.label,
      font: fonts.bold,
      color: COLOR.textGray,
    });

    row.lines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: cardX + 16 + labelWidth,
        y: rowY - lineIndex * lineHeight,
        size: FONT_SIZES.body,
        font: fonts.regular,
        color: COLOR.navy,
      });
    });

    const consumed = row.lines.length * lineHeight + rowPaddingY;
    rowY -= consumed;

    const isLast = index === wrappedRows.length - 1;
    if (!isLast) {
      page.drawLine({
        start: { x: cardX + 16, y: rowY + rowPaddingY / 2 },
        end: { x: cardX + CONTENT_WIDTH - 16, y: rowY + rowPaddingY / 2 },
        thickness: 0.5,
        color: COLOR.borderGray,
      });
    }
  });

  cursor.y = cardTop - cardHeight - PDF_LAYOUTS[cursor.type].sectionGap;
}

/** Draws a paragraph of body text, wrapping to fit the content width. */
function drawParagraph(cursor: DrawCursor, text: string, options?: { bold?: boolean; gap?: number }): void {
  const { fonts } = cursor;
  const font = options?.bold ? fonts.bold : fonts.regular;
  const lines = wrapText(text, font, FONT_SIZES.body, CONTENT_WIDTH);
  const lineHeight = FONT_SIZES.body + 6;

  ensureSpace(cursor, lines.length * lineHeight + (options?.gap ?? 12));

  lines.forEach((line, index) => {
    cursor.page.drawText(line, {
      x: MARGINS.left,
      y: cursor.y - index * lineHeight,
      size: FONT_SIZES.body,
      font,
      color: COLOR.textGray,
    });
  });

  cursor.y -= lines.length * lineHeight + (options?.gap ?? 12);
}

/** Draws a checklist of items with gold check marks. */
function drawChecklist(cursor: DrawCursor, items: string[]): void {
  const { fonts } = cursor;
  const itemGap = 6;
  const lineHeight = FONT_SIZES.body + 5;
  const indent = 20;
  const textMaxWidth = CONTENT_WIDTH - indent;

  for (const item of items) {
    const lines = wrapText(item, fonts.regular, FONT_SIZES.body, textMaxWidth);
    ensureSpace(cursor, lines.length * lineHeight + itemGap);

    cursor.page.drawText("✓", {
      x: MARGINS.left,
      y: cursor.y,
      size: FONT_SIZES.body,
      font: fonts.bold,
      color: COLOR.gold,
    });

    lines.forEach((line, index) => {
      cursor.page.drawText(line, {
        x: MARGINS.left + indent,
        y: cursor.y - index * lineHeight,
        size: FONT_SIZES.body,
        font: fonts.regular,
        color: COLOR.textGray,
      });
    });

    cursor.y -= lines.length * lineHeight + itemGap;
  }

  cursor.y -= 8;
}

/** Draws a prominent navy "title block" beneath the header (used for document intros). */
function drawIntroBlock(cursor: DrawCursor, heading: string, subtext: string): void {
  const { fonts } = cursor;
  const titleLines = wrapText(heading, fonts.bold, FONT_SIZES.title - 2, CONTENT_WIDTH);
  const subLines = wrapText(subtext, fonts.regular, FONT_SIZES.body, CONTENT_WIDTH);
  const titleLineHeight = FONT_SIZES.title + 2;
  const subLineHeight = FONT_SIZES.body + 6;

  ensureSpace(cursor, titleLines.length * titleLineHeight + subLines.length * subLineHeight + 30);

  titleLines.forEach((line, index) => {
    cursor.page.drawText(line, {
      x: MARGINS.left,
      y: cursor.y - index * titleLineHeight,
      size: FONT_SIZES.title - 2,
      font: fonts.bold,
      color: COLOR.navy,
    });
  });
  cursor.y -= titleLines.length * titleLineHeight + 6;

  subLines.forEach((line, index) => {
    cursor.page.drawText(line, {
      x: MARGINS.left,
      y: cursor.y - index * subLineHeight,
      size: FONT_SIZES.body,
      font: fonts.regular,
      color: COLOR.textGray,
    });
  });
  cursor.y -= subLines.length * subLineHeight + 18;

  cursor.page.drawLine({
    start: { x: MARGINS.left, y: cursor.y },
    end: { x: PAGE_SIZE.width - MARGINS.right, y: cursor.y },
    thickness: 1,
    color: COLOR.borderGray,
  });
  cursor.y -= 24;
}

// ── document scaffold ────────────────────────────────────────────────

async function createDocument(type: PdfType): Promise<{ doc: PDFDocument; cursor: DrawCursor; generatedAt: Date }> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${PDF_LAYOUTS[type].documentLabel} — NIE Danmark`);
  doc.setProducer("NIE Danmark");
  doc.setCreator("NIE Danmark dokumentgenerator");

  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };

  const cursor: DrawCursor = {
    doc,
    fonts,
    type,
    page: doc.addPage([PAGE_SIZE.width, PAGE_SIZE.height]),
    y: 0,
    pageCount: 1,
  };
  cursor.y = drawHeader(cursor.page, fonts, type);

  return { doc, cursor, generatedAt: new Date() };
}

/** Draws the footer on every page that was created during generation. */
function finalizeFooters(doc: PDFDocument, fonts: Fonts, generatedAt: Date): void {
  const pages = doc.getPages();
  pages.forEach((page, index) => {
    drawFooter(page, fonts, index + 1, generatedAt);
  });
}

async function finalize(doc: PDFDocument, cursor: DrawCursor, generatedAt: Date): Promise<Uint8Array> {
  finalizeFooters(doc, cursor.fonts, generatedAt);
  return doc.save();
}

// ── shared application summary block ─────────────────────────────────

function applicantSummaryRows(application: Application, fields: Record<string, string>) {
  return [
    { label: "Fulde navn", value: fields.fullName ?? application.fullName },
    { label: "E-mail", value: fields.email ?? application.email },
    { label: "Telefon", value: fields.phone ?? application.phone },
    { label: "Ansøgnings-ID", value: fields.applicationId ?? application.id },
  ];
}

// ── 1. EX-18 form (official government template, filled) ─────────────

const EX18_TEMPLATE_PATH = path.join(process.cwd(), "lib", "pdf", "templates", "ex18-official.pdf");

/**
 * Fills the official Spanish EX-18 template — "Solicitud de NIE / Certificado
 * de Registro de Ciudadano de la Unión", sourced directly from the Ministerio
 * del Interior — with the subset of applicant data we can map confidently
 * (see `mapApplicationToOfficialEx18Fields`).
 *
 * The template has ~98 AcroForm fields; the official form asks for far more
 * than NIE Danmark collects at checkout (place/country of birth, nationality,
 * marital status, parents' names, Spanish domicile, legal representatives,
 * etc.). Those are intentionally left blank for the case team / notary /
 * lawyer to complete from documents gathered later in the process.
 *
 * Deliberately NOT flattened: flattening a mostly-empty legal form would lock
 * in the gaps and force the remaining ~85 fields to be filled out by hand on
 * paper. Leaving it as a live AcroForm lets whoever finishes it do so
 * digitally, in any PDF viewer, before printing/submitting.
 */
export async function generateOfficialEx18Form(application: Application): Promise<Uint8Array> {
  const templateBytes = readFileSync(EX18_TEMPLATE_PATH);
  const doc = await PDFDocument.load(templateBytes);
  const form = doc.getForm();

  for (const [name, value] of Object.entries(mapApplicationToOfficialEx18Fields(application))) {
    if (!value) continue;
    try {
      form.getTextField(name).setText(value);
    } catch (err) {
      console.error(`[pdf] Could not set official EX-18 field "${name}":`, err);
    }
  }

  return doc.save();
}

// ── 2. Customer receipt ──────────────────────────────────────────────

export async function generateCustomerReceipt(
  application: Application,
  fields: Record<string, string>
): Promise<Uint8Array> {
  const type: PdfType = "CUSTOMER_RECEIPT";
  const { doc, cursor, generatedAt } = await createDocument(type);

  drawIntroBlock(
    cursor,
    "Kvittering",
    "Tak for din betaling. Denne kvittering bekræfter, at NIE Danmark har modtaget betaling for behandling af din NIE-ansøgning."
  );

  drawKeyValueSection(cursor, "Betalingsoplysninger", [
    { label: "Beløb", value: fields.amount || "210,00 EUR" },
    { label: "Valuta", value: fields.currency ?? application.currency },
    { label: "Ansøgnings-ID", value: fields.applicationId ?? application.id },
    { label: "Dato", value: fields.createdAt },
    { label: "Betalingsstatus", value: "Betalt" },
  ]);

  drawKeyValueSection(cursor, "Kundeoplysninger", applicantSummaryRows(application, fields));

  drawParagraph(
    cursor,
    "Denne kvittering er udstedt af NIE Danmark for administration og koordinering af din NIE-ansøgningsproces. Gem den til dine egne regnskabs- og dokumentationsformål."
  );

  return finalize(doc, cursor, generatedAt);
}

// ── 3. Case overview ──────────────────────────────────────────────────

export async function generateCaseOverview(
  application: Application,
  fields: Record<string, string>
): Promise<Uint8Array> {
  const type: PdfType = "CASE_OVERVIEW";
  const { doc, cursor, generatedAt } = await createDocument(type);

  drawIntroBlock(
    cursor,
    "Sagsoverblik",
    "Et samlet overblik over sagen — alle ansøgningsoplysninger, nuværende status og et tidslinje-udgangspunkt til brug for det interne sagsbehandlingsteam."
  );

  drawKeyValueSection(cursor, "Ansøger", applicantSummaryRows(application, fields));

  drawKeyValueSection(cursor, "Personoplysninger", [
    { label: "Fødselsdato", value: fields.dateOfBirth },
    { label: "Pasnummer", value: fields.passportNumber ?? application.passportNumber },
    { label: "Land", value: fields.country ?? application.country },
  ]);

  drawKeyValueSection(cursor, "Adresse", [
    { label: "Adresse", value: fields.address ?? application.address },
    { label: "Postnummer og by", value: `${fields.postalCode ?? application.postalCode} ${fields.city ?? application.city}` },
    { label: "Fuld adresse", value: fields.fullAddress },
  ]);

  drawKeyValueSection(cursor, "Sagsstatus", [
    { label: "Nuværende status", value: getCaseStatusLabel(application.status) },
    { label: "Betalingsstatus", value: getPaymentStatusLabel(application.paymentStatus) },
    { label: "Beløb", value: fields.amount },
    { label: "Oprettet", value: fields.createdAt },
  ]);

  drawSectionHeading(cursor, "Tidslinje (udgangspunkt)");
  drawChecklist(cursor, [
    "Ansøgning modtaget og registreret hos NIE Danmark",
    "Betaling bekræftet — sagen overgår til behandling",
    "Dokumenter under gennemgang hos sagsbehandlingsteamet",
    "Sag koordineres med notar og/eller advokat",
    "Endelig indsendelse til spanske myndigheder",
  ]);
  drawParagraph(
    cursor,
    "Tidslinjen er et udgangspunkt for det interne overblik. Den fulde, opdaterede statushistorik findes i admin-systemet under sagen.",
    { gap: 4 }
  );

  return finalize(doc, cursor, generatedAt);
}

function getCaseStatusLabel(status: Application["status"]): string {
  const labels: Record<Application["status"], string> = {
    RECEIVED: "Modtaget",
    PROCESSING: "Under behandling",
    AT_NOTARY: "Hos notar",
    AT_LAWYER: "Hos advokat",
    AWAITING_CLIENT: "Afventer kunde",
    COMPLETED: "Færdigbehandlet",
    CANCELLED: "Annulleret",
  };
  return labels[status] ?? status;
}

function getPaymentStatusLabel(status: Application["paymentStatus"]): string {
  const labels: Record<Application["paymentStatus"], string> = {
    PENDING: "Afventer",
    PAID: "Betalt",
    REFUNDED: "Refunderet",
    FAILED: "Mislykkedes",
  };
  return labels[status] ?? status;
}

// ── 4 & 5. Notary / lawyer packages ───────────────────────────────────

interface PackageCopy {
  recipientLabel: string;
  intro: string;
  framing: string;
  checklistHeading: string;
}

const PACKAGE_COPY: Record<"NOTARY_PACKAGE" | "LAWYER_PACKAGE", PackageCopy> = {
  NOTARY_PACKAGE: {
    recipientLabel: "Til notarens opmærksomhed",
    intro:
      "Denne dokumentpakke er sammensat af NIE Danmark som forsideark til en sag, der er klar til behandling hos notaren. Pakken indeholder et overblik over sagen og ansøgeren samt en oversigt over de medfølgende dokumenter.",
    framing:
      "Sagen er betalt og bekræftet af NIE Danmark, og ansøgeren har givet samtykke til, at sagens oplysninger og dokumenter videregives til notaren med henblik på notarisering som led i NIE-ansøgningsprocessen.",
    checklistHeading: "Medfølgende dokumenter til notaren",
  },
  LAWYER_PACKAGE: {
    recipientLabel: "Til advokatens opmærksomhed",
    intro:
      "Denne dokumentpakke er sammensat af NIE Danmark som forsideark til en sag, der er klar til juridisk gennemgang. Pakken indeholder et overblik over sagen og ansøgeren samt en oversigt over de medfølgende dokumenter til den juridiske vurdering.",
    framing:
      "Sagen er betalt og bekræftet af NIE Danmark. Ansøgeren har anmodet om juridisk bistand som en del af NIE-ansøgningsprocessen, og denne pakke udgør grundlaget for advokatens indledende juridiske gennemgang af sagen.",
    checklistHeading: "Medfølgende dokumenter til juridisk gennemgang",
  },
};

const PACKAGE_CHECKLIST_ITEMS = [
  "Forsideark med sags- og ansøgeroversigt (dette dokument)",
  "Forberedt grundlag for EX-18 ansøgning (data-sammendrag)",
  "Sagsoverblik med status og tidslinje",
  "Kvittering for betaling af sagsbehandlingsgebyr",
  "Kopi af ansøgerens indsendte personoplysninger og adresse",
];

async function generatePackageCoverSheet(
  type: "NOTARY_PACKAGE" | "LAWYER_PACKAGE",
  application: Application,
  fields: Record<string, string>
): Promise<Uint8Array> {
  const { doc, cursor, generatedAt } = await createDocument(type);
  const copy = PACKAGE_COPY[type];

  drawIntroBlock(cursor, copy.recipientLabel, copy.intro);

  drawKeyValueSection(cursor, "Sagsoplysninger", [
    { label: "Ansøgnings-ID", value: fields.applicationId ?? application.id },
    { label: "Nuværende status", value: getCaseStatusLabel(application.status) },
    { label: "Modtaget", value: fields.createdAt },
    { label: "Beløb betalt", value: fields.amount },
  ]);

  drawKeyValueSection(cursor, "Ansøgeroplysninger", [
    ...applicantSummaryRows(application, fields),
    { label: "Fødselsdato", value: fields.dateOfBirth },
    { label: "Pasnummer", value: fields.passportNumber ?? application.passportNumber },
    { label: "Adresse", value: fields.fullAddress },
  ]);

  drawSectionHeading(cursor, copy.checklistHeading);
  drawChecklist(cursor, PACKAGE_CHECKLIST_ITEMS);

  drawParagraph(cursor, copy.framing);

  return finalize(doc, cursor, generatedAt);
}

export async function generateNotaryPackage(
  application: Application,
  fields: Record<string, string>
): Promise<Uint8Array> {
  return generatePackageCoverSheet("NOTARY_PACKAGE", application, fields);
}

export async function generateLawyerPackage(
  application: Application,
  fields: Record<string, string>
): Promise<Uint8Array> {
  return generatePackageCoverSheet("LAWYER_PACKAGE", application, fields);
}
