import type { Metadata } from "next";
import { ApplicationForm } from "@/components/forms/application-form";

export const metadata: Metadata = {
  title: "Ansøg om NIE-nummer",
  description:
    "Start din ansøgning om spansk NIE-nummer. Udfyld vores sikre online formular og lad os hjælpe dig igennem processen.",
};

export default function AnsogningPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Decorative background mesh */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, #d4af3722 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, #d4af3711 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, #1e3aab18 0%, transparent 70%)
          `,
        }}
      />

      {/* Fine grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-8 pb-4 px-4 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-3 mb-8 group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af3740]">
              <span className="text-[#0f172a] font-black text-sm">NIE</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              NIE{" "}
              <span className="text-[#d4af37]">Danmark</span>
            </span>
          </a>

          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#d4af3715] border border-[#d4af3730] rounded-full px-4 py-1.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase">
                Sikker online ansøgning
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Ansøg om{" "}
              <span className="text-gradient-gold">NIE-nummer</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Udfyld formularen nedenfor, og vores team hjælper dig med at få
              dit spanske NIE-nummer hurtigt og professionelt.
            </p>
          </div>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-4">
          <div className="w-full max-w-2xl">
            <ApplicationForm />
          </div>
        </div>

        {/* Trust indicators */}
        <footer className="pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6 text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#d4af37]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>SSL-krypteret</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#d4af37]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>GDPR-sikker</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#d4af37]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
                <span>Betaling via Stripe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#d4af37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>+500 tilfredse kunder</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
