"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  UploadCloud,
  GripVertical,
  Mail,
  Phone,
} from "lucide-react";
import { getInitials, getTeamRoleLabel } from "@/lib/utils";
import type { TeamMember, TeamRole } from "@prisma/client";

const ROLES: { value: TeamRole; label: string }[] = [
  { value: "LAWYER", label: "Advokat" },
  { value: "NOTARY", label: "Notar" },
  { value: "ADVISOR", label: "Rådgiver" },
];

interface FormState {
  name: string;
  title: string;
  role: TeamRole;
  bio: string;
  photoUrl: string;
  certifications: string;
  email: string;
  phone: string;
  order: number;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  title: "",
  role: "ADVISOR",
  bio: "",
  photoUrl: "",
  certifications: "",
  email: "",
  phone: "",
  order: 0,
  active: true,
};

function memberToForm(member: TeamMember): FormState {
  return {
    name: member.name,
    title: member.title,
    role: member.role,
    bio: member.bio,
    photoUrl: member.photoUrl ?? "",
    certifications: member.certifications.join(", "),
    email: member.email ?? "",
    phone: member.phone ?? "",
    order: member.order,
    active: member.active,
  };
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#0f172a",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#94a3b8" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/team");
      if (!res.ok) throw new Error("Kunne ikke hente teammedlemmer");
      const json = await res.json();
      setMembers(json.data ?? []);
    } catch {
      setError("Kunne ikke hente teammedlemmer. Prøv at genindlæse siden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order: members.length });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(member: TeamMember) {
    setEditingId(member.id);
    setForm(memberToForm(member));
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    setFormError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload mislykkedes");
      setForm((f) => ({ ...f, photoUrl: json.url }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload mislykkedes");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      role: form.role,
      bio: form.bio.trim(),
      photoUrl: form.photoUrl.trim() || null,
      certifications: form.certifications
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      order: form.order,
      active: form.active,
    };

    try {
      const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Kunne ikke gemme teammedlem");
      closeForm();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kunne ikke gemme teammedlem");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(member: TeamMember) {
    if (!window.confirm(`Er du sikker på, at du vil slette ${member.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Kunne ikke slette teammedlem");
      }
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette teammedlem");
    }
  }

  async function handleToggleActive(member: TeamMember) {
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !member.active }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Kunne ikke opdatere status");
      setMembers((prev) => prev.map((m) => (m.id === member.id ? json.data : m)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke opdatere status");
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administrér advokater, notarer og rådgivere som vises på &quot;Om os&quot;-siden
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{ background: "linear-gradient(135deg, #d4af37, #f0c830)", color: "#0f172a" }}
        >
          <Plus size={16} />
          Tilføj teammedlem
        </button>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 mb-6 text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
        >
          <p className="text-slate-500 text-sm">Ingen teammedlemmer endnu. Tilføj det første ovenfor.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
            >
              <GripVertical size={16} className="flex-shrink-0 hidden sm:block" style={{ color: "#cbd5e1" }} />

              {member.photoUrl ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={member.photoUrl} alt={member.name} fill sizes="48px" className="object-cover" />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0f172a" }}
                >
                  {getInitials(member.name)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-900 truncate">{member.name}</p>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: "rgba(212,175,55,0.14)", color: "#a3791f" }}
                  >
                    {getTeamRoleLabel(member.role)}
                  </span>
                  {!member.active && (
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: "#f1f5f9", color: "#64748b" }}
                    >
                      Skjult
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{member.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  {member.email && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Mail size={11} /> {member.email}
                    </span>
                  )}
                  {member.phone && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Phone size={11} /> {member.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(member)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                  style={{
                    background: member.active ? "#f8fafc" : "rgba(212,175,55,0.14)",
                    color: member.active ? "#475569" : "#a3791f",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {member.active ? "Vis på siden" : "Skjult"}
                </button>
                <button
                  onClick={() => openEdit(member)}
                  aria-label={`Redigér ${member.name}`}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  aria-label={`Slet ${member.name}`}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150"
                  style={{ background: "#fef2f2", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(15,23,42,0.5)" }}
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg my-8"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? "Redigér teammedlem" : "Tilføj teammedlem"}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Navn">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Titel">
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="Rolle">
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as TeamRole }))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
                  style={inputStyle}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Bio">
                <textarea
                  required
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </Field>

              <Field label="Foto">
                <div className="flex items-center gap-3">
                  {form.photoUrl ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={form.photoUrl} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#f8fafc", border: "1px dashed #cbd5e1" }}
                    >
                      <UploadCloud size={16} style={{ color: "#94a3b8" }} />
                    </div>
                  )}
                  <label
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                    {uploading ? "Uploader..." : "Upload billede"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </Field>

              <Field label="Certificeringer (kommasepareret)">
                <input
                  value={form.certifications}
                  onChange={(e) => setForm((f) => ({ ...f, certifications: e.target.value }))}
                  placeholder="fx Spansk advokatbeskikkelse, EU-ret"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="E-mail (valgfri)">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Telefon (valgfri)">
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <Field label="Sortering (lavest først)">
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
                <label className="flex items-center gap-2 pb-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm text-slate-700">Vis på &quot;Om os&quot;-siden</span>
                </label>
              </div>

              {formError && (
                <div
                  className="rounded-xl px-4 py-2.5 text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#b91c1c", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}
                >
                  Annullér
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0c830)", color: "#0f172a" }}
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? "Gem ændringer" : "Opret teammedlem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
