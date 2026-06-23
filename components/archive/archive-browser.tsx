"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  MessageSquareTextIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";

import { ArchiveEmptyState } from "@/components/archive/archive-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { filterArchiveItems } from "@/lib/archive/filters";
import type { ArchiveItemRecord, ArchiveTagOption } from "@/lib/archive/types";
import { cn } from "@/lib/utils";

type ArchiveBrowserProps = {
  items: ArchiveItemRecord[];
  tags: ArchiveTagOption[];
};

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

function getCardRotation(index: number): string {
  const rotations = ["-1.2deg", "0.6deg", "-0.4deg", "1deg", "-0.8deg"];
  return rotations[index % rotations.length];
}

function ArchiveCard({
  item,
  index,
  onOpenDetails,
}: {
  item: ArchiveItemRecord;
  index: number;
  onOpenDetails: (item: ArchiveItemRecord) => void;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card/40 shadow-xs transition hover:-translate-y-0.5 hover:border-border hover:bg-card/70 hover:shadow-sm",
        item.isFavorite && "ring-1 ring-primary/30",
      )}
      style={{ transform: `rotate(${getCardRotation(index)})` }}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col"
      >
        {item.imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] flex-col justify-between bg-gradient-to-br from-stone-800/80 to-stone-950 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-stone-400">
              {item.source ?? getHostname(item.url)}
            </div>
            <div>
              <p className="text-3xl font-semibold text-stone-100">
                {item.title.slice(0, 1).toUpperCase()}
              </p>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-300">
                {item.title}
              </p>
              {item.note ? (
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-400">
                  {item.note}
                </p>
              ) : null}
            </div>
          </div>
        )}

        {item.imageUrl ? (
          <div className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="line-clamp-2 text-sm font-semibold leading-snug">
                {item.title}
              </h2>
              {item.isFavorite ? (
                <StarIcon className="size-4 shrink-0 fill-primary text-primary" />
              ) : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {item.source ?? getHostname(item.url)}
            </p>
          </div>
        ) : null}
      </a>

      <div className="flex items-center justify-between gap-2 border-t border-border/60 px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[11px]">
              {tag}
            </Badge>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => onOpenDetails(item)}
        >
          <MessageSquareTextIcon className="size-4" />
          Note
        </Button>
      </div>
    </article>
  );
}

export function ArchiveBrowser({ items, tags }: ArchiveBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedTagSlug, setSelectedTagSlug] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ArchiveItemRecord | null>(
    null,
  );

  const filteredItems = useMemo(
    () =>
      filterArchiveItems(items, {
        search,
        tagSlug: selectedTagSlug,
        favoritesOnly,
      }),
    [items, search, selectedTagSlug, favoritesOnly],
  );

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-8 p-8">
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm px-2 py-1 -mx-2 text-sm font-medium text-stone-400 transition-colors hover:bg-stone-800/80 hover:text-stone-100"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to home
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Arthur&apos;s Archive</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A messy but browsable dump of internet gold nuggets collected over
              time.
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
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
                    variant={
                      selectedTagSlug === tag.slug ? "default" : "outline"
                    }
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

            <p className="text-xs text-muted-foreground">
              Showing {filteredItems.length} of {items.length} finds
            </p>
          </div>
        ) : null}

        {items.length === 0 ? (
          <ArchiveEmptyState />
        ) : filteredItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 px-6 py-10 text-center">
            <p className="text-sm font-medium">No items match these filters.</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="mb-4 break-inside-avoid">
                <ArchiveCard
                  item={item}
                  index={index}
                  onOpenDetails={setSelectedItem}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Drawer
        direction="right"
        open={Boolean(selectedItem)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
          }
        }}
      >
        <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-md">
          {selectedItem ? (
            <div className="overflow-y-auto p-6">
              <DrawerHeader className="px-0">
                <DrawerTitle>{selectedItem.title}</DrawerTitle>
                <DrawerDescription>
                  {selectedItem.source ?? getHostname(selectedItem.url)}
                </DrawerDescription>
              </DrawerHeader>

              <div className="mt-6 space-y-6">
                {selectedItem.imageUrl ? (
                  <div className="overflow-hidden rounded-lg border border-border/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedItem.imageUrl}
                      alt=""
                      className="w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {selectedItem.isFavorite ? (
                    <Badge variant="outline" className="gap-1">
                      <StarIcon className="size-3 fill-current" />
                      Favorite
                    </Badge>
                  ) : null}
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    Note
                  </h3>
                  <p className="text-sm leading-relaxed">
                    {selectedItem.note ?? "No note for this item yet."}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
                  >
                    Visit
                  </a>
                  <DrawerClose asChild>
                    <Button variant="outline" className="flex-1">
                      Close
                    </Button>
                  </DrawerClose>
                </div>
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    </>
  );
}
