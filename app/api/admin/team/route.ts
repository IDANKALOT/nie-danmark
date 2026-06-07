import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { TeamRole } from "@prisma/client";

const VALID_ROLES: TeamRole[] = ["LAWYER", "NOTARY", "ADVISOR"];

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ingen adgang" }, { status: 403 });
  }

  const members = await db.teamMember.findMany({ orderBy: { order: "asc" } });

  return NextResponse.json({ data: members });
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ingen adgang" }, { status: 403 });
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

  if (!name?.trim() || !title?.trim() || !bio?.trim()) {
    return NextResponse.json({ error: "Navn, titel og bio er påkrævet" }, { status: 400 });
  }

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `Ugyldig rolle. Gyldige værdier: ${VALID_ROLES.join(", ")}` },
      { status: 400 }
    );
  }

  const member = await db.teamMember.create({
    data: {
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      role: role ?? "ADVISOR",
      photoUrl: photoUrl?.trim() || null,
      certifications: Array.isArray(certifications) ? certifications.filter((c) => c.trim()) : [],
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      order: typeof order === "number" ? order : 0,
      active: typeof active === "boolean" ? active : true,
    },
  });

  return NextResponse.json({ data: member, message: "Teammedlem oprettet" }, { status: 201 });
}
