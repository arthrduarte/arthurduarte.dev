import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  cleanExpiredSessions,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Clean up expired sessions periodically
    await cleanExpiredSessions();

    // Create new session
    const sessionId = await createSession();
    await setSessionCookie(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
