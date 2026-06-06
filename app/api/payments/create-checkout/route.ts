import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCheckoutSession } from "@/lib/stripe";

const createCheckoutSchema = z.object({
  applicationId: z.string().min(1, "Application ID er påkrævet"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { message: "Du skal være logget ind for at betale" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const parsed = createCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Ugyldigt application ID" },
        { status: 400 }
      );
    }

    const { applicationId } = parsed.data;

    // Verify the application belongs to the current user
    const application = await db.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        userId: true,
        paymentStatus: true,
        payment: { select: { id: true } },
      },
    });

    if (!application) {
      return NextResponse.json(
        { message: "Ansøgning ikke fundet" },
        { status: 404 }
      );
    }

    if (application.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Du har ikke adgang til denne ansøgning" },
        { status: 403 }
      );
    }

    if (application.paymentStatus === "PAID") {
      return NextResponse.json(
        { message: "Denne ansøgning er allerede betalt" },
        { status: 409 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession(
      applicationId,
      session.user.id,
      session.user.email
    );

    if (!checkoutSession.url) {
      return NextResponse.json(
        { message: "Betalingslink kunne ikke oprettes. Prøv igen." },
        { status: 500 }
      );
    }

    // Record pending payment in DB
    await db.payment.upsert({
      where: { applicationId },
      update: { stripeSessionId: checkoutSession.id, status: "PENDING" },
      create: {
        applicationId,
        stripeSessionId: checkoutSession.id,
        amount: 21000, // 210 EUR in cents
        currency: "EUR",
        status: "PENDING",
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[payments/create-checkout] Error:", error);
    return NextResponse.json(
      { message: "Der opstod en fejl ved oprettelse af betaling. Prøv igen." },
      { status: 500 }
    );
  }
}
