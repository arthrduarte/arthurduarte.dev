import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    const sql = getDb();
    // Check if already completed today
    const existing = await sql`
      SELECT id FROM task_completions
      WHERE task_id = ${taskId} AND completed_date = ${today}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already completed today" });
    }

    await sql`
      INSERT INTO task_completions (task_id, completed_date)
      VALUES (${taskId}, ${today})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing task:", error);
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
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    const sql = getDb();
    await sql`
      DELETE FROM task_completions
      WHERE task_id = ${taskId} AND completed_date = ${today}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uncompleting task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
