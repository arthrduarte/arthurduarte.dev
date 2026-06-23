import { eq } from "drizzle-orm";

import {
  archiveItemTags,
  archiveItems,
  archiveTags,
} from "@/db/schema";
import type { Database } from "@/lib/db";
import { getDb } from "@/lib/db";
import { normalizeTagName, normalizeTagSlug } from "@/lib/archive/tags";
import type { CreateArchiveItemInput } from "@/lib/archive/types";

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

export async function createArchiveItem(input: CreateArchiveItemInput) {
  const db = getDb();
  const tagIds = await resolveTagIds(db, input.tagNames);

  const [item] = await db
    .insert(archiveItems)
    .values({
      title: input.title,
      url: input.url,
      note: input.note,
      isFavorite: input.isFavorite,
    })
    .returning({ id: archiveItems.id });

  if (tagIds.length > 0) {
    await db.insert(archiveItemTags).values(
      tagIds.map((tagId) => ({
        itemId: item.id,
        tagId,
      })),
    );
  }

  return item;
}
