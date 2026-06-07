"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  FileText,
  Upload,
  CreditCard,
  Send,
  CheckCircle,
  Zap,
  Lock,
  Eye,
  HeadphonesIcon,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Scale,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { ReviewsCarousel } from "@/components/reviews/reviews-carousel";

/* =========================================================================
   Animation variants
   ========================================================================= */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = (i: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.08 },
  },
});

/* =========================================================================
   Hero Section
   ========================================================================= */
function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #080e1a 0%, #0f172a 35%, #112163 65%, #0d1940 100%)",
        paddingTop: "100px",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(30,58,171,0.35) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ maxWidth: "900px" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.3)",
            boxShadow: "0 0 24px rgba(212,175,55,0.12)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "#d4af37" }}
          >
            ✓ Betroet af 500+ danskere
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
          className="font-bold leading-tight mb-6"
          style={{
            color: "#ffffff",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "-0.04em",
          }}
        >
          Få dit spanske{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #d4af37, #f0d060, #d4af37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NIE-nummer
          </span>{" "}
          uden besvær
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="text-lg leading-relaxed mb-10 mx-auto"
          style={{
            color: "rgba(255,255,255,0.65)",
            maxWidth: 620,
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
          }}
        >
          Vi hjælper danskere gennem hele processen i samarbejde med spanske notarer og
          advokater. Hurtig, sikker og professionel service.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/ansogning"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #d4af37, #f0c830)",
              color: "#0f172a",
              boxShadow: "0 4px 24px rgba(212,175,55,0.45)",
              minWidth: 220,
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 8px 32px rgba(212,175,55,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 4px 24px rgba(212,175,55,0.45)";
            }}
          >
            Start ansøgning
            <ArrowRight size={18} />
          </Link>
          <Link
            href="#hvordan-det-virker"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 border"
            style={{
              color: "rgba(255,255,255,0.85)",
              borderColor: "rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.05)",
              minWidth: 220,
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(255,255,255,0.22)";
            }}
          >
            Se hvordan det virker
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.42 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "500+", label: "Tilfredse kunder" },
            { value: "2-4 uger", label: "Behandlingstid" },
            { value: "210 EUR", label: "Fast pris" },
            { value: "100%", label: "Garanti" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="font-bold text-2xl"
                style={{ color: "#d4af37", letterSpacing: "-0.03em" }}
              >
                {value}
              </span>
              <span
                className="text-xs mt-1 text-center"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating status card */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: 40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
        className="absolute bottom-12 right-6 lg:right-12 hidden md:block"
        style={{ zIndex: 20 }}
      >
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(15,23,42,0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            width: 260,
          }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37" }}
            >
              MH
            </div>
            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: "#ffffff" }}
              >
                Mikkel Hansen
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                Sag #NIE-2024-0847
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-3 mb-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                Sag status
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(234,179,8,0.15)",
                  color: "#fbbf24",
                }}
              >
                Under behandling
              </span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: "65%",
                  background: "linear-gradient(90deg, #d4af37, #f0d060)",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Trin 3 af 5
              </span>
              <span className="text-xs" style={{ color: "#d4af37" }}>65%</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {[
              { label: "Formular indsendt", done: true },
              { label: "Dokumenter godkendt", done: true },
              { label: "Notar kontaktet", done: false },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: done
                      ? "rgba(34,197,94,0.2)"
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  {done && (
                    <CheckCircle
                      size={10}
                      style={{ color: "#22c55e" }}
                      strokeWidth={3}
                    />
                  )}
                </div>
                <span
                  className="text-xs"
                  style={{ color: done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================================================================
   How It Works
   ========================================================================= */
const STEPS = [
  {
    number: "01",
    icon: FileText,
    title: "Udfyld formular",
    description:
      "Udfyld vores simple online formular på kun 10 minutter. Vi guider dig trin for trin.",
    time: "10 min",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload dokumenter",
    description:
      "Upload dit pas og adressebevis sikkert via vores krypterede platform.",
    time: "5 min",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Betal sikkert",
    description:
      "Betal det faste gebyr på 210 EUR via Stripe. Ingen skjulte gebyrer overhovedet.",
    time: "2 min",
  },
  {
    number: "04",
    icon: Send,
    title: "Vi sender til notar",
    description:
      "Vores spanske partneradvokater og notarer håndterer hele ansøgningsprocessen.",
    time: "1-3 uger",
  },
  {
    number: "05",
    icon: CheckCircle,
    title: "Modtag NIE-nummer",
    description:
      "Du modtager dit NIE-nummer digitalt og som fysisk dokument. Fuld garanti.",
    time: "2-4 uger",
  },
];

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="hvordan-det-virker"
      ref={ref}
      style={{ background: "#ffffff" }}
      className="py-24"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1280px" }}>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "rgba(15,23,42,0.06)",
              color: "#0f172a",
              letterSpacing: "0.1em",
            }}
          >
            Processen
          </div>
          <h2
            className="font-bold mb-4"
            style={{
              color: "#0f172a",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Sådan fungerer det
          </h2>
          <p
            className="text-lg mx-auto"
            style={{ color: "rgba(15,23,42,0.6)", maxWidth: 520 }}
          >
            Fra formular til NIE-nummer i blot 5 enkle trin. Vi håndterer al den
            bureaukratiske kompleksitet for dig.
          </p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Dotted connector line */}
          <div
            className="absolute top-10 left-0 right-0"
            style={{
              height: 2,
              background:
                "repeating-linear-gradient(90deg, #d4af37 0, #d4af37 8px, transparent 8px, transparent 24px)",
              opacity: 0.35,
              marginLeft: "10%",
              marginRight: "10%",
              zIndex: 0,
            }}
          />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={stagger(i)}
                  className="flex flex-col items-center text-center group"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: i === 4
                        ? "linear-gradient(135deg, #d4af37, #f0d060)"
                        : "#0f172a",
                      boxShadow: i === 4
                        ? "0 4px 20px rgba(212,175,55,0.4)"
                        : "0 4px 16px rgba(15,23,42,0.15)",
                    }}
                  >
                    <Icon
                      size={28}
                      strokeWidth={1.8}
                      style={{ color: i === 4 ? "#0f172a" : "#d4af37" }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold mb-1"
                    style={{ color: "#d4af37", letterSpacing: "0.08em" }}
                  >
                    Trin {step.number}
                  </span>
                  <h3
                    className="font-bold text-sm mb-2"
                    style={{ color: "#0f172a", letterSpacing: "-0.02em" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: "rgba(15,23,42,0.6)" }}
                  >
                    {step.description}
                  </p>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(212,175,55,0.1)",
                      color: "#b8960c",
                    }}
                  >
                    ⏱ {step.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="flex flex-col gap-0 lg:hidden">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={stagger(i)}
                className="flex gap-5"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: i === 4
                        ? "linear-gradient(135deg, #d4af37, #f0d060)"
                        : "#0f172a",
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      style={{ color: i === 4 ? "#0f172a" : "#d4af37" }}
                    />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 mt-2"
                      style={{
                        width: 2,
                        minHeight: 40,
                        background:
                          "repeating-linear-gradient(180deg, #d4af37 0, #d4af37 5px, transparent 5px, transparent 14px)",
                        opacity: 0.4,
                      }}
                    />
                  )}
                </div>
                <div className="pb-8">
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#d4af37", letterSpacing: "0.08em" }}
                  >
                    Trin {step.number} · {step.time}
                  </span>
                  <h3
                    className="font-bold text-base mt-1 mb-1.5"
                    style={{ color: "#0f172a", letterSpacing: "-0.02em" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(15,23,42,0.6)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Benefits / Features Section
   ========================================================================= */
const BENEFITS = [
  {
    icon: Scale,
    title: "Juridisk ekspertise",
    description:
      "Vi samarbejder med autoriserede spanske advokater og notarer med årtiers erfaring.",
  },
  {
    icon: Zap,
    title: "Hurtig behandling",
    description:
      "Gennemsnitlig behandlingstid er 2-4 uger. Ekspres option tilgængelig.",
  },
  {
    icon: Lock,
    title: "Sikker betaling",
    description:
      "Alle betalinger sker via Stripe med bank-niveau kryptering. Fuldt PCI-compliant.",
  },
  {
    icon: Eye,
    title: "Online tracking",
    description:
      "Følg din sags status i realtid via dit personlige dashboard. Altid opdateret.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dansk support",
    description:
      "Vores dansktalende supportteam er klar til at hjælpe dig man–fre fra 9–17.",
  },
  {
    icon: Award,
    title: "Fuld garanti",
    description:
      "Hvis din ansøgning ikke godkendes af vores fejl, betaler vi dig fuldt tilbage.",
  },
];

function BenefitsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24"
      style={{
        background: "linear-gradient(145deg, #080e1a 0%, #0f172a 50%, #0d1940 100%)",
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1280px" }}>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "rgba(212,175,55,0.1)",
              color: "#d4af37",
              letterSpacing: "0.1em",
            }}
          >
            Fordele
          </div>
          <h2
            className="font-bold mb-4"
            style={{
              color: "#ffffff",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Hvorfor vælge NIE Danmark?
          </h2>
          <p
            className="text-lg mx-auto"
            style={{ color: "rgba(255,255,255,0.55)", maxWidth: 500 }}
          >
            Vi gør processen enkel, gennemsigtig og tryg – så du kan fokusere på det,
            der betyder noget.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={stagger(i)}
                className="group rounded-2xl p-7 transition-all duration-300 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.border = "1px solid rgba(212,175,55,0.35)";
                  el.style.background = "rgba(212,175,55,0.05)";
                  el.style.boxShadow = "0 0 30px rgba(212,175,55,0.12)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.border = "1px solid rgba(255,255,255,0.07)";
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(212,175,55,0.12)",
                    border: "1px solid rgba(212,175,55,0.2)",
                  }}
                >
                  <Icon size={22} strokeWidth={1.8} style={{ color: "#d4af37" }} />
                </div>
                <h3
                  className="font-bold text-lg mb-2.5"
                  style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Trust Badges Section
   ========================================================================= */
const TRUST_BADGES = [
  {
    icon: "🔒",
    label: "Stripe sikker betaling",
    sub: "PCI DSS Level 1",
  },
  {
    icon: "🛡️",
    label: "SSL krypteret",
    sub: "256-bit TLS kryptering",
  },
  {
    icon: "🇪🇺",
    label: "GDPR compliant",
    sub: "EU databeskyttelse",
  },
  {
    icon: "⚖️",
    label: "Spansk notar",
    sub: "Autoriseret certificeret",
  },
];

function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20" style={{ background: "#ffffff" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1280px" }}>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2
            className="font-bold mb-3"
            style={{
              color: "#0f172a",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Verificeret og godkendt
          </h2>
          <p className="text-base" style={{ color: "rgba(15,23,42,0.55)" }}>
            Din sikkerhed og tryghed er vores højeste prioritet
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={stagger(i)}
              className="flex flex-col items-center text-center p-6 rounded-2xl"
              style={{
                background: "#f8fafc",
                border: "1px solid rgba(15,23,42,0.07)",
              }}
            >
              <span className="text-3xl mb-3">{badge.icon}</span>
              <div
                className="font-bold text-sm mb-1"
                style={{ color: "#0f172a" }}
              >
                {badge.label}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(15,23,42,0.45)" }}
              >
                {badge.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* As seen in / partner logos bar */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
          className="flex flex-col items-center"
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-6"
            style={{ color: "rgba(15,23,42,0.35)", letterSpacing: "0.12em" }}
          >
            Omtalt i
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["Berlingske", "Politiken", "Børsen", "TV 2", "DR"].map(
              (name) => (
                <span
                  key={name}
                  className="text-lg font-bold"
                  style={{ color: "rgba(15,23,42,0.2)", letterSpacing: "-0.02em" }}
                >
                  {name}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
   Testimonials Section
   ========================================================================= */
function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="anmeldelser"
      className="py-24"
      style={{ background: "#f1f5f9" }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1280px" }}>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "rgba(15,23,42,0.07)",
              color: "#0f172a",
              letterSpacing: "0.1em",
            }}
          >
            Anmeldelser
          </div>
          <h2
            className="font-bold mb-4"
            style={{
              color: "#0f172a",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Hvad vores kunder siger
          </h2>
        </motion.div>

        <ReviewsCarousel />
      </div>
    </section>
  );
}

/* =========================================================================
   Pricing Section
   ========================================================================= */
const PRICE_INCLUDES = [
  "Komplet ansøgningsassistance",
  "Kontakt til spansk notar",
  "Advokat gennemgang af dokumenter",
  "Realtids sagssporing via dashboard",
  "Dansk kundesupport man–fre",
  "Fuldt tilbagebetaling ved afvisning",
  "Dokument opbevaring i 12 måneder",
  "Digital + fysisk NIE-kopi",
];

function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24" style={{ background: "#ffffff" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1280px" }}>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "rgba(15,23,42,0.07)",
              color: "#0f172a",
              letterSpacing: "0.1em",
            }}
          >
            Prisplan
          </div>
          <h2
            className="font-bold mb-4"
            style={{
              color: "#0f172a",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Enkel og gennemsigtig pris
          </h2>
          <p className="text-lg" style={{ color: "rgba(15,23,42,0.55)" }}>
            Én fast pris. Alt inklusiv. Ingen overraskelser.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="max-w-lg mx-auto"
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              border: "2px solid rgba(212,175,55,0.4)",
              boxShadow: "0 8px 48px rgba(212,175,55,0.15), 0 2px 16px rgba(15,23,42,0.08)",
            }}
          >
            {/* Card header */}
            <div
              className="px-8 py-8 text-center"
              style={{
                background: "linear-gradient(145deg, #0f172a 0%, #162c87 100%)",
              }}
            >
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  color: "#d4af37",
                  border: "1px solid rgba(212,175,55,0.25)",
                }}
              >
                Alt inklusiv · Fast pris
              </div>
              <div className="flex items-start justify-center gap-2 mb-2">
                <span
                  className="text-xl font-bold mt-3"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  €
                </span>
                <span
                  className="font-bold"
                  style={{
                    color: "#ffffff",
                    fontSize: "5rem",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                  }}
                >
                  210
                </span>
              </div>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Ingen skjulte gebyrer · Betales éntydigt
              </p>
            </div>

            {/* Includes list */}
            <div className="px-8 py-8" style={{ background: "#fafbfc" }}>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: "rgba(15,23,42,0.4)", letterSpacing: "0.1em" }}
              >
                Inkluderet i prisen
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {PRICE_INCLUDES.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(34,197,94,0.12)" }}
                    >
                      <CheckCircle size={12} style={{ color: "#22c55e" }} strokeWidth={3} />
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "rgba(15,23,42,0.8)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/ansogning"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-base transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f0c830)",
                  color: "#0f172a",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(-1px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 8px 28px rgba(212,175,55,0.55)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 4px 20px rgba(212,175,55,0.4)";
                }}
              >
                Start ansøgning nu
                <ArrowRight size={18} />
              </Link>

              <p
                className="text-xs text-center mt-4"
                style={{ color: "rgba(15,23,42,0.4)" }}
              >
                Fuld tilbagebetaling garanteret ved afvisning pga. vores fejl
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
   FAQ Section
   ========================================================================= */
const FAQS = [
  {
    q: "Hvad er et NIE-nummer, og hvorfor har jeg brug for det?",
    a: "NIE (Número de Identificación de Extranjero) er et spansk identifikationsnummer for udlændinge. Du har brug for det, hvis du vil købe ejendom i Spanien, starte en virksomhed, åbne en spansk bankkonto, arbejde eller studere i Spanien eller betale skat i Spanien.",
  },
  {
    q: "Hvor lang tid tager det at få et NIE-nummer?",
    a: "Med vores service er den gennemsnitlige behandlingstid 2-4 uger fra vi modtager dine dokumenter. I travle perioder kan det tage op til 6 uger. Vi tilbyder også en ekspres-option for dem, der har brug for det hurtigere.",
  },
  {
    q: "Hvad er inkluderet i prisen på 210 EUR?",
    a: "Alt er inkluderet: ansøgningsassistance, notar-kontakt, advokatgennemgang, sagssporing, dansk support og fuld garanti. Der er ingen skjulte gebyrer eller ekstra omkostninger. Den eneste tilladte tillægsomkostning er officielle spanske statsgebyrer, som typisk er 10-15 EUR.",
  },
  {
    q: "Skal jeg rejse til Spanien for at få mit NIE-nummer?",
    a: "I de fleste tilfælde kan vi ordne det uden at du behøver at rejse til Spanien, ved at bruge en spansk advokat som din befuldmægtigede. I visse situationer kan det dog være nødvendigt at møde op personligt – dette vil vi afklare med dig inden start.",
  },
  {
    q: "Hvad sker der, hvis min ansøgning afvises?",
    a: "Hvis din ansøgning afvises på grund af vores fejl eller mangler i vores service, refunderer vi hele beløbet på 210 EUR. Vi står fuldt inde for vores arbejde og har en meget høj succesrate på over 99%.",
  },
];

function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="py-24"
      style={{
        background: "linear-gradient(145deg, #080e1a 0%, #0f172a 50%, #0d1940 100%)",
      }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: "800px" }}
      >
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "rgba(212,175,55,0.1)",
              color: "#d4af37",
              letterSpacing: "0.1em",
            }}
          >
            FAQ
          </div>
          <h2
            className="font-bold mb-4"
            style={{
              color: "#ffffff",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Ofte stillede spørgsmål
          </h2>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            Har du andre spørgsmål? Vores team er klar til at hjælpe.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={stagger(i)}
            >
              <button
                className="w-full text-left rounded-2xl px-6 py-5 transition-all duration-200"
                style={{
                  background:
                    openIndex === i
                      ? "rgba(212,175,55,0.08)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    openIndex === i
                      ? "1px solid rgba(212,175,55,0.25)"
                      : "1px solid rgba(255,255,255,0.07)",
                }}
                onClick={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
                aria-expanded={openIndex === i}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="font-semibold text-base"
                    style={{ color: "#ffffff" }}
                  >
                    {faq.q}
                  </span>
                  {openIndex === i ? (
                    <ChevronUp
                      size={18}
                      style={{ color: "#d4af37", flexShrink: 0 }}
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="text-sm leading-relaxed pt-4"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="text-center mt-10"
        >
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-150"
            style={{ color: "#d4af37" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.gap = "10px";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.gap = "8px";
            }}
          >
            Se alle spørgsmål
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
   CTA Section
   ========================================================================= */
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #b8960c 0%, #d4af37 40%, #f0d060 70%, #d4af37 100%)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ maxWidth: "720px" }}
      >
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <h2
            className="font-bold mb-4"
            style={{
              color: "#0f172a",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.05em",
            }}
          >
            Klar til at komme i gang?
          </h2>
          <p
            className="text-lg leading-relaxed mb-10 mx-auto"
            style={{ color: "rgba(15,23,42,0.7)", maxWidth: 500 }}
          >
            Tilmeld dig 500+ danskere der allerede har fået hjælp til at ansøge om
            spansk NIE-nummer. Hurtig, sikker og professionel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ansogning"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200"
              style={{
                background: "#0f172a",
                color: "#d4af37",
                boxShadow: "0 4px 24px rgba(15,23,42,0.3)",
                minWidth: 220,
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 8px 36px rgba(15,23,42,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 24px rgba(15,23,42,0.3)";
              }}
            >
              Start ansøgning nu
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
              style={{
                color: "#0f172a",
                background: "rgba(15,23,42,0.1)",
                minWidth: 200,
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(15,23,42,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(15,23,42,0.1)";
              }}
            >
              Kontakt os
            </Link>
          </div>

          <p
            className="text-sm mt-8"
            style={{ color: "rgba(15,23,42,0.5)" }}
          >
            Ingen binding · Fuld garanti · Svar inden for 24 timer
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
   Page Export
   ========================================================================= */
export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <div className="bg-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <DisclaimerBanner size="sm" />
        </div>
      </div>
      <HowItWorksSection />
      <BenefitsSection />
      <TrustSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
