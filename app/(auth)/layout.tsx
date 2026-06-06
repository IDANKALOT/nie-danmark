import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Log ind",
    template: "%s | NIE Danmark",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 15% 85%, rgba(212,175,55,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 15%, rgba(30,58,171,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(15,23,42,0) 0%, transparent 100%)
          `,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-px h-full opacity-10 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent, #d4af37 30%, #d4af37 70%, transparent)",
          right: "30%",
          transform: "rotate(12deg) translateX(200px)",
        }}
      />

      {/* Logo header */}
      <header className="relative z-10 pt-8 pb-4 px-6 flex justify-center">
        <a href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af3740] group-hover:shadow-[#d4af3760] transition-shadow">
            <span className="text-[#0f172a] font-black text-sm tracking-tight">NIE</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg block leading-none">
              NIE <span className="text-[#d4af37]">Danmark</span>
            </span>
            <span className="text-slate-500 text-[10px] uppercase tracking-widest">
              Spansk NIE Service
            </span>
          </div>
        </a>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 px-4 text-center">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-600 text-xs">
          <a href="/privatlivspolitik" className="hover:text-slate-400 transition-colors">
            Privatlivspolitik
          </a>
          <a href="/vilkar" className="hover:text-slate-400 transition-colors">
            Vilkår & betingelser
          </a>
          <a href="mailto:kontakt@nie-danmark.dk" className="hover:text-slate-400 transition-colors">
            kontakt@nie-danmark.dk
          </a>
        </div>
        <p className="text-slate-700 text-xs mt-2">
          © {new Date().getFullYear()} NIE Danmark. Alle rettigheder forbeholdes.
        </p>
      </footer>
    </div>
  );
}
