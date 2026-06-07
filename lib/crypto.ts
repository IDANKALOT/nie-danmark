import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.SIGNATURE_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("SIGNATURE_ENCRYPTION_KEY mangler i miljøvariablerne");
  }
  // Accept a 64-char hex string (32 bytes) or derive a key from any other secret.
  if (/^[0-9a-fA-F]{64}$/.test(secret)) {
    return Buffer.from(secret, "hex");
  }
  return scryptSync(secret, "nie-danmark-signature", 32);
}

/**
 * Encrypts a buffer with AES-256-GCM. Output layout: iv (12B) || authTag (16B) || ciphertext.
 */
export function encryptBuffer(plaintext: Buffer | Uint8Array): Buffer {
  const data = Buffer.isBuffer(plaintext) ? plaintext : Buffer.from(plaintext);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]);
}

/**
 * Decrypts a buffer produced by encryptBuffer.
 */
export function decryptBuffer(encrypted: Buffer | Uint8Array): Buffer {
  const data = Buffer.isBuffer(encrypted) ? encrypted : Buffer.from(encrypted);
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
