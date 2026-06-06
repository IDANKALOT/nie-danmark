import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApplicationStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ingen adgang" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") as ApplicationStatus | null;
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const validLimit = Math.min(Math.max(1, isNaN(limit) ? 50 : limit), 200);
  const validOffset = Math.max(0, isNaN(offset) ? 0 : offset);

  const validStatuses: ApplicationStatus[] = [
    "RECEIVED",
    "PROCESSING",
    "AT_NOTARY",
    "AT_LAWYER",
    "AWAITING_CLIENT",
    "COMPLETED",
    "CANCELLED",
  ];

  const where = {
    ...(status && validStatuses.includes(status) ? { status } : {}),
    ...(search && search.trim().length > 0
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { id: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [applications, total] = await Promise.all([
    db.application.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            amount: true,
            currency: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            documents: true,
            messages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: validLimit,
      skip: validOffset,
    }),
    db.application.count({ where }),
  ]);

  return NextResponse.json({
    data: applications,
    meta: {
      total,
      limit: validLimit,
      offset: validOffset,
      hasMore: validOffset + validLimit < total,
    },
  });
}
