import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handelsbetingelser – NIE Danmark",
  description: "Læs vores handelsbetingelser for brug af NIE Danmarks service.",
};

export default function HandelsbetingelserPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f172a] pt-32 pb-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Handelsbetingelser</h1>
          <p className="text-slate-300">Sidst opdateret: 1. januar 2025</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate max-w-none">
          <h2>1. Om NIE Danmark</h2>
          <p>NIE Danmark er en servicevirksomhed der hjælper danskere med at ansøge om spansk NIE-nummer i samarbejde med autoriserede spanske notarer og advokater.</p>

          <h2>2. Tjenestens omfang</h2>
          <p>Vores service omfatter:</p>
          <ul>
            <li>Modtagelse og kontrol af din ansøgning og dokumenter</li>
            <li>Videresendelse til spanske samarbejdspartnere</li>
            <li>Opfølgning på processen</li>
            <li>Statusopdateringer via online portal</li>
            <li>Dansk kundesupport</li>
          </ul>

          <h2>3. Pris og betaling</h2>
          <p>Vores service koster 210 EUR inkl. moms. Prisen dækker al assistance i processen. Der opkræves ingen yderligere gebyrer.</p>
          <p>Betaling sker sikkert via Stripe. Vi accepterer Visa, Mastercard og American Express.</p>

          <h2>4. Behandlingstid</h2>
          <p>Den forventede behandlingstid er 2-4 uger fra vi har modtaget alle nødvendige dokumenter. Vi er ikke ansvarlige for forsinkelser der skyldes spanske myndigheders sagsbehandlingstid.</p>

          <h2>5. Fortrydelsesret</h2>
          <p>Du har 14 dages fortrydelsesret fra købsdatoen. Fortrydelsesretten bortfalder, hvis vi har påbegyndt behandlingen af din sag med dit samtykke.</p>

          <h2>6. Ansvarsfraskrivelse</h2>
          <p>NIE Danmark er ikke en juridisk virksomhed og yder ikke juridisk rådgivning. Vi formidler kontakten til autoriserede spanske juridiske fagfolk. Endelig afgørelse træffes af spanske myndigheder.</p>

          <h2>7. Garanti</h2>
          <p>Hvis din ansøgning afvises af årsager der kan tilskrives vores fejl, vil vi genbehandle sagen uden ekstra omkostninger.</p>

          <h2>8. Tvister</h2>
          <p>Tvister afgøres efter dansk ret med Retten i Aarhus som værneting.</p>

          <h2>9. Kontakt</h2>
          <p>NIE Danmark · Email: info@nie-danmark.dk · Tlf: +45 XX XX XX XX</p>
        </div>
      </section>
    </main>
  );
}
