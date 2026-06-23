import { and, asc, eq, isNull } from "drizzle-orm";

import { archiveItems, archiveTags } from "@/db/schema";
import type { ArchiveItemRecord, ArchiveTagOption } from "@/lib/archive/types";
import { getDb } from "@/lib/db";

function mapItemRecord(item: {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  note: string | null;
  isFavorite: boolean;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
  itemTags: Array<{ tag: { name: string; slug: string } }>;
}): ArchiveItemRecord {
  const tags = item.itemTags
    .map((itemTag) => itemTag.tag.name)
    .sort((left, right) => left.localeCompare(right));

  return {
    id: item.id,
    title: item.title,
    url: item.url,
    imageUrl: item.imageUrl,
    note: item.note,
    isFavorite: item.isFavorite,
    source: item.source,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    tags,
    tagSlugs: item.itemTags
      .map((itemTag) => itemTag.tag.slug)
      .sort((left, right) => left.localeCompare(right)),
  };
}

export async function getActiveArchiveItems() {
  const db = getDb();

  return db
    .select()
    .from(archiveItems)
    .where(isNull(archiveItems.deletedAt))
    .orderBy(asc(archiveItems.createdAt));
}

export async function getAllArchiveTags(): Promise<ArchiveTagOption[]> {
  const db = getDb();

  const tags = await db.select().from(archiveTags).orderBy(asc(archiveTags.name));

  return tags.map((tag) => ({
    name: tag.name,
    slug: tag.slug,
  }));
}

export async function getActiveArchiveItemsWithTags(): Promise<
  ArchiveItemRecord[]
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

  return items.map(mapItemRecord);
}

export async function getActiveArchiveItemById(
  id: string,
): Promise<ArchiveItemRecord | null> {
  const db = getDb();

  const item = await db.query.archiveItems.findFirst({
    where: and(eq(archiveItems.id, id), isNull(archiveItems.deletedAt)),
    with: {
      itemTags: {
        with: {
          tag: true,
        },
      },
    },
  });

  return item ? mapItemRecord(item) : null;
}
