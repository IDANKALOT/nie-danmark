import type { Application, GeneratedPDF, PdfType } from "@prisma/client";
import { db } from "@/lib/db";
import { uploadBuffer } from "@/lib/storage";
import { sendNotaryPackageEmail, sendLawyerPackageEmail } from "@/lib/email";
import { mapApplicationToEx18Fields } from "./ex18-field-mapper";
import {
  generateOfficialEx18Form,
  generateCustomerReceipt,
  generateCaseOverview,
  generateNotaryPackage,
  generateLawyerPackage,
} from "./pdf-generator";

const LOG_PREFIX = "[pdf-orchestrator]";

const EX18_FORM_TEMPLATE_TYPE = "EX-18";

interface PdfJob {
  type: PdfType;
  slug: string;
  generate: (application: Application, fields: Record<string, string>) => Promise<Uint8Array>;
}

const PDF_JOBS: PdfJob[] = [
  { type: "EX18_FORM", slug: "ex18-form", generate: generateOfficialEx18Form },
  { type: "CUSTOMER_RECEIPT", slug: "kvittering", generate: generateCustomerReceipt },
  { type: "CASE_OVERVIEW", slug: "sagsoverblik", generate: generateCaseOverview },
  { type: "NOTARY_PACKAGE", slug: "notarpakke", generate: generateNotaryPackage },
  { type: "LAWYER_PACKAGE", slug: "advokatpakke", generate: generateLawyerPackage },
];

interface GeneratedRecord {
  pdf: GeneratedPDF;
  buffer: Buffer;
}

/**
 * Generates all five branded PDF documents for an application, uploads them
 * to storage, persists `GeneratedPDF` rows, and dispatches the notary/lawyer
 * package emails with the relevant attachments.
 *
 * Designed to be called fire-and-forget (`.catch(...)`) — every step is
 * wrapped so that a single failure (e.g. a missing form version, a failed
 * upload, or a failed email send) never throws past this function and never
 * prevents the remaining steps from running.
 */
export async function generateAndDispatchDocuments(applicationId: string): Promise<void> {
  let application: (Application & { user: { email: string | null; name: string | null } | null }) | null = null;

  try {
    application = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        user: { select: { email: true, name: true } },
      },
    });
  } catch (err) {
    console.error(`${LOG_PREFIX} Failed to load application ${applicationId}:`, err);
    return;
  }

  if (!application) {
    console.error(`${LOG_PREFIX} Application ${applicationId} not found — skipping document generation.`);
    return;
  }

  // Look up the active EX-18 form version (used for field mapping + linking
  // generated PDFs back to the version that produced them). Gracefully
  // degrade if no template/version is configured — we still generate the
  // other four PDF types, just without an EX-18-specific field mapping link.
  let formVersionId: string | null = null;
  try {
    const template = await db.formTemplate.findUnique({
      where: { type: EX18_FORM_TEMPLATE_TYPE },
      include: {
        versions: {
          where: { active: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (template && template.versions.length > 0) {
      formVersionId = template.versions[0].id;
    } else {
      console.error(
        `${LOG_PREFIX} No active FormVersion found for template type "${EX18_FORM_TEMPLATE_TYPE}" — proceeding without a linked form version.`
      );
    }
  } catch (err) {
    console.error(`${LOG_PREFIX} Failed to look up FormTemplate/FormVersion for "${EX18_FORM_TEMPLATE_TYPE}":`, err);
  }

  const fields = mapApplicationToEx18Fields(application);

  const generated: Partial<Record<PdfType, GeneratedRecord>> = {};

  for (const job of PDF_JOBS) {
    try {
      const bytes = await job.generate(application, fields);
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const fileName = `${job.slug}-${timestamp}.pdf`;
      const pathname = `applications/${applicationId}/${fileName}`;

      const { url, size } = await uploadBuffer(buffer, pathname, "application/pdf");

      const pdfRecord = await db.generatedPDF.create({
        data: {
          applicationId,
          formVersionId,
          type: job.type,
          url,
          fileName,
          size,
        },
      });

      generated[job.type] = { pdf: pdfRecord, buffer };
      console.log(`${LOG_PREFIX} Generated ${job.type} for application ${applicationId} → ${url}`);
    } catch (err) {
      console.error(`${LOG_PREFIX} Failed to generate/store ${job.type} for application ${applicationId}:`, err);
    }
  }

  // Dispatch the notary package email (EX-18 form + case overview as the core
  // attachments, falling back gracefully to whatever generated successfully).
  await dispatchPackage({
    applicationId,
    fullName: application.fullName,
    pdfType: "NOTARY_PACKAGE",
    generated,
    send: sendNotaryPackageEmail,
    sentField: "sentToNotary",
    recipientLabel: "notar",
  });

  await dispatchPackage({
    applicationId,
    fullName: application.fullName,
    pdfType: "LAWYER_PACKAGE",
    generated,
    send: sendLawyerPackageEmail,
    sentField: "sentToLawyer",
    recipientLabel: "advokat",
  });
}

interface DispatchPackageParams {
  applicationId: string;
  fullName: string;
  pdfType: "NOTARY_PACKAGE" | "LAWYER_PACKAGE";
  generated: Partial<Record<PdfType, GeneratedRecord>>;
  send: (data: {
    applicationId: string;
    fullName: string;
    attachments: { filename: string; content: Buffer }[];
  }) => Promise<void>;
  sentField: "sentToNotary" | "sentToLawyer";
  recipientLabel: string;
}

/**
 * Sends a package email (notary or lawyer) with whichever generated PDFs are
 * available as attachments, then flips the corresponding `sentTo*` flag on
 * the package's own `GeneratedPDF` row. Wrapped so a failure here never
 * affects the other dispatch or the already-persisted `GeneratedPDF` rows.
 */
async function dispatchPackage(params: DispatchPackageParams): Promise<void> {
  const { applicationId, fullName, pdfType, generated, send, sentField, recipientLabel } = params;

  const packageRecord = generated[pdfType];
  if (!packageRecord) {
    console.error(
      `${LOG_PREFIX} Skipping ${recipientLabel} email dispatch for application ${applicationId} — ${pdfType} was not generated.`
    );
    return;
  }

  // Attach the cover-sheet package plus the supporting documents that were
  // generated successfully (EX-18 prep aid + case overview + receipt).
  const attachmentOrder: PdfType[] = [pdfType, "EX18_FORM", "CASE_OVERVIEW", "CUSTOMER_RECEIPT"];
  const attachments = attachmentOrder
    .map((type) => generated[type])
    .filter((record): record is GeneratedRecord => Boolean(record))
    .map((record) => ({ filename: record.pdf.fileName, content: record.buffer }));

  try {
    await send({ applicationId, fullName, attachments });
  } catch (err) {
    console.error(`${LOG_PREFIX} Failed to send ${recipientLabel} package email for application ${applicationId}:`, err);
    return;
  }

  try {
    await db.generatedPDF.update({
      where: { id: packageRecord.pdf.id },
      data: { [sentField]: true },
    });
  } catch (err) {
    console.error(
      `${LOG_PREFIX} Sent ${recipientLabel} package email but failed to flag ${sentField} on GeneratedPDF ${packageRecord.pdf.id}:`,
      err
    );
  }
}
