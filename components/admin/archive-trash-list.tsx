import { RestoreArchiveItemButton } from "@/components/admin/restore-archive-item-button";
import { Badge } from "@/components/ui/badge";
import type { DeletedArchiveItemRecord } from "@/lib/archive/types";

type ArchiveTrashListProps = {
  items: DeletedArchiveItemRecord[];
};

export function ArchiveTrashList({ items }: ArchiveTrashListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">Trash is empty.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Deleted archive items will appear here with their removal reason.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card/40">
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li
            key={item.id}
            className="px-4 py-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.url}
                  </a>
                </div>

                <div className="rounded-md bg-muted px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Deletion reason
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {item.deletedReason}
                  </p>
                </div>

                <p className="font-mono text-xs text-muted-foreground">
                  Deleted {item.deletedAt.toLocaleString()}
                </p>
              </div>

              <RestoreArchiveItemButton itemId={item.id} />
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
