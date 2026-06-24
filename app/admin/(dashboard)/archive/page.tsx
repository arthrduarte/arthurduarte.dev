import type { Metadata } from "next";

import { AdminArchiveManager } from "@/components/admin/admin-archive-manager";
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

      <AdminArchiveManager
        items={items}
        tags={tags}
        existingTags={existingTags}
        blobConfigured={blobConfigured}
      />
    </div>
  );
}
