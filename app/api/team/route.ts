import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Public endpoint serving active team members for the "Om os" page —
 * backs the dynamic team section so the roster can be managed from
 * the admin panel without a redeploy.
 */
export async function GET() {
  const members = await db.teamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ data: members });
}
