import { NextRequest, NextResponse } from "next/server";
import { getDb, RecurringTask, RecurrenceType } from "@/lib/db";
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
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { title, description, recurrence_type, recurrence_value, active } =
      await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const validTypes: RecurrenceType[] = [
      "daily",
      "weekly",
      "monthly",
      "custom",
    ];
    if (recurrence_type && !validTypes.includes(recurrence_type)) {
      return NextResponse.json(
        { error: "Invalid recurrence type" },
        { status: 400 }
      );
    }

    const sql = getDb();
    const result = await sql`
      UPDATE recurring_tasks
      SET title = ${title},
          description = ${description || null},
          recurrence_type = ${recurrence_type || "daily"},
          recurrence_value = ${recurrence_value || null},
          active = ${active ?? true}
      WHERE id = ${taskId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(result[0] as RecurringTask);
  } catch (error) {
    console.error("Error updating task:", error);
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

    const sql = getDb();
    const result = await sql`
      DELETE FROM recurring_tasks WHERE id = ${taskId} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
