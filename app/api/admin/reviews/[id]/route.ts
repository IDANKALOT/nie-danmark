import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 }) };
  }

  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Ingen adgang" }, { status: 403 }) };
  }

  return { session };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth_ = await requireAdmin();
  if (auth_.error) return auth_.error;

  const { id } = await params;

  const existing = await db.review.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Anmeldelse ikke fundet" }, { status: 404 });
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

  if (rating !== undefined && (typeof rating !== "number" || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: "Bedømmelse skal være mellem 1 og 5" }, { status: 400 });
  }

  const review = await db.review.update({
    where: { id },
    data: {
      ...(authorName !== undefined ? { authorName: authorName.trim() } : {}),
      ...(rating !== undefined ? { rating: Math.round(rating) } : {}),
      ...(content !== undefined ? { content: content.trim() } : {}),
      ...(source !== undefined ? { source: source.trim() || "internal" } : {}),
      ...(featured !== undefined ? { featured } : {}),
      ...(publishedAt !== undefined ? { publishedAt: new Date(publishedAt) } : {}),
    },
  });

  return NextResponse.json({ data: review, message: "Anmeldelse opdateret" });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth_ = await requireAdmin();
  if (auth_.error) return auth_.error;

  const { id } = await params;

  const existing = await db.review.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Anmeldelse ikke fundet" }, { status: 404 });
  }

  await db.review.delete({ where: { id } });

  return NextResponse.json({ message: "Anmeldelse slettet" });
}
