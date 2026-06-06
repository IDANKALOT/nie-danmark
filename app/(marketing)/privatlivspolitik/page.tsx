import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privatlivspolitik – NIE Danmark",
  description: "Læs vores privatlivspolitik og se hvordan vi behandler dine personoplysninger i overensstemmelse med GDPR.",
};

export default function PrivatlivspolitikPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f172a] pt-32 pb-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Privatlivspolitik</h1>
          <p className="text-slate-300">Sidst opdateret: 1. januar 2025</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate max-w-none">
          <h2>1. Dataansvarlig</h2>
          <p>NIE Danmark er dataansvarlig for behandlingen af dine personoplysninger. Du kan kontakte os på: <a href="mailto:info@nie-danmark.dk">info@nie-danmark.dk</a></p>

          <h2>2. Hvilke oplysninger indsamler vi?</h2>
          <p>Vi indsamler følgende kategorier af personoplysninger:</p>
          <ul>
            <li><strong>Identitetsoplysninger:</strong> Fulde navn, fødselsdato, pasnummer</li>
            <li><strong>Kontaktoplysninger:</strong> Email, telefon, adresse</li>
            <li><strong>Betalingsoplysninger:</strong> Håndteres af Stripe – vi ser ikke dit kortnummer</li>
            <li><strong>Dokumenter:</strong> Pas, adressebevis og andre nødvendige dokumenter</li>
          </ul>

          <h2>3. Formål med behandlingen</h2>
          <p>Vi behandler dine oplysninger for at:</p>
          <ul>
            <li>Behandle din NIE-ansøgning</li>
            <li>Videresende nødvendige oplysninger til spanske notarer og advokater</li>
            <li>Kommunikere med dig om din sags status</li>
            <li>Opfylde vores kontraktlige forpligtelser</li>
            <li>Overholde lovmæssige krav</li>
          </ul>

          <h2>4. Retsgrundlag</h2>
          <p>Vi behandler dine oplysninger på følgende retsgrundlag:</p>
          <ul>
            <li><strong>Kontraktopfyldelse (GDPR art. 6(1)(b)):</strong> Til at levere vores service</li>
            <li><strong>Retlig forpligtelse (GDPR art. 6(1)(c)):</strong> Til opfyldelse af lovkrav</li>
            <li><strong>Legitim interesse (GDPR art. 6(1)(f)):</strong> Til forbedring af vores tjenester</li>
          </ul>

          <h2>5. Videregivelse af oplysninger</h2>
          <p>Vi videregiver dine oplysninger til:</p>
          <ul>
            <li>Spanske notarer og advokater (nødvendigt for NIE-processen)</li>
            <li>Stripe (betalingsbehandling)</li>
            <li>Vercel og AWS (hosting og dokumentopbevaring)</li>
          </ul>

          <h2>6. Opbevaring</h2>
          <p>Vi opbevarer dine oplysninger i 5 år efter afslutning af din sag, eller så længe det er påkrævet af lovgivningen. Dokumenter slettes efter 3 år medmindre andet kræves.</p>

          <h2>7. Dine rettigheder</h2>
          <p>Du har ret til at:</p>
          <ul>
            <li>Anmode om indsigt i dine oplysninger</li>
            <li>Anmode om berigtigelse af forkerte oplysninger</li>
            <li>Anmode om sletning ("retten til at blive glemt")</li>
            <li>Anmode om begrænsning af behandlingen</li>
            <li>Gøre indsigelse mod behandlingen</li>
            <li>Anmode om dataportabilitet</li>
          </ul>

          <h2>8. Klage til Datatilsynet</h2>
          <p>Du kan klage til Datatilsynet: <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener">www.datatilsynet.dk</a></p>

          <h2>9. Cookies</h2>
          <p>Vi anvender cookies til at forbedre din oplevelse. Se vores <a href="/cookiepolitik">cookiepolitik</a> for detaljer.</p>

          <h2>10. Kontakt</h2>
          <p>Har du spørgsmål om vores behandling af dine personoplysninger, kan du kontakte os på <a href="mailto:info@nie-danmark.dk">info@nie-danmark.dk</a></p>
        </div>
      </section>
    </main>
  );
}
