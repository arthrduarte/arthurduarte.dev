import { cookies } from "next/headers";
import { getDb } from "./db";

const SESSION_COOKIE_NAME = "dashboard_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export async function createSession(): Promise<string> {
  const sql = getDb();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sql`
    INSERT INTO sessions (id, expires_at)
    VALUES (${sessionId}, ${expiresAt.toISOString()})
  `;

  return sessionId;
}

export async function validateSession(sessionId: string): Promise<boolean> {
  const sql = getDb();
  const result = await sql`
    SELECT id FROM sessions
    WHERE id = ${sessionId} AND expires_at > NOW()
  `;

  return result.length > 0;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}

export async function cleanExpiredSessions(): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM sessions WHERE expires_at < NOW()`;
}

export async function getSessionFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const sessionId = await getSessionFromCookies();
  if (!sessionId) return false;
  return validateSession(sessionId);
}

export function verifyPassword(password: string): boolean {
  const correctPassword = process.env.DASHBOARD_PASSWORD;
  if (!correctPassword) {
    console.error("DASHBOARD_PASSWORD not set in environment variables");
    return false;
  }
  return password === correctPassword;
}
