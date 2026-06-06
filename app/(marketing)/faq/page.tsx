import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ – Ofte stillede spørgsmål om NIE-nummer",
  description: "Svar på de mest stillede spørgsmål om spansk NIE-nummer, ansøgningsprocessen og vores service.",
};

const faqCategories = [
  {
    title: "Om NIE-nummeret",
    faqs: [
      { q: "Hvad er et NIE-nummer?", a: "NIE (Número de Identificación de Extranjero) er et spansk identifikationsnummer for udlændinge. Det er nødvendigt for at købe ejendom, åbne bankkonto, arbejde lovligt og betale skat i Spanien." },
      { q: "Hvem har brug for et NIE-nummer?", a: "Alle udlændinge der ønsker at købe fast ejendom, arbejde, studere eller etablere sig i Spanien har brug for et NIE-nummer." },
      { q: "Udløber et NIE-nummer?", a: "Selve NIE-nummeret udløber aldrig. Det er livslangt." },
      { q: "Kan jeg bruge mit NIE-nummer til alt i Spanien?", a: "Ja, dit NIE-nummer bruges til alle officielle formål i Spanien - køb af ejendom, skat, bank, arbejde og meget mere." },
    ],
  },
  {
    title: "Om ansøgningsprocessen",
    faqs: [
      { q: "Hvor lang tid tager det?", a: "Den typiske behandlingstid er 2-4 uger fra vi modtager din færdige ansøgning med alle dokumenter." },
      { q: "Skal jeg rejse til Spanien?", a: "Nej! Vi håndterer processen via vores samarbejdspartnere i Spanien. Du behøver ikke rejse til Spanien." },
      { q: "Hvilke dokumenter skal jeg bruge?", a: "Du skal bruge et gyldigt pas og et adressebevis. Vi vejleder dig gennem processen." },
      { q: "Kan jeg følge min sags status?", a: "Ja! Du har adgang til et personligt login-område med realtidsopdateringer." },
    ],
  },
  {
    title: "Betaling og sikkerhed",
    faqs: [
      { q: "Hvad koster det?", a: "Vores service koster 210 EUR inkl. alt. Ingen skjulte gebyrer." },
      { q: "Hvilke betalingsmetoder accepterer I?", a: "Vi accepterer alle større kredit- og debetkort via Stripe." },
      { q: "Er min betaling sikker?", a: "Ja. Alle betalinger håndteres af Stripe med fuld kryptering." },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[#0f172a] pt-32 pb-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">Ofte stillede spørgsmål</h1>
          <p className="text-xl text-slate-300">Find svar på alle dine spørgsmål om NIE-nummer og vores service</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-16">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-8 pb-4 border-b border-slate-200">{category.title}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <details key={faq.q} className="group border border-slate-200 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                      <span className="font-semibold text-[#0f172a] pr-4">{faq.q}</span>
                      <span className="text-[#d4af37] flex-shrink-0 text-xl">+</span>
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Fandt du ikke svaret?</h2>
          <div className="flex gap-4 justify-center">
            <Link href="/kontakt" className="bg-[#0f172a] text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors">Kontakt os</Link>
            <Link href="/ansogning" className="bg-[#d4af37] text-[#0f172a] px-8 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition-colors">Start ansøgning</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
