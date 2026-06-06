import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendApplicationUpdateEmail } from "@/lib/email";
import type { ApplicationStatus } from "@prisma/client";

const patchSchema = z.object({
  status: z.enum([
    "RECEIVED",
    "PROCESSING",
    "AT_NOTARY",
    "AT_LAWYER",
    "AWAITING_CLIENT",
    "COMPLETED",
    "CANCELLED",
  ] as const),
  note: z.string().max(1000).optional(),
});

type Context = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  ctx: Context
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Du skal være logget ind" },
        { status: 401 }
      );
    }

    const { id } = await ctx.params;

    const application = await db.application.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: { uploadedAt: "asc" },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        payment: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { message: "Ansøgning ikke fundet" },
        { status: 404 }
      );
    }

    // Only the owner or an admin can view the application
    const isOwner = application.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Du har ikke adgang til denne ansøgning" },
        { status: 403 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("[applications/[id]/GET] Error:", error);
    return NextResponse.json(
      { message: "Kunne ikke hente ansøgning" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: Context
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Du skal være logget ind" },
        { status: 401 }
      );
    }

    // Only admins can update application status
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Kun administratorer kan opdatere ansøgningsstatus" },
        { status: 403 }
      );
    }

    const { id } = await ctx.params;
    const body: unknown = await request.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { message: firstError?.message ?? "Ugyldige oplysninger" },
        { status: 400 }
      );
    }

    const { status, note } = parsed.data;

    // Check the application exists
    const existing = await db.application.findUnique({
      where: { id },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Ansøgning ikke fundet" },
        { status: 404 }
      );
    }

    // Update application and add status history in a transaction
    const updated = await db.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id },
        data: { status: status as ApplicationStatus },
      });

      await tx.statusHistory.create({
        data: {
          applicationId: id,
          status: status as ApplicationStatus,
          note,
          changedBy: session.user!.id,
        },
      });

      return app;
    });

    // Send status update email (non-blocking)
    if (existing.user?.email) {
      sendApplicationUpdateEmail(
        existing.user.email,
        existing.user.name ?? "Kunde",
        status as ApplicationStatus,
        note
      ).catch((err: unknown) => {
        console.error("[applications/[id]/PATCH] Failed to send email:", err);
      });
    }

    return NextResponse.json({
      application: updated,
      message: "Status opdateret",
    });
  } catch (error) {
    console.error("[applications/[id]/PATCH] Error:", error);
    return NextResponse.json(
      { message: "Kunne ikke opdatere ansøgning" },
      { status: 500 }
    );
  }
}
