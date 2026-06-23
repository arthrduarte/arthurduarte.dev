import { CreateArchiveItemForm } from "@/components/admin/create-archive-item-form";
import { ArchiveItemList } from "@/components/admin/archive-item-list";
import {
  getActiveArchiveItemsWithTags,
  getAllArchiveTags,
} from "@/lib/archive/queries";

export const dynamic = "force-dynamic";

export default async function AdminArchivePage() {
  const [items, tags] = await Promise.all([
    getActiveArchiveItemsWithTags(),
    getAllArchiveTags(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-zinc-900">Archive</h1>
        <p className="text-sm text-zinc-600">
          Manage active public archive items.
        </p>
      </div>

      <CreateArchiveItemForm existingTags={tags.map((tag) => tag.name)} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">
          Active items ({items.length})
        </h2>
        <ArchiveItemList items={items} />
      </section>
    </div>
  );
}
