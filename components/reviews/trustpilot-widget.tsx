import Script from "next/script";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Review } from "@prisma/client";

interface TrustpilotWidgetProps {
  reviews: Pick<Review, "rating">[];
  className?: string;
}

const TRUSTPILOT_EMBED_ENABLED = process.env.NEXT_PUBLIC_TRUSTPILOT_EMBED === "true";
const TRUSTPILOT_BUSINESS_UNIT_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID || "";

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          style={{ color: "#d4af37" }}
          fill={s <= Math.round(rating) ? "#d4af37" : "none"}
          strokeWidth={s <= Math.round(rating) ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

/**
 * Compact trust-score summary widget.
 *
 * When NEXT_PUBLIC_TRUSTPILOT_EMBED="true" and a business-unit-id is configured,
 * renders Trustpilot's real micro-widget embed (loader script + data attributes).
 * Otherwise falls back to a self-hosted widget computed from our own `Review` rows
 * — so the real embed can be swapped in later with zero rework.
 */
export function TrustpilotWidget({ reviews, className }: TrustpilotWidgetProps) {
  if (TRUSTPILOT_EMBED_ENABLED && TRUSTPILOT_BUSINESS_UNIT_ID) {
    return (
      <div className={className}>
        <Script
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
        <div
          className="trustpilot-widget"
          data-locale="da-DK"
          data-template-id="5419b6ffb0d04a076446a9af"
          data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
          data-style-height="20px"
          data-style-width="100%"
          data-theme="light"
        >
          <a
            href="https://dk.trustpilot.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0f172a" }}
          >
            Trustpilot
          </a>
        </div>
      </div>
    );
  }

  const total = reviews.length;
  const average =
    total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  if (total === 0) {
    return null;
  }

  return (
    <div
      className={className ? className : undefined}
      style={{
        background: "#ffffff",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-6 p-6">
        {/* Average score */}
        <div className="flex flex-col items-center justify-center sm:border-r sm:pr-6" style={{ borderColor: "rgba(15,23,42,0.08)" }}>
          <span
            className="text-3xl font-bold leading-none"
            style={{ color: "#0f172a" }}
          >
            {average.toFixed(1)}
          </span>
          <span className="text-xs mt-1.5" style={{ color: "rgba(15,23,42,0.45)" }}>
            ud af 5
          </span>
        </div>

        {/* Stars + count + CTA */}
        <div className="flex flex-col items-center sm:items-start justify-center gap-1.5 flex-1">
          <StarRow rating={average} />
          <p className="text-sm" style={{ color: "rgba(15,23,42,0.6)" }}>
            Baseret på{" "}
            <span className="font-semibold" style={{ color: "#0f172a" }}>
              {total} {total === 1 ? "anmeldelse" : "anmeldelser"}
            </span>
          </p>
          <Link
            href="/#anmeldelser"
            className="text-xs font-semibold mt-1 inline-flex items-center gap-1 transition-colors"
            style={{ color: "#a3791f" }}
          >
            Se anmeldelser →
          </Link>
        </div>
      </div>
    </div>
  );
}
