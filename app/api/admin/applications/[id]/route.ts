import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApplicationStatus } from "@prisma/client";

const VALID_STATUSES: ApplicationStatus[] = [
  "RECEIVED",
  "PROCESSING",
  "AT_NOTARY",
  "AT_LAWYER",
  "AWAITING_CLIENT",
  "COMPLETED",
  "CANCELLED",
];

export async function GET(
  _req: NextRequest,
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

  const application = await db.application.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      },
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
      statusHistory: {
        orderBy: { createdAt: "asc" },
      },
      messages: {
        include: {
          user: {
            select: { id: true, name: true, image: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      adminNotes: {
        orderBy: { createdAt: "desc" },
      },
      payment: true,
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Sag ikke fundet" }, { status: 404 });
  }

  return NextResponse.json({ data: application });
}

export async function PATCH(
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

  const { status, note, adminNote } = body as {
    status?: ApplicationStatus;
    note?: string;
    adminNote?: string;
  };

  // Validate status if provided
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Ugyldig status. Gyldige værdier: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  // Run status update and optional admin note in a transaction
  const [updatedApplication] = await db.$transaction(async (tx) => {
    const updates: Promise<unknown>[] = [];

    // Update application status
    const appUpdate = tx.application.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status } : {}),
      },
    });
    updates.push(appUpdate);

    // Record status history if status changed
    if (status !== undefined && status !== application.status) {
      updates.push(
        tx.statusHistory.create({
          data: {
            applicationId: id,
            status,
            note: typeof note === "string" && note.trim() ? note.trim() : undefined,
            changedBy: session.user.id,
          },
        })
      );
    }

    // Add admin note if provided
    if (typeof adminNote === "string" && adminNote.trim()) {
      updates.push(
        tx.adminNote.create({
          data: {
            applicationId: id,
            content: adminNote.trim(),
            createdBy: session.user.id,
          },
        })
      );
    }

    return Promise.all(updates);
  });

  return NextResponse.json({
    data: updatedApplication,
    message: "Sag opdateret",
  });
}
