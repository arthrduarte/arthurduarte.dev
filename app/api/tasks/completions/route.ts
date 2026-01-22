import { NextResponse } from "next/server";
import { getDb, TaskCompletion } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];

    const sql = getDb();
    const completions = await sql`
      SELECT * FROM task_completions WHERE completed_date = ${today}
    `;

    return NextResponse.json(completions as TaskCompletion[]);
  } catch (error) {
    console.error("Error fetching completions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
