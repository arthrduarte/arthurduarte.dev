import type { Metadata } from "next";

import { CreateArchiveItemForm } from "@/components/admin/create-archive-item-form";
import { ArchiveItemList } from "@/components/admin/archive-item-list";
import { isBlobStorageConfigured } from "@/lib/archive/images";
import {
  getActiveArchiveItemsWithTags,
  getAllArchiveTags,
} from "@/lib/archive/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archive Admin | Arthur Duarte",
  description: "Manage Arthur's Archive items.",
};

export default async function AdminArchivePage() {
  const [items, tags] = await Promise.all([
    getActiveArchiveItemsWithTags(),
    getAllArchiveTags(),
  ]);
  const existingTags = tags.map((tag) => tag.name);
  const blobConfigured = isBlobStorageConfigured();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Archive</h1>
        <p className="text-sm text-muted-foreground">
          Manage active public archive items.
        </p>
      </div>

      <CreateArchiveItemForm
        existingTags={existingTags}
        blobConfigured={blobConfigured}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          Active items{" "}
          <span className="font-mono text-muted-foreground">
            ({items.length})
          </span>
        </h2>
        <ArchiveItemList
          items={items}
          existingTags={existingTags}
          blobConfigured={blobConfigured}
        />
      </section>
    </div>
  );
}
