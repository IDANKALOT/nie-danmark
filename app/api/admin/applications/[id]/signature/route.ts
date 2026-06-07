import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";

/**
 * Streams back the decrypted signature image for a single application.
 * Admin-gated and decrypt-on-read so the signature is never stored or
 * served unencrypted anywhere else.
 */
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

  const signature = await db.applicationSignature.findUnique({
    where: { applicationId: id },
    select: { image: true },
  });

  if (!signature) {
    return NextResponse.json({ error: "Underskrift ikke fundet" }, { status: 404 });
  }

  const decrypted = decryptBuffer(signature.image);

  return new NextResponse(new Uint8Array(decrypted), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, no-store",
    },
  });
}
