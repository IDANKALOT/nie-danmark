import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadBuffer } from "@/lib/storage";
import { randomUUID } from "crypto";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot).toLowerCase();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Ikke autoriseret" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Ingen adgang" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Ingen fil valgt" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Filen er for stor. Maksimal filstørrelse er 5 MB." },
        { status: 413 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Filen er tom" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Ugyldig filtype. Kun JPG, PNG og WEBP er tilladt." },
        { status: 415 }
      );
    }

    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { error: "Ugyldig filtype. Kun .jpg, .png og .webp er tilladt." },
        { status: 415 }
      );
    }

    const pathname = `team/${randomUUID()}${extension}`;
    const bytes = await file.arrayBuffer();
    const { url } = await uploadBuffer(Buffer.from(bytes), pathname, file.type);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[admin/upload-image] Error:", error);
    return NextResponse.json({ error: "Upload mislykkedes. Prøv igen." }, { status: 500 });
  }
}
