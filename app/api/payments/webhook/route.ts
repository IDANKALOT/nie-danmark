import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { constructWebhookEvent } from "@/lib/stripe";
import {
  sendPaymentConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/lib/email";
import type Stripe from "stripe";

// Stripe requires the raw body — disable Next.js body parsing
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { message: "Manglende Stripe signatur" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = await constructWebhookEvent(rawBody, signature);
    } catch (err) {
      console.error("[webhook] Signature verification failed:", err);
      return NextResponse.json(
        { message: "Ugyldig webhook signatur" },
        { status: 400 }
      );
    }

    // Handle supported events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(intent);
        break;
      }

      default:
        // Unhandled event type — log and return 200
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] Unhandled error:", error);
    return NextResponse.json(
      { message: "Intern webhook fejl" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const applicationId = session.metadata?.applicationId;
  const userId = session.metadata?.userId;

  if (!applicationId || !userId) {
    console.error("[webhook] Missing metadata on checkout session:", session.id);
    return;
  }

  try {
    // Update payment record and application status in a transaction
    const application = await db.$transaction(async (tx) => {
      // Update the payment record
      await tx.payment.update({
        where: { applicationId },
        data: {
          status: "PAID",
          stripePaymentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
        },
      });

      // Update application payment status and overall status
      const app = await tx.application.update({
        where: { id: applicationId },
        data: {
          paymentStatus: "PAID",
          paymentId: session.payment_intent as string | null,
          status: "PROCESSING",
        },
        include: {
          user: { select: { email: true, name: true } },
        },
      });

      // Record status change
      await tx.statusHistory.create({
        data: {
          applicationId,
          status: "PROCESSING",
          note: "Betaling modtaget — ansøgning sendt til behandling",
          changedBy: "SYSTEM",
        },
      });

      return app;
    });

    // Send confirmation email to customer (non-blocking)
    if (application.user?.email) {
      sendPaymentConfirmationEmail(
        application.user.email,
        application.user.name ?? "Kunde",
        applicationId
      ).catch((err: unknown) => {
        console.error("[webhook] Failed to send payment confirmation email:", err);
      });
    }

    // Send admin notification (non-blocking)
    sendAdminNotificationEmail({
      id: applicationId,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      passportNumber: application.passportNumber,
      country: application.country,
      createdAt: application.createdAt,
    }).catch((err: unknown) => {
      console.error("[webhook] Failed to send admin notification:", err);
    });

    console.log(
      `[webhook] Successfully processed payment for application: ${applicationId}`
    );
  } catch (error) {
    console.error(
      `[webhook] Failed to process payment for application ${applicationId}:`,
      error
    );
    throw error;
  }
}

async function handlePaymentFailed(
  intent: Stripe.PaymentIntent
): Promise<void> {
  const applicationId = intent.metadata?.applicationId;
  if (!applicationId) return;

  try {
    await db.payment.updateMany({
      where: { applicationId },
      data: { status: "FAILED" },
    });

    await db.application.update({
      where: { id: applicationId },
      data: { paymentStatus: "FAILED" },
    });

    console.log(
      `[webhook] Payment failed for application: ${applicationId}`
    );
  } catch (error) {
    console.error(
      `[webhook] Failed to handle payment failure for ${applicationId}:`,
      error
    );
  }
}
