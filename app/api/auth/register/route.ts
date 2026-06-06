import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "Navn skal være mindst 2 tegn").max(100),
  email: z.string().email("Ugyldig e-mailadresse").max(255),
  password: z
    .string()
    .min(8, "Adgangskode skal være mindst 8 tegn")
    .max(128)
    .regex(/[A-Z]/, "Adgangskode skal indeholde mindst ét stort bogstav")
    .regex(/[0-9]/, "Adgangskode skal indeholde mindst ét tal"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { message: firstError?.message ?? "Ugyldige oplysninger" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check if email already exists
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Der findes allerede en konto med denne e-mailadresse" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true },
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email!, user.name ?? "").catch((err: unknown) => {
      console.error("[register] Failed to send welcome email:", err);
    });

    return NextResponse.json(
      { message: "Konto oprettet", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[register] Error:", error);
    return NextResponse.json(
      { message: "Der opstod en intern fejl. Prøv igen." },
      { status: 500 }
    );
  }
}
