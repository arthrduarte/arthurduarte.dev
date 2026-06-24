import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const archiveItems = pgTable("archive_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  note: text("note"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  foundAt: timestamp("found_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  deletedReason: text("deleted_reason"),
});

export const archiveTags = pgTable("archive_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const archiveItemTags = pgTable(
  "archive_item_tags",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => archiveItems.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => archiveTags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.itemId, table.tagId] })],
);

export const archiveItemsRelations = relations(archiveItems, ({ many }) => ({
  itemTags: many(archiveItemTags),
}));

export const archiveTagsRelations = relations(archiveTags, ({ many }) => ({
  itemTags: many(archiveItemTags),
}));

export const archiveItemTagsRelations = relations(
  archiveItemTags,
  ({ one }) => ({
    item: one(archiveItems, {
      fields: [archiveItemTags.itemId],
      references: [archiveItems.id],
    }),
    tag: one(archiveTags, {
      fields: [archiveItemTags.tagId],
      references: [archiveTags.id],
    }),
  }),
);
