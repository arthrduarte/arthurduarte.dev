"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Todo } from "@/lib/db";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface TodosSectionProps {
  todos: Todo[];
  onUpdate: () => void;
}

export function TodosSection({ todos, onUpdate }: TodosSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleAdd() {
    if (!title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    setIsAdding(false);
    onUpdate();
  }

  async function handleEdit(id: number) {
    if (!title.trim()) return;
    const todo = todos.find((t) => t.id === id);
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, completed: todo?.completed }),
    });
    setEditingId(null);
    setTitle("");
    setDescription("");
    onUpdate();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    onUpdate();
  }

  async function toggleComplete(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      }),
    });
    onUpdate();
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setIsAdding(false);
  }

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">TODOs</h2>
        {!isAdding && (
          <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="size-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <TodoForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          onSave={handleAdd}
          onCancel={cancelEdit}
        />
      )}

      {/* Empty state */}
      {pendingTodos.length === 0 && completedTodos.length === 0 && !isAdding && (
        <p className="text-sm text-stone-400">No TODOs yet.</p>
      )}

      {/* Pending TODOs */}
      {pendingTodos.length > 0 && (
        <div className="space-y-1">
          {pendingTodos.map((todo) =>
            editingId === todo.id ? (
              <TodoForm
                key={todo.id}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                onSave={() => handleEdit(todo.id)}
                onCancel={cancelEdit}
              />
            ) : (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleComplete(todo)}
                onEdit={() => startEdit(todo)}
                onDelete={() => handleDelete(todo.id)}
              />
            )
          )}
        </div>
      )}

      {/* Completed TODOs */}
      {completedTodos.length > 0 && (
        <div className="space-y-1 mt-6">
          <div className="text-xs text-stone-400 font-medium tracking-wider uppercase px-2 mb-2">
            Completed ({completedTodos.length})
          </div>
          {completedTodos.map((todo) => (
            <CompletedTodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleComplete(todo)}
              onDelete={() => handleDelete(todo.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TodoFormProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function TodoForm({
  title,
  setTitle,
  description,
  setDescription,
  onSave,
  onCancel,
}: TodoFormProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50">
      <div className="flex flex-col gap-2">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Description (optional)</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Additional details..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-start gap-3 py-1 px-2 rounded-sm hover:bg-stone-800/80 transition-colors -mx-2">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 cursor-pointer" onClick={onToggle}>
        <p className="text-sm font-medium text-stone-400">{todo.title}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon-xs" onClick={onEdit}>
          <Edit2 className="size-3" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" size="icon-xs">
                <Trash2 className="size-3" />
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete TODO?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

interface CompletedTodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

function CompletedTodoItem({ todo, onToggle, onDelete }: CompletedTodoItemProps) {
  return (
    <div className="group flex items-start gap-3 py-1 px-2 rounded-sm hover:bg-stone-800/80 transition-colors -mx-2">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 cursor-pointer" onClick={onToggle}>
        <p className="text-sm font-medium line-through text-stone-400/60">{todo.title}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" size="icon-xs">
                <Trash2 className="size-3" />
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete TODO?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
