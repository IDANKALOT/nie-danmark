import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageCircle, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt – NIE Danmark",
  description:
    "Kontakt NIE Danmark for spørgsmål om dit spanske NIE-nummer. Vi svarer inden for 1 arbejdsdag. Ring, skriv eller besøg os.",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "E-mail",
    value: "hej@nie-danmark.dk",
    href: "mailto:hej@nie-danmark.dk",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+45 70 60 50 40",
    href: "tel:+4570605040",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Vesterbrogade 100, 1620 København V",
    href: "https://maps.google.com",
  },
  {
    icon: Clock,
    label: "Åbningstider",
    value: "Mandag–Fredag: 09:00–17:00",
    href: null,
  },
];

const FAQS = [
  {
    q: "Hvor lang tid tager det at få svar?",
    a: "Vi svarer på alle henvendelser inden for 1 arbejdsdag – typisk langt hurtigere.",
  },
  {
    q: "Kan jeg ringe til jer?",
    a: "Ja, vores telefonsupport er åben mandag til fredag kl. 09:00–17:00.",
  },
  {
    q: "Hvad hvis jeg allerede er kunde?",
    a: "Eksisterende kunder opfordres til at bruge beskedfunktionen i kundeportalen for hurtigere svar.",
  },
];

export default function KontaktPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="pt-32 pb-20 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #112163 60%, #0f172a 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-8"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)" }}
          >
            <MessageCircle size={14} style={{ color: "#d4af37" }} />
            <span style={{ color: "#d4af37" }}>Vi svarer inden for 1 arbejdsdag</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Kontakt os
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Har du spørgsmål om NIE-nummeret, ansøgningsprocessen eller vores
            service? Vi er her for at hjælpe.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact form */}
          <div className="lg:col-span-3">
            <div
              className="bg-white rounded-3xl p-8"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Send os en besked
              </h2>
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                      Navn *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Anders Jensen"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="din@email.dk"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Emne *
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
                    style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#0f172a" }}
                  >
                    <option value="">Vælg emne...</option>
                    <option value="general">Generelt spørgsmål</option>
                    <option value="application">Om ansøgningen</option>
                    <option value="documents">Dokumenter</option>
                    <option value="payment">Betaling</option>
                    <option value="status">Status på sag</option>
                    <option value="other">Andet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Besked *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Beskriv dit spørgsmål eller din henvendelse..."
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all"
                    style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                  />
                </div>

                <div
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                >
                  <Clock size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
                  <p className="text-sm" style={{ color: "#15803d" }}>
                    Vi svarer på alle henvendelser inden for <strong>1 arbejdsdag</strong>.
                    Eksisterende kunder opfordres til at bruge beskedfunktionen i
                    kundeportalen.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-base font-bold transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #f0c830)",
                    color: "#0f172a",
                    boxShadow: "0 4px 16px rgba(212,175,55,0.35)",
                  }}
                >
                  Send besked →
                </button>
              </form>
            </div>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Contact cards */}
            {CONTACT_INFO.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-5"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#0f172a" }}
                  >
                    <item.icon size={18} style={{ color: "#d4af37" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-semibold text-slate-900 hover:text-[#d4af37] transition-colors no-underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Google Maps placeholder */}
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-full h-44 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #e2e8f0, #f1f5f9)" }}
              >
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2" style={{ color: "#94a3b8" }} />
                  <p className="text-sm font-medium text-slate-500">
                    Vesterbrogade 100
                  </p>
                  <p className="text-xs text-slate-400">1620 København V</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="https://maps.google.com/?q=Vesterbrogade+100,+1620+København+V"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold flex items-center gap-1.5 transition-colors"
                  style={{ color: "#d4af37" }}
                >
                  Åbn i Google Maps <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Ofte stillede spørgsmål
            </h2>
            <p className="text-slate-500">
              Find hurtige svar på de mest almindelige spørgsmål.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: "#0f172a",
                color: "#d4af37",
              }}
            >
              Se alle spørgsmål <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
