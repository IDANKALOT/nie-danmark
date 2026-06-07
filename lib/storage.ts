import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export interface UploadResult {
  url: string;
  size: number;
}

/**
 * Stores a buffer and returns its public URL + size.
 * Uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured (production),
 * and falls back to writing into `public/uploads` for local development.
 */
export async function uploadBuffer(
  buffer: Buffer | Uint8Array,
  pathname: string,
  contentType: string
): Promise<UploadResult> {
  const data = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(pathname, data, {
      access: "public",
      contentType,
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, size: data.byteLength };
  }

  const targetPath = join(process.cwd(), "public", "uploads", pathname);
  await mkdir(join(targetPath, ".."), { recursive: true });
  await writeFile(targetPath, data);

  return { url: `/uploads/${pathname}`, size: data.byteLength };
}
