import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  Upload,
  CreditCard,
  Building2,
  CheckCircle2,
  FileText,
  ArrowRight,
  Clock,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hvordan det virker – NIE Danmark",
  description:
    "Trin-for-trin guide til at ansøge om dit spanske NIE-nummer med NIE Danmark. Ingen rejse til Spanien nødvendig. 2-4 ugers behandlingstid.",
};

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Udfyld ansøgningsformularen",
    description:
      "Start med at udfylde vores enkle online ansøgningsformular. Det tager typisk 10-15 minutter. Du skal blot angive dine personoplysninger: navn, fødselsdato, adresse, pasnummer og formål med NIE-nummeret.",
    details: [
      "Personoplysninger og kontaktinfo",
      "Formål med NIE-nummeret (ejendomskøb, arbejde, etc.)",
      "Præferenceangivelse for behandlingshastighed",
    ],
    duration: "10-15 min",
    color: "#3b82f6",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload dine dokumenter",
    description:
      "Upload et gyldigt pas og et adressebevis direkte i systemet. Vores team gennemgår dokumenterne og kontakter dig, hvis noget mangler eller skal uddybes.",
    details: [
      "Gyldigt pas (foto-side og underskrift)",
      "Adressebevis maks. 3 måneder gammelt (bankudskrift, forsyningsregning)",
      "Eventuelle supplerende dokumenter ved behov",
    ],
    duration: "5 min",
    color: "#8b5cf6",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Betal sikkert online",
    description:
      "Betal vores faste servicegebyr på 210 EUR via Stripe. Betalingen er krypteret og sikker. Du betaler kun én gang – ingen skjulte gebyrer.",
    details: [
      "210 EUR – alt inkluderet",
      "Kredit- og debetkort accepteret",
      "Sikker Stripe-betaling",
      "Kvittering sendes straks til din e-mail",
    ],
    duration: "2 min",
    color: "#d4af37",
  },
  {
    number: "04",
    icon: Building2,
    title: "Vi håndterer Spanien",
    description:
      "Vores erfarne spanske partnere indsender din ansøgning hos de spanske myndigheder. Du kan følge din sags status i realtid via kundeportalen og modtage beskeder direkte fra vores team.",
    details: [
      "Ansøgning indsendes til spansk notar",
      "Videre behandling hos spansk advokat",
      "Fuld statusopdatering i kundeportalen",
      "Direkte beskedkanal med vores team",
    ],
    duration: "2-4 uger",
    color: "#0f172a",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Modtag dit NIE-nummer",
    description:
      "Når dit NIE-nummer er godkendt, modtager du det pr. e-mail og i din kundeportal. Dit NIE-nummer er livslangt og udløber aldrig.",
    details: [
      "NIE-nummer leveret elektronisk",
      "Dokumentation tilgængelig i kundeportalen",
      "Livslang gyldighed – udløber aldrig",
      "Support til eventuelle opfølgende spørgsmål",
    ],
    duration: "Færdig!",
    color: "#16a34a",
  },
];

const DOCUMENTS = [
  {
    title: "Gyldigt pas",
    description:
      "Et gyldigt dansk pas (eller anden nationalitet). Passet skal være gyldigt i mindst 6 måneder. Vi skal bruge en klar scanning af forsiden med foto og personoplysninger.",
    required: true,
    icon: FileText,
  },
  {
    title: "Adressebevis",
    description:
      "Et officielt dokument, der bekræfter din nuværende adresse. Eksempler: bankudskrift, forsyningsregning, brev fra offentlig myndighed. Dokumentet må maksimalt være 3 måneder gammelt.",
    required: true,
    icon: FileText,
  },
  {
    title: "Supplerende dokumenter",
    description:
      "Afhængigt af formålet med dit NIE-nummer kan vi i sjældne tilfælde bede om yderligere dokumentation, fx ejendomskontrakt eller ansættelsesbevis.",
    required: false,
    icon: FileText,
  },
];

const FAQS = [
  {
    q: "Skal jeg rejse til Spanien for at ansøge?",
    a: "Nej – det er det smarte ved vores service. Vi håndterer hele processen via vores spanske partnere. Du behøver aldrig sætte din fod i Spanien for at få dit NIE-nummer.",
  },
  {
    q: "Hvor lang tid tager det?",
    a: "Den typiske behandlingstid er 2-4 uger fra vi modtager din færdige ansøgning med alle dokumenter. I spidsbelastningsperioder kan det tage op til 6 uger.",
  },
  {
    q: "Kan jeg ansøge, selvom jeg bor uden for Danmark?",
    a: "Ja, vores service er tilgængelig for alle danskere, uanset om du bor i Danmark, Sverige, Spanien eller andetsteds i verden.",
  },
  {
    q: "Hvad sker der, hvis min ansøgning afvises?",
    a: "Afvisningsraten er under 2% med vores service. Afvises din ansøgning, genbehandler vi den uden ekstra omkostninger og undersøger årsagen.",
  },
  {
    q: "Er mine personoplysninger sikre?",
    a: "Ja. Alle data er krypteret og opbevares i overensstemmelse med GDPR og dansk databeskyttelseslovgivning. Vi deler aldrig dine data med tredjepart uden din tilladelse.",
  },
  {
    q: "Kan jeg bruge mit NIE-nummer til køb af ejendom?",
    a: "Ja, NIE-nummeret er et krav for ejendomskøb i Spanien og kan bruges til alle officielle formål: ejendomskøb, bankkonto, skat, arbejde, studier og meget mere.",
  },
];

export default function HvordanDetVirkerPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="pt-32 pb-24 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #112163 60%, #0f172a 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-8"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)" }}
          >
            <Clock size={14} style={{ color: "#d4af37" }} />
            <span style={{ color: "#d4af37" }}>Klar på 2-4 uger</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight leading-tight">
            Sådan får du dit NIE-nummer
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            En simpel 5-trins proces. Ingen rejse til Spanien. Ingen spansk nødvendig.
            Vi klarer alt det komplicerede.
          </p>
        </div>
      </section>

      {/* Steps timeline */}
      <section className="py-20 px-6" style={{ background: "#f8fafc" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-14 tracking-tight">
            Trinvis guide
          </h2>

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => {
              const isLast = i === STEPS.length - 1;
              return (
                <div key={step.number} className="relative flex gap-6 lg:gap-10">
                  {/* Connector + icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-black"
                      style={{
                        background: "#0f172a",
                        boxShadow: "0 4px 16px rgba(15,23,42,0.2)",
                        color: "#d4af37",
                      }}
                    >
                      {step.number}
                    </div>
                    {!isLast && (
                      <div
                        className="flex-1 w-0.5 my-2"
                        style={{ background: "linear-gradient(180deg, #d4af37, rgba(212,175,55,0.2))", minHeight: 32 }}
                      />
                    )}
                  </div>

                  {/* Content card */}
                  <div
                    className="flex-1 bg-white rounded-2xl p-6 lg:p-8 mb-6"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${step.color}15` }}
                        >
                          <step.icon size={18} style={{ color: step.color }} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {step.title}
                        </h3>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: "#f0fdf4", color: "#16a34a" }}
                      >
                        <Clock size={11} />
                        {step.duration}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                      {step.description}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle2 size={14} style={{ color: "#d4af37", flexShrink: 0 }} />
                          <span className="text-slate-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documents needed */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Dokumenter du skal bruge
            </h2>
            <p className="text-slate-500">
              Vi holder det enkelt. Du skal kun bruge 2 dokumenter for at komme i gang.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DOCUMENTS.map((doc) => (
              <div
                key={doc.title}
                className="p-6 rounded-2xl"
                style={{
                  background: "#f8fafc",
                  border: `1px solid ${doc.required ? "#e2e8f0" : "#e2e8f0"}`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: doc.required ? "#0f172a" : "#e2e8f0" }}
                  >
                    <doc.icon
                      size={18}
                      style={{ color: doc.required ? "#d4af37" : "#94a3b8" }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={
                      doc.required
                        ? { background: "#fee2e2", color: "#dc2626" }
                        : { background: "#f1f5f9", color: "#64748b" }
                    }
                  >
                    {doc.required ? "Påkrævet" : "Valgfrit"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {doc.description}
                </p>
              </div>
            ))}
          </div>
          <div
            className="mt-8 flex items-start gap-4 p-5 rounded-2xl"
            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
          >
            <ShieldCheck size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
            <p className="text-sm" style={{ color: "#15803d" }}>
              <strong>Ingen original-dokumenter:</strong> Du uploader blot scans eller
              fotos af dine dokumenter. Du behøver aldrig sende originaler med posten.
              Alt foregår 100% digitalt.
            </p>
          </div>
        </div>
      </section>

      {/* Team strip */}
      <section className="py-14 px-6 bg-white">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              Du er i trygge hænder
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bag din ansøgning står et team af erfarne rådgivere samt autoriserede
              spanske notarer og advokater.
            </p>
          </div>
          <Link
            href="/om-os"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150"
            style={{ background: "#0f172a", color: "#fff" }}
          >
            Mød teamet <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6" style={{ background: "#f8fafc" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6"
              style={{ background: "rgba(15,23,42,0.06)", border: "1px solid rgba(15,23,42,0.1)" }}
            >
              <HelpCircle size={14} style={{ color: "#0f172a" }} />
              <span style={{ color: "#0f172a", fontWeight: 600 }}>Spørgsmål & Svar</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Ofte stillede spørgsmål
            </h2>
            <p className="text-slate-500">
              Vi besvarer de spørgsmål, vi oftest modtager.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)" }}
              >
                <h3 className="text-base font-bold text-slate-900 mb-2.5">
                  {faq.q}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #112163 60%, #0f172a 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-8"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)" }}
          >
            <CheckCircle2 size={14} style={{ color: "#d4af37" }} />
            <span style={{ color: "#d4af37" }}>210 EUR – alt inkluderet</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">
            Klar til at starte din ansøgning?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Det tager kun 15 minutter at komme i gang. Vi klarer resten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ansoeg"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #d4af37, #f0c830)",
                color: "#0f172a",
                boxShadow: "0 4px 16px rgba(212,175,55,0.35)",
              }}
            >
              Start ansøgning nu <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-150 border"
              style={{
                color: "rgba(255,255,255,0.85)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              Stil et spørgsmål
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
