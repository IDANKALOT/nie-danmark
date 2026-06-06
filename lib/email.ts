import nodemailer from "nodemailer";
import type { ApplicationStatus } from "@prisma/client";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "NIE Danmark <noreply@nie-danmark.dk>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@nie-danmark.dk";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

const BRAND_COLORS = {
  navy: "#0f172a",
  gold: "#d4af37",
  white: "#ffffff",
  lightGray: "#f8fafc",
  textGray: "#475569",
};

function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f1f5f9;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: ${BRAND_COLORS.white};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: ${BRAND_COLORS.navy};
      padding: 36px 40px;
      text-align: center;
    }
    .logo-text {
      color: ${BRAND_COLORS.gold};
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .logo-sub {
      color: rgba(255,255,255,0.7);
      font-size: 13px;
      margin-top: 4px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .gold-bar {
      height: 4px;
      background: linear-gradient(90deg, ${BRAND_COLORS.gold}, #f0d060, ${BRAND_COLORS.gold});
    }
    .content {
      padding: 40px;
    }
    h1 {
      color: ${BRAND_COLORS.navy};
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    p {
      color: ${BRAND_COLORS.textGray};
      font-size: 15px;
      line-height: 1.7;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-block;
      background: ${BRAND_COLORS.gold};
      color: ${BRAND_COLORS.navy} !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 15px;
      margin: 20px 0;
    }
    .info-box {
      background: ${BRAND_COLORS.lightGray};
      border-left: 4px solid ${BRAND_COLORS.gold};
      border-radius: 0 8px 8px 0;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin-bottom: 0;
    }
    .status-badge {
      display: inline-block;
      background: ${BRAND_COLORS.navy};
      color: ${BRAND_COLORS.gold};
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 28px 0;
    }
    .footer {
      background: ${BRAND_COLORS.lightGray};
      padding: 28px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .footer a {
      color: ${BRAND_COLORS.gold};
      text-decoration: none;
    }
    .checklist {
      list-style: none;
      padding: 0;
      margin: 16px 0;
    }
    .checklist li {
      color: ${BRAND_COLORS.textGray};
      font-size: 15px;
      line-height: 1.7;
      padding: 4px 0;
      padding-left: 24px;
      position: relative;
    }
    .checklist li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: ${BRAND_COLORS.gold};
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-text">NIE Danmark</div>
      <div class="logo-sub">Spansk NIE Nummer Service</div>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>NIE Danmark &bull; Hjælp til spansk NIE-nummer</p>
      <p><a href="${APP_URL}">nie-danmark.dk</a> &bull; <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></p>
      <p style="margin-top: 8px;">Du modtager denne e-mail, fordi du har oprettet en konto hos NIE Danmark.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const firstName = name.split(" ")[0];
  const content = `
    <h1>Velkommen til NIE Danmark, ${firstName}!</h1>
    <p>Vi er glade for, at du har valgt os til at hjælpe dig med dit spanske NIE-nummer. Din konto er nu oprettet og klar til brug.</p>
    <div class="info-box">
      <p><strong>Hvad er et NIE-nummer?</strong><br/>
      NIE (Número de Identidad de Extranjero) er et spansk identifikationsnummer, som er obligatorisk for alle udlændinge, der ønsker at arbejde, købe ejendom eller åbne bankkonto i Spanien.</p>
    </div>
    <p>Her er, hvad vi tilbyder:</p>
    <ul class="checklist">
      <li>Personlig vejledning gennem hele ansøgningsprocessen</li>
      <li>Dokumentforberedelse og kontrol</li>
      <li>Koordinering med spanske myndigheder</li>
      <li>Juridisk bistand fra erfarne advokater</li>
      <li>Løbende opdateringer om din ansøgning</li>
    </ul>
    <p>Start din ansøgning i dag og bliv klar til dit liv i Spanien!</p>
    <a href="${APP_URL}/dashboard" class="btn">Gå til dit dashboard</a>
    <hr class="divider" />
    <p>Har du spørgsmål? Skriv til os på <a href="mailto:${ADMIN_EMAIL}" style="color: ${BRAND_COLORS.gold};">${ADMIN_EMAIL}</a> eller brug chat-funktionen i dit dashboard.</p>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "Velkommen til NIE Danmark - Din konto er oprettet",
    html: baseTemplate(content, "Velkommen til NIE Danmark"),
  });
}

export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  applicationId: string
): Promise<void> {
  const firstName = name.split(" ")[0];
  const content = `
    <h1>Betaling bekræftet, ${firstName}!</h1>
    <p>Vi har modtaget din betaling på <strong>210 EUR</strong> for NIE-ansøgningen. Din ansøgning er nu officielt i gang!</p>
    <div class="info-box">
      <p><strong>Ansøgnings-ID:</strong> <code>${applicationId}</code></p>
      <p style="margin-top: 8px;"><strong>Beløb:</strong> 210,00 EUR</p>
      <p style="margin-top: 8px;"><strong>Status:</strong> <span class="status-badge">Under behandling</span></p>
    </div>
    <p>Vores team er nu gået i gang med din sag. Her er de næste skridt:</p>
    <ul class="checklist">
      <li>Vi gennemgår dine indsendte dokumenter</li>
      <li>Vi kontakter dig, hvis vi mangler yderligere dokumentation</li>
      <li>Vi koordinerer med notaren og den spanske konsulat</li>
      <li>Du modtager løbende statusopdateringer via e-mail</li>
    </ul>
    <p>Du kan til enhver tid følge din ansøgnings status i dit dashboard.</p>
    <a href="${APP_URL}/dashboard/applications/${applicationId}" class="btn">Se din ansøgning</a>
    <hr class="divider" />
    <p>Gem venligst dette ansøgnings-ID til fremtidig reference: <strong>${applicationId}</strong></p>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "Betaling bekræftet - NIE ansøgning #" + applicationId,
    html: baseTemplate(content, "Betaling bekræftet"),
  });
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

export async function sendApplicationUpdateEmail(
  to: string,
  name: string,
  status: ApplicationStatus,
  note?: string
): Promise<void> {
  const firstName = name.split(" ")[0];
  const statusLabel = STATUS_LABELS_DA[status];

  const noteSection = note
    ? `<div class="info-box"><p><strong>Besked fra vores team:</strong><br/>${note}</p></div>`
    : "";

  const isCompleted = status === "COMPLETED";
  const isCancelled = status === "CANCELLED";
  const isAwaitingClient = status === "AWAITING_CLIENT";

  let extraContent = "";
  if (isCompleted) {
    extraContent = `
      <p>Tillykke! Dit NIE-nummer er nu klar. Du vil modtage en separat e-mail med dine NIE-dokumenter. Du kan også downloade dem direkte fra dit dashboard.</p>
      <a href="${APP_URL}/dashboard" class="btn">Download dine dokumenter</a>
    `;
  } else if (isAwaitingClient) {
    extraContent = `
      <p>Vi har brug for yderligere information eller dokumenter fra dig for at fortsætte med din ansøgning. Log venligst ind på dit dashboard og tjek beskeden fra vores team.</p>
      <a href="${APP_URL}/dashboard" class="btn">Svar nu</a>
    `;
  } else if (isCancelled) {
    extraContent = `
      <p>Din ansøgning er desværre blevet annulleret. Kontakt os venligst, hvis du mener dette er en fejl, eller hvis du ønsker at starte en ny ansøgning.</p>
    `;
  } else {
    extraContent = `<a href="${APP_URL}/dashboard" class="btn">Se statusopdatering</a>`;
  }

  const content = `
    <h1>Statusopdatering på din ansøgning</h1>
    <p>Kære ${firstName},</p>
    <p>Din NIE-ansøgning har fået en ny status:</p>
    <p><span class="status-badge">${statusLabel}</span></p>
    ${noteSection}
    ${extraContent}
    <hr class="divider" />
    <p>Har du spørgsmål? Kontakt os via dit dashboard eller skriv til <a href="mailto:${ADMIN_EMAIL}" style="color: ${BRAND_COLORS.gold};">${ADMIN_EMAIL}</a>.</p>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: `Statusopdatering: ${statusLabel} - NIE Danmark`,
    html: baseTemplate(content, "Statusopdatering"),
  });
}

export async function sendDocumentRequestEmail(
  to: string,
  name: string,
  applicationId: string
): Promise<void> {
  const firstName = name.split(" ")[0];
  const content = `
    <h1>Vi mangler dokumenter, ${firstName}</h1>
    <p>For at behandle din NIE-ansøgning har vi brug for, at du uploader yderligere dokumenter. Din ansøgning er sat på pause, indtil vi modtager de nødvendige filer.</p>
    <div class="info-box">
      <p><strong>Hvad skal du uploade?</strong><br/>
      Log ind på dit dashboard og tjek beskeden fra vores team for en specificeret liste over de nødvendige dokumenter.</p>
    </div>
    <p>Typiske dokumenter der kræves:</p>
    <ul class="checklist">
      <li>Gyldigt pas (alle relevante sider)</li>
      <li>Bevis for bopæl (f.eks. folkeregisterattest)</li>
      <li>Formular EX-15 (udfyldt og underskrevet)</li>
      <li>NIE ansøgningsbrev</li>
    </ul>
    <p>Jo hurtigere du uploader dokumenterne, jo hurtigere kan vi behandle din ansøgning.</p>
    <a href="${APP_URL}/dashboard/applications/${applicationId}/documents" class="btn">Upload dokumenter nu</a>
    <hr class="divider" />
    <p>Har du spørgsmål om, hvilke dokumenter der kræves? Skriv til os via dit dashboard.</p>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "Handling påkrævet: Upload dokumenter - NIE Danmark",
    html: baseTemplate(content, "Dokumenter påkrævet"),
  });
}

export async function sendApplicationCompletedEmail(
  to: string,
  name: string
): Promise<void> {
  const firstName = name.split(" ")[0];
  const content = `
    <h1>Tillykke, ${firstName}! Dit NIE er klar!</h1>
    <p>Vi er glade for at kunne meddele, at din NIE-ansøgning er færdigbehandlet. Dit spanske NIE-nummer er nu officielt registreret!</p>
    <div class="info-box">
      <p><strong>Hvad kan du nu?</strong><br/>
      Med dit NIE-nummer kan du nu åbne en spansk bankkonto, købe ejendom i Spanien, registrere en bil og meget mere.</p>
    </div>
    <p>Dine NIE-dokumenter er tilgængelige i dit dashboard:</p>
    <ul class="checklist">
      <li>NIE-certifikat (officielt dokument)</li>
      <li>Kopi af indsendte dokumenter</li>
      <li>Bekræftelsesdokumenter fra spanske myndigheder</li>
    </ul>
    <p>Vi anbefaler, at du gemmer dine dokumenter på et sikkert sted og laver sikkerhedskopier.</p>
    <a href="${APP_URL}/dashboard" class="btn">Download dine dokumenter</a>
    <hr class="divider" />
    <p>Tak fordi du valgte NIE Danmark. Vi ønsker dig alt det bedste i Spanien! Anbefal os gerne til andre danskere, der har brug for NIE-hjælp.</p>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "Dit NIE-nummer er klar! - NIE Danmark",
    html: baseTemplate(content, "NIE Nummer Klar"),
  });
}

interface ApplicationData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  country: string;
  createdAt: Date | string;
}

export async function sendAdminNotificationEmail(
  applicationData: ApplicationData
): Promise<void> {
  const createdAt =
    applicationData.createdAt instanceof Date
      ? applicationData.createdAt.toLocaleString("da-DK")
      : new Date(applicationData.createdAt).toLocaleString("da-DK");

  const content = `
    <h1>Ny NIE-ansøgning modtaget</h1>
    <p>En ny ansøgning er blevet indsendt og afventer behandling.</p>
    <div class="info-box">
      <p><strong>Ansøgnings-ID:</strong> ${applicationData.id}</p>
      <p style="margin-top: 8px;"><strong>Fulde navn:</strong> ${applicationData.fullName}</p>
      <p style="margin-top: 8px;"><strong>E-mail:</strong> ${applicationData.email}</p>
      <p style="margin-top: 8px;"><strong>Telefon:</strong> ${applicationData.phone}</p>
      <p style="margin-top: 8px;"><strong>Pas-nummer:</strong> ${applicationData.passportNumber}</p>
      <p style="margin-top: 8px;"><strong>Land:</strong> ${applicationData.country}</p>
      <p style="margin-top: 8px;"><strong>Indsendt:</strong> ${createdAt}</p>
    </div>
    <p>Log ind på admin-dashboardet for at behandle ansøgningen.</p>
    <a href="${APP_URL}/admin/applications/${applicationData.id}" class="btn">Se ansøgning i admin</a>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: ADMIN_EMAIL,
    subject: `Ny NIE-ansøgning: ${applicationData.fullName} - ${applicationData.id}`,
    html: baseTemplate(content, "Ny NIE-ansøgning"),
  });
}
