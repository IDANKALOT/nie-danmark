import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
  }
  return _stripe;
}

const NIE_PRICE_CENTS = 21000;
const NIE_CURRENCY = "eur";

export async function createCheckoutSession(
  applicationId: string,
  userId: string,
  email: string
): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [{
      price_data: {
        currency: NIE_CURRENCY,
        product_data: {
          name: "NIE Danmark – NIE Ansøgning",
          description: "Professionel hjælp til at ansøge om spansk NIE-nummer.",
        },
        unit_amount: NIE_PRICE_CENTS,
      },
      quantity: 1,
    }],
    metadata: { applicationId, userId },
    success_url: `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/ansogning?payment=cancelled`,
    payment_intent_data: { metadata: { applicationId, userId } },
    locale: "da",
  });
}

export async function getStripeSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent", "customer"],
  });
}

export function constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}
