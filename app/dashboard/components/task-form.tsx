"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecurrenceType } from "@/lib/db";

interface TaskFormProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  recurrenceType: RecurrenceType;
  setRecurrenceType: (v: RecurrenceType) => void;
  recurrenceValue: string;
  setRecurrenceValue: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  recurrenceType,
  setRecurrenceType,
  recurrenceValue,
  setRecurrenceValue,
  onSave,
  onCancel,
}: TaskFormProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50">
      <div className="flex flex-col gap-2">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Description (optional)</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Recurrence</Label>
        <Select
          value={recurrenceType}
          onValueChange={(v) => setRecurrenceType(v as RecurrenceType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly (specific days)</SelectItem>
            <SelectItem value="monthly">Monthly (specific day)</SelectItem>
            <SelectItem value="custom">Custom interval</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {recurrenceType === "weekly" && (
        <div className="flex flex-col gap-2">
          <Label>Days (0=Sun, 1=Mon, ..., 6=Sat)</Label>
          <Input
            value={recurrenceValue}
            onChange={(e) => setRecurrenceValue(e.target.value)}
            placeholder="e.g., 1,3,5 for Mon/Wed/Fri"
          />
        </div>
      )}
      {recurrenceType === "monthly" && (
        <div className="flex flex-col gap-2">
          <Label>Day of month (1-31)</Label>
          <Input
            type="number"
            min={1}
            max={31}
            value={recurrenceValue}
            onChange={(e) => setRecurrenceValue(e.target.value)}
            placeholder="e.g., 1 for first day"
          />
        </div>
      )}
      {recurrenceType === "custom" && (
        <div className="flex flex-col gap-2">
          <Label>Every N days</Label>
          <Input
            type="number"
            min={1}
            value={recurrenceValue}
            onChange={(e) => setRecurrenceValue(e.target.value)}
            placeholder="e.g., 3 for every 3 days"
          />
        </div>
      )}
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
