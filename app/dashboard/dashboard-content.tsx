"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Quote,
  Todo,
  RecurringTask,
  TaskCompletion,
  shouldShowTaskToday,
} from "@/lib/db";
import { LogOut } from "lucide-react";
import { QuotesSection, DailyTasksSection, TodosSection } from "./components";

export function DashboardContent() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasks, setTasks] = useState<RecurringTask[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [quotesRes, todosRes, tasksRes, completionsRes] = await Promise.all(
        [
          fetch("/api/quotes"),
          fetch("/api/todos"),
          fetch("/api/tasks"),
          fetch("/api/tasks/completions"),
        ]
      );

      if (
        quotesRes.status === 401 ||
        todosRes.status === 401 ||
        tasksRes.status === 401
      ) {
        router.push("/dashboard/login");
        return;
      }

      const [quotesData, todosData, tasksData, completionsData] =
        await Promise.all([
          quotesRes.json(),
          todosRes.json(),
          tasksRes.json(),
          completionsRes.json(),
        ]);

      setQuotes(quotesData);
      setTodos(todosData);
      setTasks(tasksData);
      setCompletions(completionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const todaysTasks = tasks.filter(shouldShowTaskToday);
  const completedTaskIds = new Set(completions.map((c) => c.task_id));

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12 w-2/3">
      <header className="flex items-center justify-end">
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="size-4 mr-2" />
        </Button>
      </header>

      <section>
        <QuotesSection quotes={quotes} onUpdate={fetchData} />
      </section>

      <section>
        <DailyTasksSection
          tasks={todaysTasks}
          completedTaskIds={completedTaskIds}
          allTasks={tasks}
          onUpdate={fetchData}
        />
      </section>

      <section>
        <TodosSection todos={todos} onUpdate={fetchData} />
      </section>
    </div>
  );
}
