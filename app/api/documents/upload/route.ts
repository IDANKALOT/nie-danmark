import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot).toLowerCase();
}

function sanitizeFilename(original: string): string {
  // Remove path components and dangerous characters
  return original
    .split(/[/\\]/)
    .pop()!
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 200);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Du skal være logget ind for at uploade filer" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Ingen fil valgt" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Filen er for stor. Maksimal filstørrelse er 10 MB." },
        { status: 413 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { message: "Filen er tom" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Ugyldig filtype. Kun PDF, JPG og PNG er tilladt." },
        { status: 415 }
      );
    }

    // Validate extension
    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { message: "Ugyldig filtype. Kun .pdf, .jpg og .png er tilladt." },
        { status: 415 }
      );
    }

    // Build safe path: public/uploads/<userId>/<uuid><ext>
    const userId = session.user.id;
    const uniqueId = randomUUID();
    const safeFilename = `${uniqueId}${extension}`;
    const uploadDir = join(process.cwd(), "public", "uploads", userId);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, safeFilename);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Public URL
    const url = `/uploads/${userId}/${safeFilename}`;

    return NextResponse.json({
      url,
      name: sanitizeFilename(file.name),
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("[documents/upload] Error:", error);
    return NextResponse.json(
      { message: "Upload mislykkedes. Prøv igen." },
      { status: 500 }
    );
  }
}

// App Router route handlers have no bodyParser config — multipart/form-data
// is handled natively via request.formData(). No additional config needed.
