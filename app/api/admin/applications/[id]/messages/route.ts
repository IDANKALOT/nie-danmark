import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Lets an admin send a message to the customer on a case's message thread.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ingen adgang" }, { status: 403 });
  }

  const { id } = await params;

  const application = await db.application.findUnique({ where: { id } });

  if (!application) {
    return NextResponse.json({ error: "Sag ikke fundet" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldigt request body" }, { status: 400 });
  }

  const { content } = body as { content?: string };

  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Besked må ikke være tom" }, { status: 400 });
  }

  const message = await db.message.create({
    data: {
      applicationId: id,
      userId: session.user.id,
      content: content.trim(),
      isFromAdmin: true,
    },
    include: {
      user: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  return NextResponse.json({ data: message, message: "Besked sendt" }, { status: 201 });
}
