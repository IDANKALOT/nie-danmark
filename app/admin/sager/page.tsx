import { db } from "@/lib/db";
import ApplicationsTable from "./applications-table";

// Admin case list always reflects live data — never statically prerendered.
export const dynamic = "force-dynamic";

export default async function AdminSagerPage() {
  const applications = await db.application.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      paymentStatus: true,
      amount: true,
      createdAt: true,
    },
  });

  return <ApplicationsTable applications={applications} />;
}
