import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb() {
  if (!_sql) {
    _sql = neon(process.env.STORAGE_DATABASE_URL!);
  }
  return _sql;
}

// Types for our database models
export interface Quote {
  id: number;
  text: string;
  author: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export type RecurrenceType = "daily" | "weekly" | "monthly" | "custom";

export interface RecurringTask {
  id: number;
  title: string;
  description: string | null;
  recurrence_type: RecurrenceType;
  recurrence_value: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TaskCompletion {
  id: number;
  task_id: number;
  completed_date: string;
  created_at: Date;
}

export interface Session {
  id: string;
  expires_at: Date;
  created_at: Date;
}

// Helper to check if a recurring task should show today
export function shouldShowTaskToday(task: RecurringTask): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const dayOfMonth = today.getDate();

  switch (task.recurrence_type) {
    case "daily":
      return true;

    case "weekly":
      if (!task.recurrence_value) return true;
      const allowedDays = task.recurrence_value.split(",").map(Number);
      return allowedDays.includes(dayOfWeek);

    case "monthly":
      if (!task.recurrence_value) return dayOfMonth === 1;
      return dayOfMonth === parseInt(task.recurrence_value, 10);

    case "custom":
      // For custom, recurrence_value is interval in days from task creation
      if (!task.recurrence_value) return true;
      const interval = parseInt(task.recurrence_value, 10);
      const createdDate = new Date(task.created_at);
      const diffTime = today.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays % interval === 0;

    default:
      return true;
  }
}

export function getRecurrenceLabel(task: RecurringTask): string {
  switch (task.recurrence_type) {
    case "daily":
      return "Every day";
    case "weekly":
      if (!task.recurrence_value) return "Weekly";
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const selectedDays = task.recurrence_value
        .split(",")
        .map((d) => days[parseInt(d, 10)]);
      return selectedDays.join(", ");
    case "monthly":
      if (!task.recurrence_value) return "Monthly (1st)";
      const day = parseInt(task.recurrence_value, 10);
      const suffix =
        day === 1 || day === 21 || day === 31
          ? "st"
          : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
              ? "rd"
              : "th";
      return `Monthly (${day}${suffix})`;
    case "custom":
      if (!task.recurrence_value) return "Custom";
      const interval = parseInt(task.recurrence_value, 10);
      return `Every ${interval} day${interval > 1 ? "s" : ""}`;
    default:
      return "Unknown";
  }
}
