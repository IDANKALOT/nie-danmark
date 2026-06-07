import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { TeamRole } from "@prisma/client";

const VALID_ROLES: TeamRole[] = ["LAWYER", "NOTARY", "ADVISOR"];

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 }) };
  }

  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Ingen adgang" }, { status: 403 }) };
  }

  return { session };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth_ = await requireAdmin();
  if (auth_.error) return auth_.error;

  const { id } = await params;

  const existing = await db.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Teammedlem ikke fundet" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldigt request body" }, { status: 400 });
  }

  const { name, title, role, bio, photoUrl, certifications, email, phone, order, active } = body as {
    name?: string;
    title?: string;
    role?: TeamRole;
    bio?: string;
    photoUrl?: string | null;
    certifications?: string[];
    email?: string | null;
    phone?: string | null;
    order?: number;
    active?: boolean;
  };

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `Ugyldig rolle. Gyldige værdier: ${VALID_ROLES.join(", ")}` },
      { status: 400 }
    );
  }

  const member = await db.teamMember.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(bio !== undefined ? { bio: bio.trim() } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(photoUrl !== undefined ? { photoUrl: photoUrl?.trim() || null } : {}),
      ...(certifications !== undefined
        ? { certifications: certifications.filter((c) => c.trim()) }
        : {}),
      ...(email !== undefined ? { email: email?.trim() || null } : {}),
      ...(phone !== undefined ? { phone: phone?.trim() || null } : {}),
      ...(order !== undefined ? { order } : {}),
      ...(active !== undefined ? { active } : {}),
    },
  });

  return NextResponse.json({ data: member, message: "Teammedlem opdateret" });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth_ = await requireAdmin();
  if (auth_.error) return auth_.error;

  const { id } = await params;

  const existing = await db.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Teammedlem ikke fundet" }, { status: 404 });
  }

  await db.teamMember.delete({ where: { id } });

  return NextResponse.json({ message: "Teammedlem slettet" });
}
