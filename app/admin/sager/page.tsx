"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { getStatusLabel, getStatusColor, formatDate, formatCurrency } from "@/lib/utils";
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

interface Application {
  id: string;
  fullName: string;
  email: string;
  status: ApplicationStatus;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  amount: number;
  createdAt: Date;
}

const MOCK_APPLICATIONS: Application[] = [
  { id: "clx001", fullName: "Lars Petersen", email: "lars.p@example.com", status: "PROCESSING", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-11-10") },
  { id: "clx002", fullName: "Mette Hansen", email: "mette.h@example.com", status: "RECEIVED", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-11-09") },
  { id: "clx003", fullName: "Søren Nielsen", email: "soeren.n@example.com", status: "AT_NOTARY", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-11-07") },
  { id: "clx004", fullName: "Anne Christensen", email: "anne.c@example.com", status: "COMPLETED", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-11-05") },
  { id: "clx005", fullName: "Peter Andersen", email: "peter.a@example.com", status: "AWAITING_CLIENT", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-11-03") },
  { id: "clx006", fullName: "Hanne Larsen", email: "hanne.l@example.com", status: "AT_LAWYER", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-11-01") },
  { id: "clx007", fullName: "Thomas Møller", email: "thomas.m@example.com", status: "PROCESSING", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-10-30") },
  { id: "clx008", fullName: "Kirsten Jensen", email: "kirsten.j@example.com", status: "CANCELLED", paymentStatus: "FAILED", amount: 210, createdAt: new Date("2024-10-28") },
  { id: "clx009", fullName: "Mikael Olsen", email: "mikael.o@example.com", status: "COMPLETED", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-10-25") },
  { id: "clx010", fullName: "Britta Schmidt", email: "britta.s@example.com", status: "RECEIVED", paymentStatus: "PAID", amount: 210, createdAt: new Date("2024-10-22") },
];

type SortField = "fullName" | "status" | "paymentStatus" | "createdAt";
type SortDir = "asc" | "desc";

function exportToCSV(data: Application[]) {
  const headers = ["ID", "Navn", "Email", "Status", "Betaling", "Beløb", "Oprettet"];
  const rows = data.map((a) => [
    a.id,
    a.fullName,
    a.email,
    getStatusLabel(a.status),
    a.paymentStatus,
    a.amount,
    formatDate(a.createdAt),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nie-sager.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminSagerPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...MOCK_APPLICATIONS];

    if (statusFilter !== "ALL") {
      data = data.filter((a) => a.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      let cmp = 0;
      if (sortField === "fullName") cmp = a.fullName.localeCompare(b.fullName, "da");
      if (sortField === "status") cmp = a.status.localeCompare(b.status);
      if (sortField === "paymentStatus") cmp = a.paymentStatus.localeCompare(b.paymentStatus);
      if (sortField === "createdAt") cmp = a.createdAt.getTime() - b.createdAt.getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [search, statusFilter, sortField, sortDir]);

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="ml-1" style={{ color: "#d4af37" }} />
    ) : (
      <ChevronDown size={12} className="ml-1" style={{ color: "#d4af37" }} />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sager</h1>
          <p className="text-slate-500 text-sm mt-1">
            {filtered.length} sager fundet
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border"
          style={{
            color: "#0f172a",
            borderColor: "#e2e8f0",
            background: "#fff",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fff";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
          }}
        >
          <Download size={15} />
          Eksporter CSV
        </button>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#94a3b8" }}
          />
          <input
            type="text"
            placeholder="Søg på navn, e-mail eller ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
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

        {/* Status filter */}
        <div className="relative flex items-center gap-2">
          <Filter size={15} style={{ color: "#94a3b8" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "ALL")}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer transition-all"
            style={{
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#0f172a",
              minWidth: 180,
            }}
          >
            <option value="ALL">Alle statusser</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {getStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <th
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none"
                  style={{ color: "#94a3b8" }}
                  onClick={() => handleSort("fullName")}
                >
                  <span className="flex items-center">
                    Kundenavn <SortIcon field="fullName" />
                  </span>
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                  E-mail
                </th>
                <th
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none"
                  style={{ color: "#94a3b8" }}
                  onClick={() => handleSort("status")}
                >
                  <span className="flex items-center">
                    Status <SortIcon field="status" />
                  </span>
                </th>
                <th
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none"
                  style={{ color: "#94a3b8" }}
                  onClick={() => handleSort("paymentStatus")}
                >
                  <span className="flex items-center">
                    Betaling <SortIcon field="paymentStatus" />
                  </span>
                </th>
                <th
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none"
                  style={{ color: "#94a3b8" }}
                  onClick={() => handleSort("createdAt")}
                >
                  <span className="flex items-center">
                    Oprettet <SortIcon field="createdAt" />
                  </span>
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                  Handlinger
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    Ingen sager matcher din søgning.
                  </td>
                </tr>
              ) : (
                filtered.map((app, i) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #f8fafc" : "none",
                      cursor: "pointer",
                    }}
                    className="transition-colors"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "#0f172a", color: "#d4af37" }}
                        >
                          {app.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{app.fullName}</p>
                          <p className="text-xs text-slate-400 font-mono">{app.id}</p>
                        </div>
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
                        <span className="text-sm text-slate-700">
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
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
                        style={{
                          background: "#f8fafc",
                          color: "#0f172a",
                          border: "1px solid #e2e8f0",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.background =
                            "linear-gradient(135deg, #d4af37, #f0c830)";
                          (e.currentTarget as HTMLAnchorElement).style.borderColor =
                            "transparent";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.background = "#f8fafc";
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0";
                        }}
                      >
                        Åbn <ArrowRight size={11} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
