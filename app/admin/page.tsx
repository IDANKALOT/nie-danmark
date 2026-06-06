import Link from "next/link";
import {
  FileText,
  Users,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { getStatusLabel, getStatusColor, formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
import type { ApplicationStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Admin – Overblik",
};

const STATS = [
  {
    label: "Total ansøgninger",
    value: "142",
    change: "+12 denne uge",
    icon: FileText,
    trend: "up",
    color: "#0f172a",
  },
  {
    label: "Aktive sager",
    value: "38",
    change: "Under behandling",
    icon: Clock,
    trend: "neutral",
    color: "#d4af37",
  },
  {
    label: "Kunder",
    value: "129",
    change: "+8 denne måned",
    icon: Users,
    trend: "up",
    color: "#3b82f6",
  },
  {
    label: "Indtjening (mdr.)",
    value: "€6.300",
    change: "+€840 vs. forrige mdr.",
    icon: CreditCard,
    trend: "up",
    color: "#16a34a",
  },
];

const STATUS_COUNTS: { status: ApplicationStatus; count: number }[] = [
  { status: "RECEIVED", count: 8 },
  { status: "PROCESSING", count: 15 },
  { status: "AT_NOTARY", count: 7 },
  { status: "AT_LAWYER", count: 5 },
  { status: "AWAITING_CLIENT", count: 3 },
  { status: "COMPLETED", count: 100 },
  { status: "CANCELLED", count: 4 },
];

const RECENT_APPLICATIONS = [
  {
    id: "clx1a2b3c",
    fullName: "Lars Petersen",
    email: "lars.p@example.com",
    status: "PROCESSING" as ApplicationStatus,
    paymentStatus: "PAID",
    amount: 210,
    createdAt: new Date("2024-11-10"),
  },
  {
    id: "clx1a2b4d",
    fullName: "Mette Hansen",
    email: "mette.h@example.com",
    status: "RECEIVED" as ApplicationStatus,
    paymentStatus: "PAID",
    amount: 210,
    createdAt: new Date("2024-11-09"),
  },
  {
    id: "clx1a2b5e",
    fullName: "Søren Nielsen",
    email: "soeren.n@example.com",
    status: "AT_NOTARY" as ApplicationStatus,
    paymentStatus: "PAID",
    amount: 210,
    createdAt: new Date("2024-11-07"),
  },
  {
    id: "clx1a2b6f",
    fullName: "Anne Christensen",
    email: "anne.c@example.com",
    status: "COMPLETED" as ApplicationStatus,
    paymentStatus: "PAID",
    amount: 210,
    createdAt: new Date("2024-11-05"),
  },
  {
    id: "clx1a2b7g",
    fullName: "Peter Andersen",
    email: "peter.a@example.com",
    status: "AWAITING_CLIENT" as ApplicationStatus,
    paymentStatus: "PAID",
    amount: 210,
    createdAt: new Date("2024-11-03"),
  },
];

const RECENT_PAYMENTS = [
  { id: "p1", name: "Lars Petersen", amount: 210, createdAt: new Date("2024-11-10") },
  { id: "p2", name: "Mette Hansen", amount: 210, createdAt: new Date("2024-11-09") },
  { id: "p3", name: "Søren Nielsen", amount: 210, createdAt: new Date("2024-11-07") },
];

export default function AdminPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overblik</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administrationspanel for NIE Danmark
          </p>
        </div>
        <Link
          href="/admin/sager"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #d4af37, #f0c830)",
            color: "#0f172a",
          }}
        >
          <Plus size={16} />
          Ny sag
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}12` }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              {stat.trend === "up" && (
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} style={{ color: "#16a34a" }} />
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            <p className="text-xs font-medium mt-2" style={{ color: stat.trend === "up" ? "#16a34a" : "#94a3b8" }}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Status distribution */}
        <div
          className="lg:col-span-1 bg-white rounded-2xl p-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
        >
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Sager pr. status
          </h2>
          <div className="flex flex-col gap-3">
            {STATUS_COUNTS.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status, "badge")}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800 flex-shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent payments */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl p-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Seneste betalinger
            </h2>
            <Link
              href="/admin/betalinger"
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: "#d4af37" }}
            >
              Se alle <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {RECENT_PAYMENTS.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#0f172a", color: "#d4af37" }}
                  >
                    {payment.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{payment.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: "#16a34a" }} />
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(payment.amount, "EUR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent applications table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid #f1f5f9" }}>
          <h2 className="text-base font-bold text-slate-900">
            Seneste ansøgninger
          </h2>
          <Link
            href="/admin/sager"
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: "#d4af37" }}
          >
            Se alle sager <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Kunde", "E-mail", "Status", "Betaling", "Oprettet", ""].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#94a3b8" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_APPLICATIONS.map((app, i) => (
                <tr
                  key={app.id}
                  style={{ borderBottom: i < RECENT_APPLICATIONS.length - 1 ? "1px solid #f8fafc" : "none" }}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "#0f172a", color: "#d4af37" }}
                      >
                        {app.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {app.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{app.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status, "badge")}`}
                    >
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {app.paymentStatus === "PAID" ? (
                        <CheckCircle2 size={13} style={{ color: "#16a34a" }} />
                      ) : (
                        <AlertCircle size={13} style={{ color: "#f97316" }} />
                      )}
                      <span className="text-sm text-slate-700 font-medium">
                        {formatCurrency(app.amount, "EUR")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(app.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/sager/${app.id}`}
                      className="text-xs font-semibold flex items-center gap-1 transition-colors"
                      style={{ color: "#d4af37" }}
                    >
                      Se sag <ArrowRight size={11} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
