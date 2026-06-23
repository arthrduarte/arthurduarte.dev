import type { Metadata } from "next";

import { ArchiveBrowser } from "@/components/archive/archive-browser";
import {
  getActiveArchiveItemsWithTags,
  getAllArchiveTags,
} from "@/lib/archive/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Arthur's Archive | Arthur Duarte",
  description:
    "A messy but browsable dump of internet gold nuggets collected over time.",
};

export default async function ArchivePage() {
  const [items, tags] = await Promise.all([
    getActiveArchiveItemsWithTags(),
    getAllArchiveTags(),
  ]);

  return (
    <div className="fixed inset-0 z-40 overflow-auto">
      <ArchiveBrowser items={items} tags={tags} />
    </div>
  );
}
