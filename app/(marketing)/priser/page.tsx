import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Priser – 210 EUR alt inklusiv",
  description: "En enkel pris uden skjulte gebyrer. Få dit spanske NIE-nummer for 210 EUR med fuld professionel assistance.",
};

const included = [
  "Online ansøgningsformular",
  "Dokumentkontrol og verifikation",
  "Kontakt til spansk notar",
  "Kontakt til spansk advokat",
  "Real-time statusopdateringer",
  "Dansk kundesupport",
  "Sikker dokumentopbevaring",
  "Ubegrænsede dokumentuploads",
  "Beskedsystem",
  "Fuld garanti ved afslag",
];

const faqs = [
  {
    q: "Er der nogen skjulte gebyrer?",
    a: "Nej. 210 EUR er den endelige pris. Alt er inkluderet – notar, advokat og vores service.",
  },
  {
    q: "Hvad sker der, hvis ansøgningen afvises?",
    a: "I de sjældne tilfælde af afvisning genbehandler vi sagen uden ekstra omkostninger.",
  },
  {
    q: "Hvornår betaler jeg?",
    a: "Du betaler efter du har udfyldt formularen og uploadet dine dokumenter. Ingen betaling uden du er klar.",
  },
  {
    q: "Kan jeg betale med kreditkort?",
    a: "Ja, vi accepterer alle større kreditkort og debetkort via Stripe.",
  },
];

export default function PriserPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0f172a] pt-32 pb-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-8">
            <span className="text-[#d4af37]">✓</span>
            <span>Ingen skjulte gebyrer – garanti</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Enkel og gennemsigtig pris</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Én pris. Alt inkluderet. Ingen overraskelser.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-[#0f172a] p-8 text-center text-white">
              <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Alt inklusiv pakke</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-6xl font-bold">210</span>
                <span className="text-2xl text-slate-300">EUR</span>
              </div>
              <p className="text-slate-400 text-sm">Engangsbetaling · Ingen abonnement</p>
            </div>
            <div className="p-8">
              <h3 className="font-semibold text-slate-700 mb-6">Hvad er inkluderet:</h3>
              <ul className="space-y-3 mb-8">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/ansogning"
                className="block w-full bg-[#d4af37] text-[#0f172a] font-bold py-4 rounded-xl text-center text-lg hover:bg-yellow-400 transition-colors"
              >
                Start ansøgning →
              </Link>
              <p className="text-center text-sm text-slate-500 mt-4">
                Sikker betaling via Stripe · SSL krypteret
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#0f172a] text-center mb-12">
            Spørgsmål om priser
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-[#0f172a] mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
