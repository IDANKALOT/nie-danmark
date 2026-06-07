"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Star,
  Quote,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Review } from "@prisma/client";

interface FormState {
  authorName: string;
  rating: number;
  content: string;
  source: string;
  featured: boolean;
  publishedAt: string;
}

function toDateInput(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

const EMPTY_FORM: FormState = {
  authorName: "",
  rating: 5,
  content: "",
  source: "internal",
  featured: false,
  publishedAt: toDateInput(new Date()),
};

function reviewToForm(review: Review): FormState {
  return {
    authorName: review.authorName,
    rating: review.rating,
    content: review.content,
    source: review.source,
    featured: review.featured,
    publishedAt: toDateInput(review.publishedAt),
  };
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#0f172a",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#94a3b8" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function StarRatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} stjerner`}
          className="transition-transform duration-100 hover:scale-110"
        >
          <Star
            size={22}
            fill={n <= value ? "#d4af37" : "none"}
            style={{ color: n <= value ? "#d4af37" : "#cbd5e1" }}
          />
        </button>
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Kunne ikke hente anmeldelser");
      const json = await res.json();
      setReviews(json.data ?? []);
    } catch {
      setError("Kunne ikke hente anmeldelser. Prøv at genindlæse siden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(review: Review) {
    setEditingId(review.id);
    setForm(reviewToForm(review));
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      authorName: form.authorName.trim(),
      rating: form.rating,
      content: form.content.trim(),
      source: form.source.trim() || "internal",
      featured: form.featured,
      publishedAt: new Date(form.publishedAt).toISOString(),
    };

    try {
      const url = editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Kunne ikke gemme anmeldelse");
      closeForm();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kunne ikke gemme anmeldelse");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(review: Review) {
    if (!window.confirm(`Er du sikker på, at du vil slette anmeldelsen fra ${review.authorName}?`)) return;
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Kunne ikke slette anmeldelse");
      }
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette anmeldelse");
    }
  }

  async function handleToggleFeatured(review: Review) {
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !review.featured }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Kunne ikke opdatere anmeldelse");
      setReviews((prev) => prev.map((r) => (r.id === review.id ? json.data : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke opdatere anmeldelse");
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Anmeldelser</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administrér de kundeanmeldelser, der vises på forsiden og pris-siden
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{ background: "linear-gradient(135deg, #d4af37, #f0c830)", color: "#0f172a" }}
        >
          <Plus size={16} />
          Tilføj anmeldelse
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
      ) : reviews.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
        >
          <p className="text-slate-500 text-sm">Ingen anmeldelser endnu. Tilføj den første ovenfor.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-4 sm:p-5 flex items-start gap-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(212,175,55,0.14)", color: "#a3791f" }}
              >
                <Quote size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-900">{review.authorName}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? "#d4af37" : "none"}
                        style={{ color: i < review.rating ? "#d4af37" : "#cbd5e1" }}
                      />
                    ))}
                  </div>
                  {review.featured && (
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: "rgba(212,175,55,0.14)", color: "#a3791f" }}
                    >
                      Fremhævet
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">{review.source}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-2">{review.content}</p>
                <p className="text-xs text-slate-400 mt-1.5">{formatDate(review.publishedAt)}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleFeatured(review)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                  style={{
                    background: review.featured ? "rgba(212,175,55,0.14)" : "#f8fafc",
                    color: review.featured ? "#a3791f" : "#475569",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {review.featured ? "Fremhævet" : "Fremhæv"}
                </button>
                <button
                  onClick={() => openEdit(review)}
                  aria-label={`Redigér anmeldelse fra ${review.authorName}`}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(review)}
                  aria-label={`Slet anmeldelse fra ${review.authorName}`}
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
                {editingId ? "Redigér anmeldelse" : "Tilføj anmeldelse"}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <Field label="Navn på anmelder">
                <input
                  required
                  value={form.authorName}
                  onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </Field>

              <Field label="Bedømmelse">
                <StarRatingPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
              </Field>

              <Field label="Anmeldelse">
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Kilde">
                  <input
                    value={form.source}
                    onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                    placeholder="internal, trustpilot, google..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Dato">
                  <input
                    type="date"
                    value={form.publishedAt}
                    onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-sm text-slate-700">Fremhæv på forsiden</span>
              </label>

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
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f0c830)", color: "#0f172a" }}
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? "Gem ændringer" : "Opret anmeldelse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
