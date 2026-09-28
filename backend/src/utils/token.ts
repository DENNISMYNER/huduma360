import crypto from "crypto";

/** Generates a URL-safe random token (raw, to send to the user) plus its SHA-256 hash (to store in DB). */
export function generateToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}
