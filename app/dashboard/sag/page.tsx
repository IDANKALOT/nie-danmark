"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  FileText,
  Send,
  Download,
  Eye,
} from "lucide-react";
import {
  getStatusLabel,
  getStatusColor,
  formatDate,
  formatCurrency,
  formatDateTime,
} from "@/lib/utils";
import type { ApplicationStatus } from "@prisma/client";

const MOCK_APPLICATION = {
  id: "CLX1A2B3C4D5E6F7",
  status: "PROCESSING" as ApplicationStatus,
  fullName: "Anders Jensen",
  email: "anders@example.com",
  phone: "+45 12 34 56 78",
  dateOfBirth: new Date("1985-03-15"),
  passportNumber: "DK1234567",
  address: "Vesterbrogade 42, 2. th.",
  city: "København",
  postalCode: "1620",
  country: "Danmark",
  createdAt: new Date("2024-11-01T10:30:00"),
  updatedAt: new Date("2024-11-03T14:00:00"),
  amount: 210,
  currency: "EUR",
  paymentStatus: "PAID",
};

const MOCK_STATUS_HISTORY = [
  {
    id: "1",
    status: "RECEIVED" as ApplicationStatus,
    note: "Ansøgning modtaget og registreret i vores system.",
    changedBy: "System",
    createdAt: new Date("2024-11-01T10:30:00"),
  },
  {
    id: "2",
    status: "PROCESSING" as ApplicationStatus,
    note: "Dokumenter er under gennemgang. Alt ser godt ud.",
    changedBy: "NIE Danmark team",
    createdAt: new Date("2024-11-03T14:00:00"),
  },
];

const MOCK_DOCUMENTS = [
  {
    id: "1",
    name: "pas_anders_jensen.pdf",
    type: "PASSPORT",
    typeLabel: "Pas",
    uploadedAt: new Date("2024-11-01T10:35:00"),
    size: 1234567,
  },
];

const MOCK_MESSAGES = [
  {
    id: "1",
    content:
      "Velkommen til NIE Danmark! Vi er i gang med at gennemgå din ansøgning og alle dine dokumenter. Vi vender tilbage inden for 1 arbejdsdag.",
    isFromAdmin: true,
    createdAt: new Date("2024-11-03T14:05:00"),
    sender: "NIE Danmark team",
  },
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <Icon size={16} style={{ color: "#0f172a" }} />
        </div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5"
      style={{ borderBottom: "1px solid #f1f5f9" }}>
      <dt className="text-xs font-medium text-slate-400 sm:w-40 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

export default function SagPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 flex-wrap justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Min sag</h1>
            <p className="text-slate-500 text-sm mt-1">
              Sagsnummer:{" "}
              <span className="font-mono font-semibold text-slate-700">
                {MOCK_APPLICATION.id}
              </span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(MOCK_APPLICATION.status, "badge")}`}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor", opacity: 0.7 }} />
            {getStatusLabel(MOCK_APPLICATION.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Personal info */}
          <SectionCard title="Personoplysninger" icon={User}>
            <dl className="divide-y divide-slate-50">
              <InfoRow label="Fuldt navn" value={MOCK_APPLICATION.fullName} />
              <InfoRow label="E-mail" value={MOCK_APPLICATION.email} />
              <InfoRow label="Telefon" value={MOCK_APPLICATION.phone} />
              <InfoRow
                label="Fødselsdato"
                value={formatDate(MOCK_APPLICATION.dateOfBirth)}
              />
              <InfoRow
                label="Pasnummer"
                value={MOCK_APPLICATION.passportNumber}
              />
            </dl>
          </SectionCard>

          {/* Address */}
          <SectionCard title="Adresse" icon={MapPin}>
            <dl className="divide-y divide-slate-50">
              <InfoRow label="Adresse" value={MOCK_APPLICATION.address} />
              <InfoRow label="By" value={MOCK_APPLICATION.city} />
              <InfoRow label="Postnummer" value={MOCK_APPLICATION.postalCode} />
              <InfoRow label="Land" value={MOCK_APPLICATION.country} />
            </dl>
          </SectionCard>

          {/* Status history */}
          <SectionCard title="Statushistorik" icon={Clock}>
            <ol className="relative">
              {MOCK_STATUS_HISTORY.map((entry, i) => {
                const isLast = i === MOCK_STATUS_HISTORY.length - 1;
                return (
                  <li key={entry.id} className="relative flex gap-4">
                    {!isLast && (
                      <div
                        className="absolute left-3.5 top-7 bottom-0 w-px"
                        style={{ background: "#e2e8f0" }}
                      />
                    )}
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)" }}
                    >
                      <CheckCircle2 size={14} style={{ color: "#0f172a" }} />
                    </div>
                    <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                      <p className="text-sm font-semibold text-slate-900">
                        {getStatusLabel(entry.status)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDateTime(entry.createdAt)} · {entry.changedBy}
                      </p>
                      {entry.note && (
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </SectionCard>

          {/* Message thread */}
          <SectionCard title="Beskeder" icon={FileText}>
            <div className="flex flex-col gap-3 mb-4">
              {MOCK_MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isFromAdmin ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className="max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.isFromAdmin
                        ? {
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            color: "#334155",
                          }
                        : {
                            background: "#0f172a",
                            color: "#fff",
                          }
                    }
                  >
                    {msg.isFromAdmin && (
                      <p
                        className="text-xs font-semibold mb-1.5"
                        style={{ color: "#d4af37" }}
                      >
                        {msg.sender}
                      </p>
                    )}
                    <p>{msg.content}</p>
                    <p
                      className="text-xs mt-2 opacity-60"
                    >
                      {formatDateTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Message composer */}
            <div
              className="flex gap-2 items-end"
              style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Skriv en besked..."
                rows={3}
                className="flex-1 px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#0f172a",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#d4af37";
                  e.currentTarget.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                }}
              />
              <button
                disabled={!message.trim()}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 flex-shrink-0 mb-0.5 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f0c830)",
                  color: "#0f172a",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Payment info */}
          <SectionCard title="Betaling" icon={CreditCard}>
            <dl className="divide-y divide-slate-50">
              <InfoRow
                label="Beløb"
                value={formatCurrency(MOCK_APPLICATION.amount, MOCK_APPLICATION.currency)}
              />
              <InfoRow label="Valuta" value={MOCK_APPLICATION.currency} />
              <InfoRow label="Status" value="Betalt" />
              <InfoRow
                label="Oprettet"
                value={formatDate(MOCK_APPLICATION.createdAt)}
              />
            </dl>
          </SectionCard>

          {/* Documents */}
          <SectionCard title="Dokumenter" icon={FileText}>
            {MOCK_DOCUMENTS.length === 0 ? (
              <p className="text-sm text-slate-400">Ingen dokumenter uploadet endnu.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {MOCK_DOCUMENTS.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#fff", border: "1px solid #e2e8f0" }}
                    >
                      <FileText size={14} style={{ color: "#64748b" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {doc.typeLabel} · {formatFileSize(doc.size)}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#64748b" }}
                        title="Se dokument"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "#e2e8f0";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "transparent";
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#64748b" }}
                        title="Download"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "#e2e8f0";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "transparent";
                        }}
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
