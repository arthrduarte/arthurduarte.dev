import { ArchiveBrowser } from "@/components/archive/archive-browser";
import {
  getActiveArchiveItemsWithTags,
  getAllArchiveTags,
} from "@/lib/archive/queries";

export const dynamic = "force-dynamic";

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
