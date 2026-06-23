import { createHmac, timingSafeEqual } from "node:crypto";

import { ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/admin/constants";

export function createAdminSessionToken(
  secret: string,
  now = Date.now(),
): string {
  const expiresAt = now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): boolean {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expiresAt = Number(payload);

  if (!Number.isFinite(expiresAt) || now > expiresAt) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}
