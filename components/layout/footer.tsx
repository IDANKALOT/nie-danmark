import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

const footerLinks = {
  tjenester: [
    { label: "NIE-ansøgning", href: "/ansogning" },
    { label: "Priser", href: "/priser" },
    { label: "Sådan virker det", href: "/hvordan-det-virker" },
    { label: "Kundeportal", href: "/dashboard" },
  ],
  ressourcer: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Hvad er NIE?", href: "/blog/hvad-er-et-nie-nummer" },
    { label: "Dokumenter krævet", href: "/blog/nie-ansogning-dokumenter-krav" },
  ],
  virksomhed: [
    { label: "Om os", href: "/om-os" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Privatlivspolitik", href: "/privatlivspolitik" },
    { label: "Handelsbetingelser", href: "/handelsbetingelser" },
    { label: "Cookiepolitik", href: "/cookiepolitik" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37] flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#0f172a]" />
              </div>
              <span className="text-white font-bold text-lg">NIE Danmark</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Vi hjælper danskere med at få spansk NIE-nummer hurtigt og professionelt i samarbejde med autoriserede spanske notarer og advokater.
            </p>
            <div className="space-y-2">
              <a href="mailto:info@nie-danmark.dk" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                info@nie-danmark.dk
              </a>
              <a href="tel:+4512345678" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                +45 12 34 56 78
              </a>
              <span className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                Aarhus, Danmark
              </span>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Tjenester</h4>
            <ul className="space-y-3">
              {footerLinks.tjenester.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Ressourcer</h4>
            <ul className="space-y-3">
              {footerLinks.ressourcer.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Virksomhed</h4>
            <ul className="space-y-3">
              {footerLinks.virksomhed.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <DisclaimerBanner variant="dark" size="sm" />
        </div>

        {/* Trust badges */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {["🔒 SSL Krypteret", "💳 Stripe Sikker betaling", "🇪🇺 GDPR Compliant", "⚖️ Autoriserede notarer"].map((badge) => (
              <span key={badge} className="text-xs bg-white/5 border border-white/10 rounded-full px-4 py-2 text-slate-400">
                {badge}
              </span>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} NIE Danmark. Alle rettigheder forbeholdt.</p>
            <div className="flex gap-6">
              <Link href="/privatlivspolitik" className="hover:text-white transition-colors">Privatlivspolitik</Link>
              <Link href="/handelsbetingelser" className="hover:text-white transition-colors">Handelsbetingelser</Link>
              <Link href="/cookiepolitik" className="hover:text-white transition-colors">Cookiepolitik</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
