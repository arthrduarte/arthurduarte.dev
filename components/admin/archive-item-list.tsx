"use client";

import { useState } from "react";
import { PencilIcon, StarIcon, Trash2Icon } from "lucide-react";

import { DeleteArchiveItemDialog } from "@/components/admin/delete-archive-item-dialog";
import { EditArchiveItemSheet } from "@/components/admin/edit-archive-item-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArchiveItemRecord } from "@/lib/archive/types";

type ArchiveItemListProps = {
  items: ArchiveItemRecord[];
  existingTags: string[];
};

export function ArchiveItemList({ items, existingTags }: ArchiveItemListProps) {
  const [editingItem, setEditingItem] = useState<ArchiveItemRecord | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ArchiveItemRecord | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
    <>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <ul className="divide-y divide-zinc-200">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    {item.isFavorite ? (
                      <Badge variant="outline" className="gap-1">
                        <StarIcon className="size-3 fill-current" />
                        Favorite
                      </Badge>
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
                  {item.source ? (
                    <p className="text-xs text-zinc-400">{item.source}</p>
                  ) : null}
                  {item.note ? (
                    <p className="text-sm text-zinc-600">{item.note}</p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-xs text-zinc-400">
                    {item.createdAt.toLocaleDateString()}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditOpen(true);
                    }}
                  >
                    <PencilIcon className="size-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletingItem(item);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2Icon className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>

              {item.imageUrl ? (
                <div className="mt-3 overflow-hidden rounded-md border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="max-h-32 w-full object-cover"
                  />
                </div>
              ) : null}

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

      <EditArchiveItemSheet
        item={editingItem}
        existingTags={existingTags}
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);

          if (!open) {
            setEditingItem(null);
          }
        }}
      />

      <DeleteArchiveItemDialog
        item={deletingItem}
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);

          if (!open) {
            setDeletingItem(null);
          }
        }}
      />
    </>
  );
}
