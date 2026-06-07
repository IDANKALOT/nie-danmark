import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateAndDispatchDocuments } from "@/lib/pdf";

/**
 * Manual "Generér dokumenter igen" trigger for admins. Unlike the
 * fire-and-forget call from the Stripe webhook, this is awaited so the
 * admin gets a real result — including the freshly created `GeneratedPDF`
 * rows — to render immediately in the UI.
 */
export async function POST(
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

  const application = await db.application.findUnique({ where: { id } });

  if (!application) {
    return NextResponse.json({ error: "Sag ikke fundet" }, { status: 404 });
  }

  const before = await db.generatedPDF.findMany({
    where: { applicationId: id },
    select: { id: true },
  });
  const beforeIds = new Set(before.map((pdf) => pdf.id));

  try {
    await generateAndDispatchDocuments(id);
  } catch (err) {
    console.error(`[admin/generate-pdfs] Failed to generate documents for application ${id}:`, err);
    return NextResponse.json(
      { error: "Kunne ikke generere dokumenter" },
      { status: 500 }
    );
  }

  const all = await db.generatedPDF.findMany({
    where: { applicationId: id },
    orderBy: { generatedAt: "desc" },
  });

  const newlyCreated = all.filter((pdf) => !beforeIds.has(pdf.id));

  return NextResponse.json({
    message: "Dokumenter genereret",
    data: newlyCreated,
  });
}
