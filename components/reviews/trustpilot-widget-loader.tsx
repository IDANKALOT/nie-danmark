"use client";

import { useEffect, useState } from "react";
import { TrustpilotWidget } from "./trustpilot-widget";
import type { Review } from "@prisma/client";

/**
 * Client-side data loader for `TrustpilotWidget` — fetches `/api/reviews`
 * so server-rendered pages (e.g. pricing) can show the trust-score widget
 * without depending on the database at build time.
 */
export function TrustpilotWidgetLoader({ className }: { className?: string }) {
  const [reviews, setReviews] = useState<Pick<Review, "rating">[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente anmeldelser");
        return res.json();
      })
      .then((json: { data: Pick<Review, "rating">[] }) => {
        if (!cancelled) setReviews(json.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return <TrustpilotWidget reviews={reviews} className={className} />;
}
