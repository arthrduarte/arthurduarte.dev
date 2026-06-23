import { describe, expect, it } from "vitest";

import { filterArchiveItems } from "@/lib/archive/filters";
import type { ArchiveItemRecord } from "@/lib/archive/types";

const sampleItems: ArchiveItemRecord[] = [
  {
    id: "1",
    title: "Design systems essay",
    url: "https://example.com/design",
    imageUrl: null,
    note: "Great overview",
    isFavorite: true,
    source: "example.com",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    tags: ["Design"],
    tagSlugs: ["design"],
  },
  {
    id: "2",
    title: "Random link",
    url: "https://news.ycombinator.com",
    imageUrl: null,
    note: null,
    isFavorite: false,
    source: "HN",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
    tags: ["News"],
    tagSlugs: ["news"],
  },
];

describe("filterArchiveItems", () => {
  it("filters by search, tag slug, and favorites", () => {
    expect(
      filterArchiveItems(sampleItems, {
        search: "design",
        tagSlug: null,
        favoritesOnly: false,
      }),
    ).toHaveLength(1);

    expect(
      filterArchiveItems(sampleItems, {
        search: "",
        tagSlug: "news",
        favoritesOnly: false,
      }),
    ).toEqual([sampleItems[1]]);

    expect(
      filterArchiveItems(sampleItems, {
        search: "",
        tagSlug: null,
        favoritesOnly: true,
      }),
    ).toEqual([sampleItems[0]]);
  });
});
