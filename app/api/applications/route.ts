import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendAdminNotificationEmail } from "@/lib/email";

const createApplicationSchema = z.object({
  fullName: z.string().min(2, "Navn for kort"),
  dateOfBirth: z.string().min(1, "Fødselsdato er påkrævet"),
  passportNumber: z.string().min(5, "Ugyldigt pasnummer"),
  email: z.string().email("Ugyldig email"),
  phone: z.string().min(8, "Ugyldigt telefonnummer"),
  address: z.string().min(5, "Adresse for kort"),
  city: z.string().min(2, "By er påkrævet"),
  postalCode: z.string().min(4, "Ugyldigt postnummer"),
  country: z.string().min(1, "Land er påkrævet"),
  documents: z
    .array(
      z.object({
        url: z.string().url(),
        name: z.string(),
        type: z.enum(["PASSPORT", "PROOF_OF_ADDRESS", "OTHER"]),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Du skal være logget ind for at indsende en ansøgning" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { message: firstError?.message ?? "Ugyldige oplysninger" },
        { status: 400 }
      );
    }

    const { documents, dateOfBirth, ...applicationData } = parsed.data;

    // Parse date of birth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return NextResponse.json(
        { message: "Ugyldig fødselsdato" },
        { status: 400 }
      );
    }

    // Create application with documents in a transaction
    const application = await db.$transaction(async (tx) => {
      const app = await tx.application.create({
        data: {
          ...applicationData,
          dateOfBirth: dob,
          userId: session.user!.id,
          status: "RECEIVED",
          paymentStatus: "PENDING",
          currency: "EUR",
          amount: 210,
        },
      });

      // Create status history entry
      await tx.statusHistory.create({
        data: {
          applicationId: app.id,
          status: "RECEIVED",
          note: "Ansøgning modtaget",
          changedBy: session.user!.id,
        },
      });

      // Create document records
      if (documents && documents.length > 0) {
        const mimeMap: Record<string, string> = {
          ".pdf": "application/pdf",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
        };

        await tx.document.createMany({
          data: documents.map((doc) => {
            const ext = doc.name.slice(doc.name.lastIndexOf(".")).toLowerCase();
            return {
              applicationId: app.id,
              name: doc.name,
              type: doc.type,
              url: doc.url,
              size: 0, // size not tracked at this point
              mimeType: mimeMap[ext] ?? "application/octet-stream",
            };
          }),
        });
      }

      return app;
    });

    // Notify admin (non-blocking)
    sendAdminNotificationEmail({
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      passportNumber: application.passportNumber,
      country: application.country,
      createdAt: application.createdAt,
    }).catch((err: unknown) => {
      console.error("[applications] Failed to send admin notification:", err);
    });

    return NextResponse.json(
      { applicationId: application.id, message: "Ansøgning oprettet" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[applications/POST] Error:", error);
    return NextResponse.json(
      { message: "Der opstod en intern fejl. Prøv igen." },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Du skal være logget ind" },
        { status: 401 }
      );
    }

    const applications = await db.application.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        amount: true,
        currency: true,
        documents: {
          select: { id: true, name: true, type: true, uploadedAt: true },
        },
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("[applications/GET] Error:", error);
    return NextResponse.json(
      { message: "Kunne ikke hente ansøgninger" },
      { status: 500 }
    );
  }
}
