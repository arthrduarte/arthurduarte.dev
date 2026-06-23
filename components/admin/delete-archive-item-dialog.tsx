"use client";

import { useActionState, useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";

import {
  softDeleteArchiveItemAction,
  type ArchiveActionState,
} from "@/app/admin/archive/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArchiveItemRecord } from "@/lib/archive/types";

const initialState: ArchiveActionState = {};

type DeleteArchiveItemDialogProps = {
  item: ArchiveItemRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteArchiveItemDialog({
  item,
  open,
  onOpenChange,
}: DeleteArchiveItemDialogProps) {
  const [deletedReason, setDeletedReason] = useState("");
  const [state, formAction, isPending] = useActionState(
    softDeleteArchiveItemAction,
    initialState,
  );

  useEffect(() => {
    if (!open) {
      setDeletedReason("");
    }
  }, [open]);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      setDeletedReason("");
    }
  }, [state.success, onOpenChange]);

  if (!item) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Move to trash?</AlertDialogTitle>
          <AlertDialogDescription>
            {item.title} will disappear from the public archive and active admin
            list. You can restore it later from trash.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />

          <div className="space-y-2">
            <Label htmlFor={`deleted-reason-${item.id}`}>Deletion reason</Label>
            <Textarea
              id={`deleted-reason-${item.id}`}
              name="deletedReason"
              rows={3}
              required
              value={deletedReason}
              placeholder="Why is this leaving the archive?"
              onChange={(event) => setDeletedReason(event.target.value)}
            />
          </div>

          {state.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending || deletedReason.trim().length === 0}
            >
              <Trash2Icon className="size-4" />
              {isPending ? "Moving..." : "Move to trash"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
