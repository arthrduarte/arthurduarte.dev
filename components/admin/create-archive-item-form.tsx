import { ArchiveItemForm } from "@/components/admin/archive-item-form";

type CreateArchiveItemFormProps = {
  existingTags: string[];
};

export function CreateArchiveItemForm({
  existingTags,
}: CreateArchiveItemFormProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold text-zinc-900">Add archive item</h2>
        <p className="text-sm text-zinc-500">
          New items are public immediately.
        </p>
      </div>

      <ArchiveItemForm existingTags={existingTags} />
    </div>
  );
}
