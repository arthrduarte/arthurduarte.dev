import { normalizeTagSlug } from "@/lib/archive/tags";
import type { ArchiveItemRecord } from "@/lib/archive/types";

export type ArchiveBrowseFilters = {
  search: string;
  tagSlug: string | null;
  favoritesOnly: boolean;
};

export function filterArchiveItems(
  items: ArchiveItemRecord[],
  filters: ArchiveBrowseFilters,
): ArchiveItemRecord[] {
  const search = filters.search.trim().toLowerCase();

  return items.filter((item) => {
    if (filters.favoritesOnly && !item.isFavorite) {
      return false;
    }

    if (filters.tagSlug && !item.tagSlugs.includes(filters.tagSlug)) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [
      item.title,
      item.url,
      item.note ?? "",
      item.source ?? "",
      ...item.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

export function getArchiveTagSlug(tagName: string): string {
  return normalizeTagSlug(tagName);
}
