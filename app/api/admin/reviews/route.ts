import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ingen adgang" }, { status: 403 });
  }

  const reviews = await db.review.findMany({ orderBy: { publishedAt: "desc" } });

  return NextResponse.json({ data: reviews });
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ingen adgang" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldigt request body" }, { status: 400 });
  }

  const { authorName, rating, content, source, featured, publishedAt } = body as {
    authorName?: string;
    rating?: number;
    content?: string;
    source?: string;
    featured?: boolean;
    publishedAt?: string;
  };

  if (!authorName?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Navn og anmeldelse er påkrævet" }, { status: 400 });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Bedømmelse skal være mellem 1 og 5" }, { status: 400 });
  }

  const review = await db.review.create({
    data: {
      authorName: authorName.trim(),
      rating: Math.round(rating),
      content: content.trim(),
      source: source?.trim() || "internal",
      featured: typeof featured === "boolean" ? featured : false,
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
    },
  });

  return NextResponse.json({ data: review, message: "Anmeldelse oprettet" }, { status: 201 });
}
