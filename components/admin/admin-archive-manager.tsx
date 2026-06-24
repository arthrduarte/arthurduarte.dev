"use client";

import { useMemo, useState } from "react";
import { PlusIcon, SearchIcon, StarIcon } from "lucide-react";

import { ArchiveItemForm } from "@/components/admin/archive-item-form";
import { ArchiveItemList } from "@/components/admin/archive-item-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { filterArchiveItems } from "@/lib/archive/filters";
import type { ArchiveItemRecord, ArchiveTagOption } from "@/lib/archive/types";

type AdminArchiveManagerProps = {
  items: ArchiveItemRecord[];
  tags: ArchiveTagOption[];
  existingTags: string[];
  blobConfigured: boolean;
};

export function AdminArchiveManager({
  items,
  tags,
  existingTags,
  blobConfigured,
}: AdminArchiveManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedTagSlug, setSelectedTagSlug] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const filteredItems = useMemo(
    () =>
      filterArchiveItems(items, {
        search,
        tagSlug: selectedTagSlug,
        favoritesOnly,
      }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [items, search, selectedTagSlug, favoritesOnly],
  );

  const createButton = (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogTrigger
        render={
          <Button type="button">
            <PlusIcon className="size-4" />
            New item
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add archive item</DialogTitle>
          <DialogDescription>
            New items are public immediately.
          </DialogDescription>
        </DialogHeader>
        <ArchiveItemForm
          existingTags={existingTags}
          blobConfigured={blobConfigured}
          onSuccess={() => setCreateOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-12 text-center">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            No archive items yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Add your first find to get started.
          </p>
        </div>
        {createButton}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, URL, note, or tag"
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant={favoritesOnly ? "default" : "outline"}
          onClick={() => setFavoritesOnly((current) => !current)}
        >
          <StarIcon className="size-4" />
          Favorites
        </Button>
        {createButton}
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedTagSlug === null ? "default" : "outline"}
            onClick={() => setSelectedTagSlug(null)}
          >
            All tags
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag.slug}
              type="button"
              size="sm"
              variant={selectedTagSlug === tag.slug ? "default" : "outline"}
              onClick={() =>
                setSelectedTagSlug((current) =>
                  current === tag.slug ? null : tag.slug,
                )
              }
            >
              {tag.name}
            </Button>
          ))}
        </div>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        Showing {filteredItems.length} of {items.length} items
      </p>

      {filteredItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">
            No items match these filters.
          </p>
        </div>
      ) : (
        <ArchiveItemList
          items={filteredItems}
          existingTags={existingTags}
          blobConfigured={blobConfigured}
        />
      )}
    </div>
  );
}
