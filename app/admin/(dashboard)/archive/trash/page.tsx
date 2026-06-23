import { getDeletedArchiveItemsWithTags } from "@/lib/archive/queries";
import { ArchiveTrashList } from "@/components/admin/archive-trash-list";

export const dynamic = "force-dynamic";

export default async function AdminArchiveTrashPage() {
  const items = await getDeletedArchiveItemsWithTags();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-zinc-900">Trash</h1>
        <p className="text-sm text-zinc-600">
          Review deleted archive items and restore them when needed.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">
          Deleted items ({items.length})
        </h2>
        <ArchiveTrashList items={items} />
      </section>
    </div>
  );
}
