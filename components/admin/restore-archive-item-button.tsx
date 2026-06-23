"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotateCcwIcon } from "lucide-react";

import {
  restoreArchiveItemAction,
  type ArchiveActionState,
} from "@/app/admin/archive/actions";
import { Button } from "@/components/ui/button";

const initialState: ArchiveActionState = {};

type RestoreArchiveItemButtonProps = {
  itemId: string;
};

export function RestoreArchiveItemButton({
  itemId,
}: RestoreArchiveItemButtonProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    restoreArchiveItemAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <div className="flex flex-col items-end gap-2">
      <form action={formAction}>
        <input type="hidden" name="id" value={itemId} />
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          <RotateCcwIcon className="size-4" />
          {isPending ? "Restoring..." : "Restore"}
        </Button>
      </form>
      {state.error ? (
        <p className="max-w-40 text-right text-xs text-destructive">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
