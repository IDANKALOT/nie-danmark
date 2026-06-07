import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import CaseDetail from "./case-detail";

// Admin case detail always reflects live data — never statically prerendered.
export const dynamic = "force-dynamic";

export default async function AdminSagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await db.application.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      documents: { orderBy: { uploadedAt: "desc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      messages: {
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      adminNotes: { orderBy: { createdAt: "desc" } },
      payment: true,
      generatedPdfs: { orderBy: { generatedAt: "desc" } },
    },
  });

  if (!application) {
    notFound();
  }

  return <CaseDetail application={application} />;
}
