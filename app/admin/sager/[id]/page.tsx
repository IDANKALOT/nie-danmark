"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
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
} from "lucide-react";
import {
  getStatusLabel,
  getStatusColor,
  formatDate,
  formatDateTime,
  formatCurrency,
} from "@/lib/utils";
import type { ApplicationStatus } from "@prisma/client";

const ALL_STATUSES: ApplicationStatus[] = [
  "RECEIVED",
  "PROCESSING",
  "AT_NOTARY",
  "AT_LAWYER",
  "AWAITING_CLIENT",
  "COMPLETED",
  "CANCELLED",
];

const MOCK_APPLICATION = {
  id: "clx001",
  status: "PROCESSING" as ApplicationStatus,
  fullName: "Lars Petersen",
  email: "lars.p@example.com",
  phone: "+45 22 33 44 55",
  dateOfBirth: new Date("1979-07-22"),
  passportNumber: "DK9876543",
  address: "Nørrebrogade 12, 3. tv.",
  city: "København N",
  postalCode: "2200",
  country: "Danmark",
  createdAt: new Date("2024-11-10T09:15:00"),
  amount: 210,
  currency: "EUR",
  paymentStatus: "PAID",
};

const MOCK_STATUS_HISTORY = [
  {
    id: "sh1",
    status: "RECEIVED" as ApplicationStatus,
    note: "Ansøgning modtaget og registreret.",
    changedBy: "System",
    createdAt: new Date("2024-11-10T09:15:00"),
  },
  {
    id: "sh2",
    status: "PROCESSING" as ApplicationStatus,
    note: "Dokumenter gennemgået. Pas er godkendt. Afventer adressebevis.",
    changedBy: "Maria (Admin)",
    createdAt: new Date("2024-11-11T14:30:00"),
  },
];

const MOCK_DOCUMENTS = [
  {
    id: "d1",
    name: "pas_lars_petersen.pdf",
    type: "Pas",
    uploadedAt: new Date("2024-11-10T09:20:00"),
    size: 1456789,
  },
];

const MOCK_MESSAGES = [
  {
    id: "m1",
    content: "Hej Lars, vi har modtaget din ansøgning og er ved at gennemgå dine dokumenter. Vi vender tilbage snarest.",
    isFromAdmin: true,
    sender: "NIE Danmark team",
    createdAt: new Date("2024-11-11T14:35:00"),
  },
  {
    id: "m2",
    content: "Hej, tak for det! Hvornår forventer I at afsende ansøgningen til Spanien?",
    isFromAdmin: false,
    sender: "Lars Petersen",
    createdAt: new Date("2024-11-11T16:00:00"),
  },
];

const MOCK_ADMIN_NOTES = [
  {
    id: "an1",
    content: "Pas kontrolleret og verificeret. Se efter adressebevis der er max 3 mdr. gammelt.",
    createdBy: "Maria (Admin)",
    createdAt: new Date("2024-11-11T14:28:00"),
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

export default function AdminSagDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(
    MOCK_APPLICATION.status
  );
  const [statusNote, setStatusNote] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [adminNotes, setAdminNotes] = useState(MOCK_ADMIN_NOTES);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [statusHistory, setStatusHistory] = useState(MOCK_STATUS_HISTORY);
  const [statusSaved, setStatusSaved] = useState(false);

  const handleStatusUpdate = () => {
    const newEntry = {
      id: `sh${Date.now()}`,
      status: currentStatus,
      note: statusNote || `Status ændret til ${getStatusLabel(currentStatus)}`,
      changedBy: "Admin",
      createdAt: new Date(),
    };
    setStatusHistory((prev) => [...prev, newEntry]);
    setStatusNote("");
    setStatusSaved(true);
    setTimeout(() => setStatusSaved(false), 3000);
  };

  const handleAddNote = () => {
    if (!adminNote.trim()) return;
    setAdminNotes((prev) => [
      ...prev,
      {
        id: `an${Date.now()}`,
        content: adminNote,
        createdBy: "Admin",
        createdAt: new Date(),
      },
    ]);
    setAdminNote("");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        content: message,
        isFromAdmin: true,
        sender: "NIE Danmark team",
        createdAt: new Date(),
      },
    ]);
    setMessage("");
  };

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
            <h1 className="text-2xl font-bold text-slate-900">
              {MOCK_APPLICATION.fullName}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-mono">
              ID: {id.toUpperCase()}
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
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStatusUpdate}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #f0c830)",
                    color: "#0f172a",
                  }}
                >
                  <Save size={15} />
                  Gem status
                </button>
                {statusSaved && (
                  <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#16a34a" }}>
                    <CheckCircle2 size={15} />
                    Gemt!
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Personal info */}
          <SectionCard title="Personoplysninger" icon={User}>
            <dl className="divide-y divide-slate-50">
              <InfoRow label="Fuldt navn" value={MOCK_APPLICATION.fullName} />
              <InfoRow label="E-mail" value={MOCK_APPLICATION.email} />
              <InfoRow label="Telefon" value={MOCK_APPLICATION.phone} />
              <InfoRow label="Fødselsdato" value={formatDate(MOCK_APPLICATION.dateOfBirth)} />
              <InfoRow label="Pasnummer" value={MOCK_APPLICATION.passportNumber} />
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
              {statusHistory.map((entry, i) => {
                const isLast = i === statusHistory.length - 1;
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
          <SectionCard title="Beskedtråd med kunde" icon={FileText}>
            <div className="flex flex-col gap-3 mb-4 max-h-72 overflow-y-auto pr-1">
              {messages.map((msg) => (
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
                      {msg.sender}
                    </p>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-2 opacity-50">{formatDateTime(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
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
                disabled={!message.trim()}
                onClick={handleSendMessage}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 flex-shrink-0 mb-0.5 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #d4af37, #f0c830)", color: "#0f172a" }}
              >
                <Send size={16} />
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Payment */}
          <SectionCard title="Betaling" icon={CreditCard}>
            <dl className="divide-y divide-slate-50">
              <InfoRow label="Beløb" value={formatCurrency(MOCK_APPLICATION.amount, MOCK_APPLICATION.currency)} />
              <InfoRow label="Valuta" value={MOCK_APPLICATION.currency} />
              <InfoRow label="Status" value="Betalt" />
              <InfoRow label="Oprettet" value={formatDate(MOCK_APPLICATION.createdAt)} />
            </dl>
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <CheckCircle2 size={15} style={{ color: "#16a34a" }} />
              <span className="text-sm font-semibold" style={{ color: "#15803d" }}>
                Betaling bekræftet
              </span>
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard title="Dokumenter" icon={FileText}>
            {MOCK_DOCUMENTS.length === 0 ? (
              <div className="flex items-center gap-2 py-2">
                <AlertCircle size={15} style={{ color: "#f97316" }} />
                <p className="text-sm text-slate-500">Ingen dokumenter endnu.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {MOCK_DOCUMENTS.map((doc) => (
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
                      {doc.type} · {formatFileSize(doc.size)} · {formatDate(doc.uploadedAt)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "#e2e8f0", color: "#0f172a" }}
                      >
                        <Eye size={11} /> Se
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "#e2e8f0", color: "#0f172a" }}
                      >
                        <Download size={11} /> Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Admin notes */}
          <SectionCard title="Interne noter" icon={StickyNote}>
            <div className="flex flex-col gap-3 mb-4">
              {adminNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-xl"
                  style={{ background: "#fefce8", border: "1px solid #fde68a" }}
                >
                  <p className="text-xs font-semibold text-amber-700 mb-1">
                    {note.createdBy}
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {note.content}
                  </p>
                  <p className="text-xs text-amber-600 mt-1.5">
                    {formatDateTime(note.createdAt)}
                  </p>
                </div>
              ))}
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
            <button
              disabled={!adminNote.trim()}
              onClick={handleAddNote}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-40"
              style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" }}
            >
              <StickyNote size={14} />
              Tilføj note
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
