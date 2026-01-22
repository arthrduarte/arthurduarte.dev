import { NextRequest, NextResponse } from "next/server";
import { getDb, RecurringTask, RecurrenceType } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = getDb();
    const tasks = await sql`
      SELECT * FROM recurring_tasks WHERE active = true ORDER BY created_at DESC
    `;

    return NextResponse.json(tasks as RecurringTask[]);
  } catch (error) {
    console.error("Error fetching tasks:", error);
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

    const { title, description, recurrence_type, recurrence_value } =
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
      INSERT INTO recurring_tasks (title, description, recurrence_type, recurrence_value)
      VALUES (${title}, ${description || null}, ${recurrence_type || "daily"}, ${recurrence_value || null})
      RETURNING *
    `;

    return NextResponse.json(result[0] as RecurringTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
