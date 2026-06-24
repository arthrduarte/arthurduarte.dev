import { and, eq, isNotNull, isNull } from "drizzle-orm";

import {
  archiveItemTags,
  archiveItems,
  archiveTags,
} from "@/db/schema";
import type { Database } from "@/lib/db";
import { getDb } from "@/lib/db";
import { normalizeTagName, normalizeTagSlug } from "@/lib/archive/tags";
import type {
  CreateArchiveItemInput,
  UpdateArchiveItemInput,
} from "@/lib/archive/types";

async function findOrCreateTagId(
  db: Database,
  name: string,
  slug: string,
): Promise<string> {
  const existing = await db.query.archiveTags.findFirst({
    where: eq(archiveTags.slug, slug),
    columns: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  try {
    const [created] = await db
      .insert(archiveTags)
      .values({ name, slug })
      .returning({ id: archiveTags.id });

    return created.id;
  } catch {
    const fallback = await db.query.archiveTags.findFirst({
      where: eq(archiveTags.slug, slug),
      columns: { id: true },
    });

    if (!fallback) {
      throw new Error(`Unable to create tag "${name}".`);
    }

    return fallback.id;
  }
}

export async function resolveTagIds(
  db: Database,
  tagNames: string[],
): Promise<string[]> {
  const tagIds: string[] = [];

  for (const rawName of tagNames) {
    const name = normalizeTagName(rawName);
    const slug = normalizeTagSlug(name);

    if (!name || !slug) {
      continue;
    }

    tagIds.push(await findOrCreateTagId(db, name, slug));
  }

  return [...new Set(tagIds)];
}

async function syncItemTags(
  db: Database,
  itemId: string,
  tagNames: string[],
): Promise<void> {
  const tagIds = await resolveTagIds(db, tagNames);

  await db
    .delete(archiveItemTags)
    .where(eq(archiveItemTags.itemId, itemId));

  if (tagIds.length === 0) {
    return;
  }

  await db.insert(archiveItemTags).values(
    tagIds.map((tagId) => ({
      itemId,
      tagId,
    })),
  );
}

export async function createArchiveItem(input: CreateArchiveItemInput) {
  const db = getDb();

  const [item] = await db
    .insert(archiveItems)
    .values({
      title: input.title,
      url: input.url,
      note: input.note,
      imageUrl: input.imageUrl,
      isFavorite: input.isFavorite,
    })
    .returning({ id: archiveItems.id });

  await syncItemTags(db, item.id, input.tagNames);

  return item;
}

export async function updateArchiveItem(input: UpdateArchiveItemInput) {
  const db = getDb();

  const existing = await db.query.archiveItems.findFirst({
    where: and(eq(archiveItems.id, input.id), isNull(archiveItems.deletedAt)),
    columns: { id: true },
  });

  if (!existing) {
    throw new Error("Archive item not found.");
  }

  await db
    .update(archiveItems)
    .set({
      title: input.title,
      url: input.url,
      note: input.note,
      imageUrl: input.imageUrl,
      isFavorite: input.isFavorite,
      updatedAt: new Date(),
    })
    .where(eq(archiveItems.id, input.id));

  await syncItemTags(db, input.id, input.tagNames);

  return { id: input.id };
}

export async function softDeleteArchiveItem(
  id: string,
  deletedReason: string,
) {
  const db = getDb();

  const existing = await db.query.archiveItems.findFirst({
    where: and(eq(archiveItems.id, id), isNull(archiveItems.deletedAt)),
    columns: { id: true },
  });

  if (!existing) {
    throw new Error("Archive item not found.");
  }

  await db
    .update(archiveItems)
    .set({
      deletedAt: new Date(),
      deletedReason,
      updatedAt: new Date(),
    })
    .where(eq(archiveItems.id, id));

  return { id };
}

export async function restoreArchiveItem(id: string) {
  const db = getDb();

  const existing = await db.query.archiveItems.findFirst({
    where: and(eq(archiveItems.id, id), isNotNull(archiveItems.deletedAt)),
    columns: { id: true },
  });

  if (!existing) {
    throw new Error("Deleted archive item not found.");
  }

  await db
    .update(archiveItems)
    .set({
      deletedAt: null,
      deletedReason: null,
      updatedAt: new Date(),
    })
    .where(eq(archiveItems.id, id));

  return { id };
}
