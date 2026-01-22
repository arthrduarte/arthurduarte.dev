import { NextResponse } from "next/server";
import {
  getSessionFromCookies,
  deleteSession,
  clearSessionCookie,
} from "@/lib/auth";

export async function POST() {
  try {
    const sessionId = await getSessionFromCookies();

    if (sessionId) {
      await deleteSession(sessionId);
    }

    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
