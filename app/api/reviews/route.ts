import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Public endpoint serving published reviews — backs the self-hosted
 * Trustpilot-style widgets (`ReviewsCarousel`, `TrustpilotWidget`) until a
 * real Trustpilot Business account is connected.
 *
 * `?featured=true` restricts to reviews curated for homepage display.
 */
export async function GET(req: NextRequest) {
  const featured = req.nextUrl.searchParams.get("featured") === "true";

  const reviews = await db.review.findMany({
    where: featured ? { featured: true } : undefined,
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ data: reviews });
}
