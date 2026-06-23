import { RotateCcwIcon } from "lucide-react";

import { restoreArchiveItemFormAction } from "@/app/admin/archive/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DeletedArchiveItemRecord } from "@/lib/archive/types";

type ArchiveTrashListProps = {
  items: DeletedArchiveItemRecord[];
};

export function ArchiveTrashList({ items }: ArchiveTrashListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 px-4 py-8 text-center">
        <p className="text-sm font-medium text-zinc-900">Trash is empty.</p>
        <p className="mt-1 text-sm text-zinc-500">
          Deleted archive items will appear here with their removal reason.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-200">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-sm text-zinc-500 hover:text-zinc-900"
                  >
                    {item.url}
                  </a>
                </div>

                <div className="rounded-md bg-zinc-50 px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Deletion reason
                  </p>
                  <p className="mt-1 text-sm text-zinc-700">
                    {item.deletedReason}
                  </p>
                </div>

                <p className="text-xs text-zinc-400">
                  Deleted {item.deletedAt.toLocaleString()}
                </p>
              </div>

              <form action={restoreArchiveItemFormAction}>
                <input type="hidden" name="id" value={item.id} />
                <Button type="submit" variant="outline" size="sm">
                  <RotateCcwIcon className="size-4" />
                  Restore
                </Button>
              </form>
            </div>

            {item.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
