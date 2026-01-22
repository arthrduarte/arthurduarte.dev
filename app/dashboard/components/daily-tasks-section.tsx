"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { RecurringTask } from "@/lib/db";

interface DailyTasksSectionProps {
  tasks: RecurringTask[];
  completedTaskIds: Set<number>;
  allTasks: RecurringTask[];
  onUpdate: () => void;
}

export function DailyTasksSection({
  tasks,
  completedTaskIds,
  onUpdate,
}: DailyTasksSectionProps) {
  async function toggleComplete(id: number, completed: boolean) {
    if (completed) {
      await fetch(`/api/tasks/${id}/complete`, { method: "DELETE" });
    } else {
      await fetch(`/api/tasks/${id}/complete`, { method: "POST" });
    }
    onUpdate();
  }

  const completedCount = tasks.filter((t) => completedTaskIds.has(t.id)).length;

  // Display mode - clean task checklist
  return (
    <div className="relative group">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold mb-1">
          Today&apos;s Tasks
        </h2>
        <p className="text-sm text-muted-foreground">
          {completedCount} of {tasks.length} completed
        </p>
      </div>

      {/* Task list */}
      <div className="space-y-1">
        {tasks.length === 0 && (
          <p className="text-sm text-stone-400">No tasks for today.</p>
        )}

        {tasks.map((task) => {
          const isCompleted = completedTaskIds.has(task.id);
          return (
            <TaskCheckItem
              key={task.id}
              task={task}
              isCompleted={isCompleted}
              onToggle={() => toggleComplete(task.id, isCompleted)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface TaskCheckItemProps {
  task: RecurringTask;
  isCompleted: boolean;
  onToggle: () => void;
}

function TaskCheckItem({ task, isCompleted, onToggle }: TaskCheckItemProps) {
  return (
    <label className="flex items-center gap-3 py-1 px-2 cursor-pointer rounded-sm hover:bg-stone-800/80 transition-colors -mx-2">
      <Checkbox checked={isCompleted} onCheckedChange={onToggle} />
      <div className="flex-1 select-none">
        <p
          className={`text-sm font-medium transition-all duration-300 ${
            isCompleted
              ? "line-through text-stone-400"
              : "text-stone-400"
          }`}
        >
          {task.title}
        </p>
      </div>
    </label>
  );
}