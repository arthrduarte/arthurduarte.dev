import { Badge } from "@/components/ui/badge";
import type { ArchiveItemWithTags } from "@/lib/archive/types";

type ArchiveItemListProps = {
  items: ArchiveItemWithTags[];
};

export function ArchiveItemList({ items }: ArchiveItemListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 px-4 py-8 text-center">
        <p className="text-sm font-medium text-zinc-900">No archive items yet.</p>
        <p className="mt-1 text-sm text-zinc-500">
          Add your first item with the form above.
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
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  {item.isFavorite ? (
                    <Badge variant="outline">Favorite</Badge>
                  ) : null}
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm text-zinc-500 hover:text-zinc-900"
                >
                  {item.url}
                </a>
                {item.note ? (
                  <p className="text-sm text-zinc-600">{item.note}</p>
                ) : null}
              </div>

              <p className="shrink-0 text-xs text-zinc-400">
                {item.createdAt.toLocaleDateString()}
              </p>
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
