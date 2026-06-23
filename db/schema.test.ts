import { getTableColumns } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import {
  archiveItemTags,
  archiveItems,
  archiveTags,
} from "@/db/schema";

describe("archive schema", () => {
  it("defines archive item fields required by the PRD", () => {
    const columns = Object.keys(getTableColumns(archiveItems));

    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "title",
        "url",
        "imageUrl",
        "note",
        "isFavorite",
        "source",
        "foundAt",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "deletedReason",
      ]),
    );
  });

  it("defines tag display name and normalized slug", () => {
    const columns = Object.keys(getTableColumns(archiveTags));

    expect(columns).toEqual(expect.arrayContaining(["id", "name", "slug"]));
  });

  it("defines item-tag join keys", () => {
    const columns = Object.keys(getTableColumns(archiveItemTags));

    expect(columns).toEqual(expect.arrayContaining(["itemId", "tagId"]));
  });
});
