import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm";

import { archiveItems, archiveTags } from "@/db/schema";
import type {
  ArchiveItemRecord,
  ArchiveTagOption,
  DeletedArchiveItemRecord,
} from "@/lib/archive/types";
import { getDb } from "@/lib/db";

function mapItemRecord(item: {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  note: string | null;
  isFavorite: boolean;
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

function mapDeletedItemRecord(item: {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  note: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deletedReason: string | null;
  itemTags: Array<{ tag: { name: string; slug: string } }>;
}): DeletedArchiveItemRecord {
  const base = mapItemRecord(item);

  if (!item.deletedAt || !item.deletedReason) {
    throw new Error("Deleted archive item is missing deletion metadata.");
  }

  return {
    ...base,
    deletedAt: item.deletedAt,
    deletedReason: item.deletedReason,
  };
}

export async function getDeletedArchiveItemsWithTags(): Promise<
  DeletedArchiveItemRecord[]
> {
  const db = getDb();

  const items = await db.query.archiveItems.findMany({
    where: isNotNull(archiveItems.deletedAt),
    with: {
      itemTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: desc(archiveItems.deletedAt),
  });

  return items.map(mapDeletedItemRecord);
}
