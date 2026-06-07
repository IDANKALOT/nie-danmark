import type { Application } from "@prisma/client";
import { formatDate } from "@/lib/utils";

/**
 * Maps a Prisma `Application` record to a flat, string-keyed record of
 * form-field values suitable for rendering into a PDF.
 *
 * This is the single shared data source for ALL generated PDFs (EX-18 prep
 * document, receipt, case overview, notary/lawyer packages) — not just the
 * EX-18 form — so values are kept simple, pre-formatted strings (Danish date
 * format, combined address lines, etc.) that any PDF generator can drop
 * straight onto the page without further transformation.
 */
export function mapApplicationToEx18Fields(application: Application): Record<string, string> {
  const fullAddress = [application.address, `${application.postalCode} ${application.city}`, application.country]
    .filter((part) => part && part.trim().length > 0)
    .join(", ");

  return {
    applicationId: application.id,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    dateOfBirth: formatDate(application.dateOfBirth),
    passportNumber: application.passportNumber,
    address: application.address,
    city: application.city,
    postalCode: application.postalCode,
    country: application.country,
    fullAddress,
    createdAt: formatDate(application.createdAt),
    submittedAt: formatDate(application.createdAt),
    amount: formatAmount(application.amount, application.currency),
    currency: application.currency,
  };
}

function formatAmount(amount: number | null, currency: string): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
