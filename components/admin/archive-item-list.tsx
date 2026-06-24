"use client";

import { useState } from "react";
import { ImageIcon, PencilIcon, StarIcon, Trash2Icon } from "lucide-react";

import { DeleteArchiveItemDialog } from "@/components/admin/delete-archive-item-dialog";
import { EditArchiveItemSheet } from "@/components/admin/edit-archive-item-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArchiveItemRecord } from "@/lib/archive/types";

type ArchiveItemListProps = {
  items: ArchiveItemRecord[];
  existingTags: string[];
  blobConfigured: boolean;
};

export function ArchiveItemList({
  items,
  existingTags,
  blobConfigured,
}: ArchiveItemListProps) {
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
      <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">
          No archive items yet.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first item with the form above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card/40">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-start"
            >
              <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-border bg-muted/40 sm:w-44">
                {item.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-6" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">
                        {item.title}
                      </p>
                      {item.isFavorite ? (
                        <Badge variant="outline" className="gap-1">
                          <StarIcon className="size-3 fill-primary text-primary" />
                          Favorite
                        </Badge>
                      ) : null}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.url}
                    </a>
                    {item.source ? (
                      <p className="text-xs text-muted-foreground">
                        {item.source}
                      </p>
                    ) : null}
                    {item.note ? (
                      <p className="text-sm text-muted-foreground">
                        {item.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <p className="font-mono text-xs text-muted-foreground">
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

                {item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <EditArchiveItemSheet
        item={editingItem}
        existingTags={existingTags}
        blobConfigured={blobConfigured}
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
