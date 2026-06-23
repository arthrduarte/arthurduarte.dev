import { asc, isNull } from "drizzle-orm";

import { archiveItems } from "@/db/schema";
import { getDb } from "@/lib/db";

export async function getActiveArchiveItems() {
  const db = getDb();

  return db
    .select()
    .from(archiveItems)
    .where(isNull(archiveItems.deletedAt))
    .orderBy(asc(archiveItems.createdAt));
}
