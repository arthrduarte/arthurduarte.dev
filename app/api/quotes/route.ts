import { NextRequest, NextResponse } from "next/server";
import { getDb, Quote } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = getDb();
    const quotes = await sql`
      SELECT * FROM quotes ORDER BY created_at DESC
    `;

    return NextResponse.json(quotes as Quote[]);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, author } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Quote text is required" },
        { status: 400 }
      );
    }

    const sql = getDb();
    const result = await sql`
      INSERT INTO quotes (text, author)
      VALUES (${text}, ${author || null})
      RETURNING *
    `;

    return NextResponse.json(result[0] as Quote);
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
