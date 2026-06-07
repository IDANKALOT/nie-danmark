"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User as UserIcon,
  MapPin,
  CreditCard,
  Clock,
  FileText,
  Send,
  Download,
  Eye,
  StickyNote,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  FileDown,
} from "lucide-react";
import {
  getStatusLabel,
  getStatusColor,
  formatDate,
  formatDateTime,
  formatCurrency,
  getPdfTypeLabel,
} from "@/lib/utils";
import type {
  Application,
  User,
  Document,
  StatusHistory,
  Message,
  AdminNote,
  Payment,
  GeneratedPDF,
  ApplicationStatus,
  DocumentType,
  PaymentStatus,
} from "@prisma/client";

const ALL_STATUSES: ApplicationStatus[] = [
  "RECEIVED",
  "PROCESSING",
  "AT_NOTARY",
  "AT_LAWYER",
  "AWAITING_CLIENT",
  "COMPLETED",
  "CANCELLED",
];

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  PASSPORT: "Pas",
  PROOF_OF_ADDRESS: "Adressebevis",
  OTHER: "Andet",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Afventer",
  PAID: "Betalt",
  REFUNDED: "Refunderet",
  FAILED: "Mislykkedes",
};

export interface CaseDetailApplication extends Application {
  user: Pick<User, "id" | "name" | "email" | "image">;
  documents: Document[];
  statusHistory: StatusHistory[];
  messages: (Message & { user: Pick<User, "id" | "name" | "image" | "role"> })[];
  adminNotes: AdminNote[];
  payment: Payment | null;
  generatedPdfs: GeneratedPDF[];
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <Icon size={16} style={{ color: "#0f172a" }} />
          </div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5"
      style={{ borderBottom: "1px solid #f1f5f9" }}
    >
      <dt className="text-xs font-medium text-slate-400 sm:w-40 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

export default function CaseDetail({ application }: { application: CaseDetailApplication }) {
  const router = useRouter();

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(application.status);
  const [statusNote, setStatusNote] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [adminNote, setAdminNote] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [messageSending, setMessageSending] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  async function handleStatusUpdate() {
    setStatusSaving(true);
    setStatusError(null);
    try {
      const res = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus, note: statusNote.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Kunne ikke opdatere status");
      }
      setStatusNote("");
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Der opstod en fejl");
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleAddNote() {
    if (!adminNote.trim()) return;
    setNoteSaving(true);
    setNoteError(null);
    try {
      const res = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: adminNote.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Kunne ikke gemme note");
      }
      setAdminNote("");
      router.refresh();
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : "Der opstod en fejl");
    } finally {
      setNoteSaving(false);
    }
  }

  async function handleSendMessage() {
    if (!message.trim()) return;
    setMessageSending(true);
    setMessageError(null);
    try {
      const res = await fetch(`/api/admin/applications/${application.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Kunne ikke sende besked");
      }
      setMessage("");
      router.refresh();
    } catch (err) {
      setMessageError(err instanceof Error ? err.message : "Der opstod en fejl");
    } finally {
      setMessageSending(false);
    }
  }

  async function handleGeneratePdfs() {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch(`/api/admin/applications/${application.id}/generate-pdfs`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Kunne ikke generere dokumenter");
      }
      router.refresh();
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Der opstod en fejl");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/sager"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft size={15} /> Tilbage til sager
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{application.fullName}</h1>
            <p className="text-slate-500 text-sm mt-1 font-mono">
              ID: {application.id}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(currentStatus, "badge")}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "currentColor", opacity: 0.7 }}
            />
            {getStatusLabel(currentStatus)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Status update */}
          <SectionCard title="Opdater status" icon={Clock}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Ny status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer transition-all"
                  style={{
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    color: "#0f172a",
                  }}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {getStatusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Statusnote (valgfri)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Tilføj en note om statusskiftet..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all"
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
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleStatusUpdate}
                  disabled={statusSaving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #f0c830)",
                    color: "#0f172a",
                  }}
                >
                  <Save size={15} />
                  {statusSaving ? "Gemmer..." : "Gem status"}
                </button>
                {statusSaved && (
                  <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#16a34a" }}>
                    <CheckCircle2 size={15} />
                    Gemt!
                  </div>
                )}
                {statusError && (
                  <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#dc2626" }}>
                    <AlertCircle size={15} />
                    {statusError}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Personal info */}
          <SectionCard title="Personoplysninger" icon={UserIcon}>
            <dl className="divide-y divide-slate-50">
              <InfoRow label="Fuldt navn" value={application.fullName} />
              <InfoRow label="E-mail" value={application.email} />
              <InfoRow label="Telefon" value={application.phone} />
              <InfoRow label="Fødselsdato" value={formatDate(application.dateOfBirth)} />
              <InfoRow label="Pasnummer" value={application.passportNumber} />
            </dl>
          </SectionCard>

          {/* Address */}
          <SectionCard title="Adresse" icon={MapPin}>
            <dl className="divide-y divide-slate-50">
              <InfoRow label="Adresse" value={application.address} />
              <InfoRow label="By" value={application.city} />
              <InfoRow label="Postnummer" value={application.postalCode} />
              <InfoRow label="Land" value={application.country} />
            </dl>
          </SectionCard>

          {/* Status history */}
          <SectionCard title="Statushistorik" icon={Clock}>
            {application.statusHistory.length === 0 ? (
              <p className="text-sm text-slate-400">Ingen statusændringer endnu.</p>
            ) : (
              <ol className="relative">
                {application.statusHistory.map((entry, i) => {
                  const isLast = i === application.statusHistory.length - 1;
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
                          {formatDateTime(entry.createdAt)}
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
            )}
          </SectionCard>

          {/* Message thread */}
          <SectionCard title="Beskedtråd med kunde" icon={FileText}>
            <div className="flex flex-col gap-3 mb-4 max-h-72 overflow-y-auto pr-1">
              {application.messages.length === 0 ? (
                <p className="text-sm text-slate-400">Ingen beskeder endnu.</p>
              ) : (
                application.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isFromAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={
                        msg.isFromAdmin
                          ? { background: "#0f172a", color: "#fff" }
                          : { background: "#f8fafc", border: "1px solid #e2e8f0", color: "#334155" }
                      }
                    >
                      <p className="text-xs font-semibold mb-1" style={{ color: msg.isFromAdmin ? "#d4af37" : "#64748b" }}>
                        {msg.isFromAdmin ? "NIE Danmark team" : (msg.user.name ?? application.fullName)}
                      </p>
                      <p>{msg.content}</p>
                      <p className="text-xs mt-2 opacity-50">{formatDateTime(msg.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div
              className="flex gap-2 items-end"
              style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Skriv besked til kunden..."
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
                disabled={!message.trim() || messageSending}
                onClick={handleSendMessage}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 flex-shrink-0 mb-0.5 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #d4af37, #f0c830)", color: "#0f172a" }}
              >
                <Send size={16} />
              </button>
            </div>
            {messageError && (
              <p className="text-sm font-medium mt-2" style={{ color: "#dc2626" }}>
                {messageError}
              </p>
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Payment */}
          <SectionCard title="Betaling" icon={CreditCard}>
            <dl className="divide-y divide-slate-50">
              <InfoRow
                label="Beløb"
                value={
                  application.amount != null
                    ? formatCurrency(application.amount, application.currency)
                    : "—"
                }
              />
              <InfoRow label="Valuta" value={application.currency} />
              <InfoRow label="Status" value={PAYMENT_STATUS_LABELS[application.paymentStatus]} />
              <InfoRow label="Oprettet" value={formatDate(application.createdAt)} />
            </dl>
            {application.paymentStatus === "PAID" ? (
              <div
                className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <CheckCircle2 size={15} style={{ color: "#16a34a" }} />
                <span className="text-sm font-semibold" style={{ color: "#15803d" }}>
                  Betaling bekræftet
                </span>
              </div>
            ) : (
              <div
                className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}
              >
                <AlertCircle size={15} style={{ color: "#f97316" }} />
                <span className="text-sm font-semibold" style={{ color: "#c2410c" }}>
                  {PAYMENT_STATUS_LABELS[application.paymentStatus]}
                </span>
              </div>
            )}
          </SectionCard>

          {/* Generated documents */}
          <SectionCard
            title="Genererede dokumenter"
            icon={FileDown}
            action={
              <button
                onClick={handleGeneratePdfs}
                disabled={generating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 disabled:opacity-50"
                style={{ background: "#f8fafc", color: "#0f172a", border: "1px solid #e2e8f0" }}
              >
                <RefreshCw size={12} className={generating ? "animate-spin" : ""} />
                {generating ? "Genererer..." : "Generér igen"}
              </button>
            }
          >
            {generateError && (
              <p className="text-sm font-medium mb-3" style={{ color: "#dc2626" }}>
                {generateError}
              </p>
            )}
            {application.generatedPdfs.length === 0 ? (
              <div className="flex items-center gap-2 py-2">
                <AlertCircle size={15} style={{ color: "#f97316" }} />
                <p className="text-sm text-slate-500">
                  Ingen dokumenter genereret endnu. De dannes automatisk når betalingen er gennemført.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {application.generatedPdfs.map((pdf) => (
                  <li
                    key={pdf.id}
                    className="p-3 rounded-xl"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} style={{ color: "#0f172a" }} />
                      <p className="text-xs font-semibold text-slate-800 truncate flex-1">
                        {getPdfTypeLabel(pdf.type)}
                      </p>
                      {(pdf.sentToNotary || pdf.sentToLawyer) && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}
                        >
                          {pdf.sentToNotary && pdf.sentToLawyer
                            ? "Sendt til notar & advokat"
                            : pdf.sentToNotary
                              ? "Sendt til notar"
                              : "Sendt til advokat"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      {formatFileSize(pdf.size)} · {formatDateTime(pdf.generatedAt)}
                    </p>
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: "#e2e8f0", color: "#0f172a" }}
                    >
                      <Download size={11} /> Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Documents */}
          <SectionCard title="Dokumenter fra kunde" icon={FileText}>
            {application.documents.length === 0 ? (
              <div className="flex items-center gap-2 py-2">
                <AlertCircle size={15} style={{ color: "#f97316" }} />
                <p className="text-sm text-slate-500">Ingen dokumenter endnu.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {application.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="p-3 rounded-xl"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} style={{ color: "#0f172a" }} />
                      <p className="text-xs font-semibold text-slate-800 truncate flex-1">
                        {doc.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      {DOCUMENT_TYPE_LABELS[doc.type]} · {formatFileSize(doc.size)} · {formatDate(doc.uploadedAt)}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "#e2e8f0", color: "#0f172a" }}
                      >
                        <Eye size={11} /> Se
                      </a>
                      <a
                        href={doc.url}
                        download
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "#e2e8f0", color: "#0f172a" }}
                      >
                        <Download size={11} /> Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Admin notes */}
          <SectionCard title="Interne noter" icon={StickyNote}>
            <div className="flex flex-col gap-3 mb-4">
              {application.adminNotes.length === 0 ? (
                <p className="text-sm text-slate-400">Ingen interne noter endnu.</p>
              ) : (
                application.adminNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl"
                    style={{ background: "#fefce8", border: "1px solid #fde68a" }}
                  >
                    <p className="text-sm text-amber-900 leading-relaxed">{note.content}</p>
                    <p className="text-xs text-amber-600 mt-1.5">
                      {formatDateTime(note.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Tilføj intern note (kun admins kan se)..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all mb-3"
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
            {noteError && (
              <p className="text-sm font-medium mb-3" style={{ color: "#dc2626" }}>
                {noteError}
              </p>
            )}
            <button
              disabled={!adminNote.trim() || noteSaving}
              onClick={handleAddNote}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-40"
              style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" }}
            >
              <StickyNote size={14} />
              {noteSaving ? "Gemmer..." : "Tilføj note"}
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
