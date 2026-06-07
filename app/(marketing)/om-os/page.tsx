import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  BookOpen,
  Zap,
  Eye,
  Globe,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";
import { TeamSection } from "@/components/team/team-section";

export const metadata: Metadata = {
  title: "Om os – NIE Danmark",
  description:
    "Lær NIE Danmark at kende. Vi hjælper danskere med at ansøge om spansk NIE-nummer siden 2021. Professionelt og gennemsigtigt.",
};

const VALUES = [
  {
    icon: Shield,
    title: "Tillid",
    description:
      "Vi håndterer dine personoplysninger og dokumenter med den højeste grad af sikkerhed og fortrolighed. Din data er aldrig til salg.",
  },
  {
    icon: BookOpen,
    title: "Ekspertise",
    description:
      "Vi samarbejder med erfarne spanske notarer og advokater, der kender NIE-processen indgående og sikrer korrekt behandling.",
  },
  {
    icon: Zap,
    title: "Enkelhed",
    description:
      "Vi fjerner al den bureaukratiske kompleksitet, så du kan ansøge om dit NIE-nummer uden at rejse til Spanien eller læse spansk.",
  },
  {
    icon: Eye,
    title: "Gennemsigtighed",
    description:
      "Én fast pris. Ingen skjulte gebyrer. Fuld indsigt i din sags status hele vejen. Vi skjuler ingenting.",
  },
];

const NUMBERS = [
  { value: "3.200+", label: "NIE-numre behandlet" },
  { value: "98%", label: "Succesrate" },
  { value: "2-4 uger", label: "Gennemsnitlig behandlingstid" },
  { value: "4.9/5", label: "Kundebedømmelse" },
];

export default function OmOsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="pt-32 pb-24 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #112163 60%, #0f172a 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-8"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)" }}
          >
            <Globe size={14} style={{ color: "#d4af37" }} />
            <span style={{ color: "#d4af37" }}>Grundlagt i 2021</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Vi gør det nemt at få dit{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, #d4af37, #f0d060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              spanske NIE-nummer
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            NIE Danmark er skabt af og til danskere, der drømmer om at leve, investere
            eller arbejde i Spanien – uden at skulle kæmpe med spansk bureaukrati alene.
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {NUMBERS.map((n) => (
              <div key={n.label} className="text-center">
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: "#0f172a" }}
                >
                  {n.value}
                </p>
                <p className="text-sm text-slate-500">{n.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-20 px-6" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-5 tracking-tight">
                Hvem er vi?
              </h2>
              <div className="flex flex-col gap-4 text-slate-600 leading-relaxed">
                <p>
                  NIE Danmark blev grundlagt i 2021 med en simpel mission: at gøre det
                  let og overskueligt for danskere at ansøge om spansk NIE-nummer – uanset
                  om du køber bolig, planlægger at flytte eller investere i Spanien.
                </p>
                <p>
                  Vi oplevede selv, hvor kompliceret og frustrerende processen kan være.
                  Sprog, papirwork og bureaukrati holder mange danskere tilbage fra at
                  realisere deres spanske drøm. Det ville vi lave om på.
                </p>
                <p>
                  I dag har vi hjulpet over 3.200 danskere med at få deres NIE-nummer.
                  Vi arbejder tæt sammen med erfarne spanske notarer og advokater, der
                  sikrer at din ansøgning er korrekt og behandles hurtigst muligt.
                </p>
              </div>
            </div>
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f172a, #162c87)",
                padding: 48,
                minHeight: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="text-center text-white">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}
                >
                  <Globe size={28} style={{ color: "#0f172a" }} />
                </div>
                <p className="text-5xl font-bold mb-2" style={{ color: "#d4af37" }}>
                  3.200+
                </p>
                <p className="text-white text-lg font-semibold mb-1">
                  Tilfredse kunder
                </p>
                <p className="text-slate-400 text-sm">
                  Fra hele Danmark – og med drømmene rettet mod Spanien
                </p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="#d4af37"
                      style={{ color: "#d4af37" }}
                    />
                  ))}
                  <span className="text-sm text-slate-300 ml-2">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              Vores værdier
            </h2>
            <p className="text-slate-500 text-lg">
              Det vi tror på – og hvad der driver alt vi gør.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="p-7 rounded-2xl transition-all duration-200"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "#0f172a" }}
                >
                  <value.icon size={22} style={{ color: "#d4af37" }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              Mød teamet
            </h2>
            <p className="text-slate-500 text-lg">
              Erfarne fagfolk med passion for at hjælpe danskere.
            </p>
          </div>
          <TeamSection />
        </div>
      </section>

      {/* Spanish partnerships */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6"
                style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)" }}
              >
                <Users size={14} style={{ color: "#d4af37" }} />
                <span style={{ color: "#d4af37" }}>Vores partnere i Spanien</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-5 tracking-tight">
                Stærke partnerskaber i Spanien
              </h2>
              <div className="flex flex-col gap-4 text-slate-600 leading-relaxed">
                <p>
                  Vi har opbygget et netværk af verificerede spanske notarer og advokater
                  med mange års erfaring i NIE-ansøgninger for udenlandske statsborgere.
                </p>
                <p>
                  Vores partnere er licenserede af <strong>Colegio de Notarios</strong> og{" "}
                  <strong>Colegio de Abogados</strong> og arbejder i overensstemmelse med
                  spansk lovgivning og GDPR.
                </p>
                <p>
                  Takket være disse partnerskaber kan vi behandle din ansøgning uden at du
                  behøver at rejse til Spanien eller have kendskab til spansk sprog.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Certificerede Spanske Notarer",
                  description:
                    "Alle notarer er autoriserede af det spanske Justitsministerium og har speciale i udlændingesager.",
                  icon: Shield,
                },
                {
                  title: "Erfarne Spanske Advokater",
                  description:
                    "Vores advokater har mere end 10 års erfaring med NIE-ansøgninger og spansk ejendomsret.",
                  icon: BookOpen,
                },
                {
                  title: "GDPR-compliant Behandling",
                  description:
                    "Alle dokumenter behandles i overensstemmelse med GDPR og den spanske Ley Orgánica de Protección de Datos.",
                  icon: Eye,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-5 rounded-2xl"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#0f172a" }}
                  >
                    <item.icon size={18} style={{ color: "#d4af37" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #112163 60%, #0f172a 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Klar til at komme i gang?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Ansøg om dit NIE-nummer i dag – hurtigt, sikkert og uden besvær.
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
              Start ansøgning <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-150 border"
              style={{
                color: "rgba(255,255,255,0.85)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              Kontakt os
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
