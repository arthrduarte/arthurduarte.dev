import { NextRequest, NextResponse } from "next/server";
import { getDb, Quote } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const quoteId = parseInt(id, 10);

    if (isNaN(quoteId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
      UPDATE quotes
      SET text = ${text}, author = ${author || null}
      WHERE id = ${quoteId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(result[0] as Quote);
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const quoteId = parseInt(id, 10);

    if (isNaN(quoteId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const sql = getDb();
    const result = await sql`
      DELETE FROM quotes WHERE id = ${quoteId} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
