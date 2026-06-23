import { scryptSync, timingSafeEqual } from "node:crypto";

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyScryptPassword(input: string, stored: string): boolean {
  const [, salt, hash] = stored.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derived = scryptSync(input, salt, 64).toString("hex");

  return safeCompare(derived, hash);
}

export function verifyDashboardPassword(input: string): boolean {
  const hashedPassword = process.env.DASHBOARD_PASSWORD_HASH;
  const plainPassword = process.env.DASHBOARD_PASSWORD;

  if (hashedPassword?.startsWith("scrypt:")) {
    return verifyScryptPassword(input, hashedPassword);
  }

  if (plainPassword) {
    return safeCompare(input, plainPassword);
  }

  return false;
}
