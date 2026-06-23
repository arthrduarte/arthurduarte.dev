"use client";

import { useActionState } from "react";

import {
  createArchiveItemAction,
  type CreateArchiveItemActionState,
} from "@/app/admin/archive/actions";
import { ArchiveTagInput } from "@/components/admin/archive-tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateArchiveItemActionState = {};

type CreateArchiveItemFormProps = {
  existingTags: string[];
};

export function CreateArchiveItemForm({
  existingTags,
}: CreateArchiveItemFormProps) {
  const [state, formAction, isPending] = useActionState(
    createArchiveItemAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Add archive item</h2>
        <p className="text-sm text-zinc-500">
          New items are public immediately.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" type="url" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea id="note" name="note" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <ArchiveTagInput existingTags={existingTags} />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="isFavorite"
          value="true"
          className="size-4 rounded border-zinc-300"
        />
        Mark as favorite
      </label>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      {state.success ? (
        <p className="text-sm text-emerald-700">Archive item created.</p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save item"}
      </Button>
    </form>
  );
}
