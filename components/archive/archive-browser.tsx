"use client";

import { useMemo, useState } from "react";
import { ArrowLeftIcon, SearchIcon, StarIcon } from "lucide-react";
import Link from "next/link";

import { ArchiveConstellation } from "@/components/archive/archive-constellation";
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

function ArchiveHeader() {
  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="-mx-2 flex w-fit items-center gap-2 rounded-sm px-2 py-1 text-sm font-medium text-stone-400 transition-colors hover:bg-stone-800/80 hover:text-stone-100"
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
  );
}

export function ArchiveBrowser({ items, tags }: ArchiveBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedTagSlug, setSelectedTagSlug] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ArchiveItemRecord | null>(
    null,
  );

  const filterActive =
    search.trim().length > 0 || selectedTagSlug !== null || favoritesOnly;

  // The canvas keeps every node mounted and dims non-matches, so we pass the
  // set of matching ids (or null when nothing is filtered) rather than a
  // pruned list.
  const matchedIds = useMemo(() => {
    if (!filterActive) {
      return null;
    }
    const matched = filterArchiveItems(items, {
      search,
      tagSlug: selectedTagSlug,
      favoritesOnly,
    });
    return new Set(matched.map((item) => item.id));
  }, [items, search, selectedTagSlug, favoritesOnly, filterActive]);

  const matchCount = matchedIds ? matchedIds.size : items.length;

  return (
    <>
      {items.length === 0 ? (
        <div className="mx-auto max-w-6xl space-y-8 p-8">
          <ArchiveHeader />
          <ArchiveEmptyState />
        </div>
      ) : (
        <div className="relative h-full w-full">
          <ArchiveConstellation
            items={items}
            matchedIds={matchedIds}
            onOpenDetails={setSelectedItem}
          />

          {/* Floating control rail — overlaid on the canvas. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-3 p-4 sm:p-6">
            <div className="pointer-events-auto flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-md border border-border/70 bg-card/80 px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition hover:border-border hover:text-foreground"
              >
                <ArrowLeftIcon className="size-4" /> Home
              </Link>

              <div className="relative min-w-0 flex-1 sm:max-w-sm">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search the constellation"
                  className="border-border/70 bg-card/80 pl-9 shadow-sm backdrop-blur-sm"
                />
              </div>

              <Button
                type="button"
                variant={favoritesOnly ? "default" : "outline"}
                className={favoritesOnly ? "" : "bg-card/80 backdrop-blur-sm"}
                onClick={() => setFavoritesOnly((current) => !current)}
              >
                <StarIcon className="size-4" />
                Favorites
              </Button>

              <span className="ml-auto rounded-md border border-border/60 bg-card/70 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                {filterActive
                  ? `${matchCount} of ${items.length}`
                  : `${items.length} finds`}
              </span>
            </div>

            {tags.length > 0 ? (
              <div className="pointer-events-auto flex max-w-full flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={selectedTagSlug === null ? "default" : "outline"}
                  className={
                    selectedTagSlug === null ? "" : "bg-card/80 backdrop-blur-sm"
                  }
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
                    className={
                      selectedTagSlug === tag.slug
                        ? ""
                        : "bg-card/80 backdrop-blur-sm"
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
          </div>
        </div>
      )}

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
