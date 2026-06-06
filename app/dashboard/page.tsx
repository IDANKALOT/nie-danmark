"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText,
  Upload,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Bell,
} from "lucide-react";
import { getStatusLabel, getStatusColor, formatDate, formatCurrency } from "@/lib/utils";
import type { ApplicationStatus } from "@prisma/client";

const MOCK_APPLICATION = {
  id: "clx1a2b3c4d5e6f7g",
  status: "PROCESSING" as ApplicationStatus,
  fullName: "Anders Jensen",
  createdAt: new Date("2024-11-01"),
  amount: 210,
  currency: "EUR",
  paymentStatus: "PAID",
};

const MOCK_TIMELINE = [
  {
    status: "RECEIVED" as ApplicationStatus,
    label: "Modtaget",
    date: new Date("2024-11-01"),
    done: true,
    note: "Din ansøgning er modtaget og registreret.",
  },
  {
    status: "PROCESSING" as ApplicationStatus,
    label: "Under behandling",
    date: new Date("2024-11-03"),
    done: true,
    note: "Vi gennemgår dine dokumenter og forbereder ansøgningen.",
  },
  {
    status: "AT_NOTARY" as ApplicationStatus,
    label: "Hos notar",
    date: null,
    done: false,
    note: "Ansøgningen sendes til spansk notar.",
  },
  {
    status: "AT_LAWYER" as ApplicationStatus,
    label: "Hos advokat",
    date: null,
    done: false,
    note: "Spansk advokat behandler sagen.",
  },
  {
    status: "COMPLETED" as ApplicationStatus,
    label: "Færdigbehandlet",
    date: null,
    done: false,
    note: "Dit NIE-nummer er klar.",
  },
];

const MOCK_DOCUMENTS = [
  { id: "1", name: "Pas", uploaded: true, type: "Pas" },
  { id: "2", name: "Adressebevis", uploaded: false, type: "Adressebevis" },
];

const MOCK_MESSAGES = [
  {
    id: "1",
    content: "Velkommen til NIE Danmark! Vi er i gang med at gennemgå din ansøgning.",
    isFromAdmin: true,
    createdAt: new Date("2024-11-03"),
    sender: "NIE Danmark team",
  },
];

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status, "badge")}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "currentColor", opacity: 0.7 }}
      />
      {getStatusLabel(status)}
    </span>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "kunde";
  const uploadedCount = MOCK_DOCUMENTS.filter((d) => d.uploaded).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              God dag, {firstName}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Her er en oversigt over din NIE-ansøgning.
            </p>
          </div>
          <Link
            href="/dashboard/beskeder"
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150"
            style={{ background: "#0f172a" }}
          >
            <Bell size={15} />
            Beskeder
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: "#d4af37", color: "#0f172a" }}
            >
              1
            </span>
          </Link>
        </div>
      </div>

      {/* Status card */}
      <div
        className="rounded-2xl p-6 mb-6 text-white"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #162c87 60%, #0f172a 100%)",
          boxShadow: "0 4px 24px rgba(15,23,42,0.18)",
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              Sagsnummer
            </p>
            <p className="text-sm font-mono font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
              {MOCK_APPLICATION.id.slice(0, 12).toUpperCase()}
            </p>
          </div>
          <StatusBadge status={MOCK_APPLICATION.status} />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              Oprettet
            </p>
            <p className="text-sm font-semibold">
              {formatDate(MOCK_APPLICATION.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              Betaling
            </p>
            <p className="text-sm font-semibold">
              {formatCurrency(MOCK_APPLICATION.amount, MOCK_APPLICATION.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
              Betalingsstatus
            </p>
            <p className="text-sm font-semibold" style={{ color: "#86efac" }}>
              Betalt
            </p>
          </div>
        </div>
      </div>

      {/* Grid: timeline + checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Timeline */}
        <div
          className="lg:col-span-3 bg-white rounded-2xl p-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
        >
          <h2 className="text-base font-bold text-slate-900 mb-5">
            Sagsforløb
          </h2>
          <ol className="relative">
            {MOCK_TIMELINE.map((step, i) => {
              const isCurrent =
                step.status === MOCK_APPLICATION.status;
              const isLast = i === MOCK_TIMELINE.length - 1;

              return (
                <li key={step.status} className="relative flex gap-4">
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-4 top-8 bottom-0 w-px"
                      style={{
                        background: step.done
                          ? "#d4af37"
                          : "rgba(0,0,0,0.08)",
                        height: "calc(100% - 8px)",
                      }}
                    />
                  )}
                  {/* Icon */}
                  <div
                    className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{
                      background: step.done
                        ? "linear-gradient(135deg, #d4af37, #f0d060)"
                        : isCurrent
                        ? "#0f172a"
                        : "#f1f5f9",
                      boxShadow: isCurrent
                        ? "0 0 0 3px rgba(212,175,55,0.3)"
                        : "none",
                    }}
                  >
                    {step.done ? (
                      <CheckCircle2
                        size={16}
                        strokeWidth={2.5}
                        style={{ color: "#0f172a" }}
                      />
                    ) : isCurrent ? (
                      <Clock
                        size={14}
                        strokeWidth={2.2}
                        style={{ color: "#d4af37" }}
                      />
                    ) : (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: "#cbd5e1" }}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: step.done || isCurrent ? "#0f172a" : "#94a3b8",
                        }}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: "#fef9c3", color: "#854d0e" }}
                        >
                          Nu
                        </span>
                      )}
                    </div>
                    {step.date && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(step.date)}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">{step.note}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Document checklist */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Dokumenter</h2>
              <span className="text-sm font-semibold" style={{ color: "#d4af37" }}>
                {uploadedCount}/{MOCK_DOCUMENTS.length}
              </span>
            </div>
            {/* Progress */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(uploadedCount / MOCK_DOCUMENTS.length) * 100}%`,
                  background: "linear-gradient(90deg, #d4af37, #f0d060)",
                }}
              />
            </div>
            <ul className="flex flex-col gap-3">
              {MOCK_DOCUMENTS.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: doc.uploaded ? "#f0fdf4" : "#fff7ed",
                    }}
                  >
                    {doc.uploaded ? (
                      <CheckCircle2 size={14} style={{ color: "#16a34a" }} />
                    ) : (
                      <AlertCircle size={14} style={{ color: "#f97316" }} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.type}</p>
                  </div>
                  {!doc.uploaded && (
                    <Link
                      href="/dashboard/dokumenter"
                      className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                      style={{ background: "#fef9c3", color: "#854d0e" }}
                    >
                      Upload
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent messages */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
          >
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Seneste besked
            </h2>
            {MOCK_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className="p-3 rounded-xl text-sm"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <p className="font-semibold text-slate-700 text-xs mb-1">
                  {msg.sender}
                </p>
                <p className="text-slate-600 leading-relaxed">{msg.content}</p>
                <p className="text-slate-400 text-xs mt-2">
                  {formatDate(msg.createdAt)}
                </p>
              </div>
            ))}
            <Link
              href="/dashboard/beskeder"
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: "#d4af37" }}
            >
              Se alle beskeder <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            href: "/dashboard/dokumenter",
            icon: Upload,
            label: "Upload dokument",
            desc: "Tilføj manglende dokumenter",
            color: "#0f172a",
          },
          {
            href: "/dashboard/sag",
            icon: FileText,
            label: "Se min sag",
            desc: "Alle detaljer og historik",
            color: "#0f172a",
          },
          {
            href: "/dashboard/beskeder",
            icon: MessageSquare,
            label: "Kontakt os",
            desc: "Send en besked til vores team",
            color: "#0f172a",
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl transition-all duration-150 group"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 4px 24px rgba(0,0,0,0.1)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(0)";
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <action.icon size={18} style={{ color: "#0f172a" }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{action.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
            </div>
            <ArrowRight
              size={16}
              className="ml-auto flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1"
              style={{ color: "#cbd5e1" }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
