"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { Review } from "@prisma/client";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const stagger = (i: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.08 },
  },
});

const SOURCE_LABELS: Record<string, string> = {
  trustpilot: "Trustpilot",
  google: "Google",
  internal: "NIE Danmark",
};

function getSourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}

interface ReviewWithStringDate extends Omit<Review, "publishedAt" | "createdAt"> {
  publishedAt: string;
  createdAt: string;
}

/**
 * Client-side carousel/grid of featured, DB-backed reviews — replaces the
 * homepage's old hardcoded testimonials. Fetches `/api/reviews?featured=true`
 * and renders cards matching the visual style of the original
 * `TestimonialsSection` (author initials avatar, stars, quote, source badge).
 */
export function ReviewsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [reviews, setReviews] = useState<ReviewWithStringDate[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/reviews?featured=true")
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente anmeldelser");
        return res.json();
      })
      .then((json: { data: ReviewWithStringDate[] }) => {
        if (!cancelled) setReviews(json.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Loading skeleton
  if (reviews === null && !error) {
    return (
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-7 h-64 animate-pulse"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.07)",
            }}
          >
            <div className="h-4 w-24 rounded mb-6" style={{ background: "rgba(15,23,42,0.06)" }} />
            <div className="h-3 w-full rounded mb-2" style={{ background: "rgba(15,23,42,0.05)" }} />
            <div className="h-3 w-5/6 rounded mb-2" style={{ background: "rgba(15,23,42,0.05)" }} />
            <div className="h-3 w-2/3 rounded" style={{ background: "rgba(15,23,42,0.05)" }} />
          </div>
        ))}
      </div>
    );
  }

  // Nothing to show — fail gracefully without rendering stale/fake data
  if (error || !reviews || reviews.length === 0) {
    return null;
  }

  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        className="flex items-center justify-center gap-2 mb-10"
      >
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={18}
              style={{ color: "#d4af37" }}
              fill={s <= Math.round(average) ? "#d4af37" : "none"}
              strokeWidth={s <= Math.round(average) ? 0 : 1.5}
            />
          ))}
        </div>
        <span className="text-base font-bold" style={{ color: "#0f172a" }}>
          {average.toFixed(1)} ud af 5
        </span>
        <span className="text-sm" style={{ color: "rgba(15,23,42,0.5)" }}>
          ({reviews.length} {reviews.length === 1 ? "anmeldelse" : "anmeldelser"})
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger(i)}
            className="rounded-2xl p-7 flex flex-col"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.07)",
              boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
            }}
          >
            {/* Stars + source badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <Star key={s} size={16} style={{ color: "#d4af37" }} fill="#d4af37" />
                ))}
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.55)" }}
              >
                {getSourceLabel(r.source)}
              </span>
            </div>

            {/* Quote */}
            <blockquote
              className="text-sm leading-relaxed mb-6 flex-1"
              style={{ color: "rgba(15,23,42,0.75)" }}
            >
              &ldquo;{r.content}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-5" style={{ borderTop: "1px solid rgba(15,23,42,0.07)" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #0f172a, #162c87)",
                  color: "#d4af37",
                }}
              >
                {getInitials(r.authorName)}
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: "#0f172a" }}>
                  {r.authorName}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
