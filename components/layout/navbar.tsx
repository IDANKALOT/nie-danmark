"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";

const navLinks = [
  { href: "/", label: "Forside" },
  { href: "/priser", label: "Priser" },
  { href: "/hvordan-det-virker", label: "Sådan virker det" },
  { href: "/om-os", label: "Om os" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isHomePage
    ? scrolled
      ? "bg-[#0f172a]/95 backdrop-blur-md shadow-lg"
      : "bg-transparent"
    : "bg-[#0f172a]";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#0f172a]" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">NIE Danmark</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#d4af37]"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Log ind
            </Link>
            <Link
              href="/ansogning"
              className="bg-[#d4af37] text-[#0f172a] text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Start ansøgning →
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0f172a] border-t border-white/10">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/login"
                className="block text-center px-4 py-3 text-slate-300 hover:text-white border border-white/20 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Log ind
              </Link>
              <Link
                href="/ansogning"
                className="block text-center bg-[#d4af37] text-[#0f172a] font-bold px-4 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Start ansøgning →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
