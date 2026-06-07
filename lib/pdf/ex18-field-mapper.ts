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

/**
 * Maps an `Application` record onto the official EX-18 PDF's AcroForm field
 * names (the Spanish Ministerio del Interior template at
 * `lib/pdf/templates/ex18-official.pdf`).
 *
 * The official form collects far more than NIE Danmark gathers at checkout
 * (place/country of birth, nationality, marital status, parents' names,
 * Spanish domicile, legal representatives, etc.) — those fields are left for
 * the case team / notary / lawyer to complete from documents gathered later.
 * Only the values we can map with confidence are pre-filled here, as a head
 * start that — like the other generated documents — should still be verified
 * against the applicant's passport before submission.
 */
export function mapApplicationToOfficialEx18Fields(application: Application): Record<string, string> {
  const [givenName = "", firstSurname = "", ...restSurname] = application.fullName.trim().split(/\s+/);
  const dob = application.dateOfBirth;

  const fields: Record<string, string> = {
    Nombre: givenName,
    "1er Apellido": firstSurname,
    "2 Apellido": restSurname.join(" "),
    PASAPORTE: application.passportNumber,
    Dia_Nacimiento: String(dob.getUTCDate()).padStart(2, "0"),
    Mes_Nacimiento: String(dob.getUTCMonth() + 1).padStart(2, "0"),
    Año_Nacimiento: String(dob.getUTCFullYear()),
    "Teléfono móvil": application.phone,
    email: application.email,
  };

  // Only fill the Spanish-domicile fields when the applicant has told us they
  // already live in Spain — otherwise the address on file is their pre-move
  // address abroad, and would be actively wrong on this specific form.
  if (application.country === "Spanien") {
    fields["Domicilio en España"] = application.address;
    fields["Localidad"] = application.city;
    fields["CP"] = application.postalCode;
  }

  return fields;
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
