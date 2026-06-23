import { asc, isNull } from "drizzle-orm";

import {
  archiveItems,
  archiveTags,
} from "@/db/schema";
import type { ArchiveItemWithTags } from "@/lib/archive/types";
import { getDb } from "@/lib/db";

export async function getActiveArchiveItems() {
  const db = getDb();

  return db
    .select()
    .from(archiveItems)
    .where(isNull(archiveItems.deletedAt))
    .orderBy(asc(archiveItems.createdAt));
}

export async function getAllArchiveTags() {
  const db = getDb();

  return db.select().from(archiveTags).orderBy(asc(archiveTags.name));
}

export async function getActiveArchiveItemsWithTags(): Promise<
  ArchiveItemWithTags[]
> {
  const db = getDb();

  const items = await db.query.archiveItems.findMany({
    where: isNull(archiveItems.deletedAt),
    with: {
      itemTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: asc(archiveItems.createdAt),
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    note: item.note,
    isFavorite: item.isFavorite,
    createdAt: item.createdAt,
    tags: item.itemTags
      .map((itemTag) => itemTag.tag.name)
      .sort((left, right) => left.localeCompare(right)),
  }));
}
