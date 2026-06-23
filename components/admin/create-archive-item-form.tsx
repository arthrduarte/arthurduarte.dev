import { ArchiveItemForm } from "@/components/admin/archive-item-form";

type CreateArchiveItemFormProps = {
  existingTags: string[];
  blobConfigured: boolean;
};

export function CreateArchiveItemForm({
  existingTags,
  blobConfigured,
}: CreateArchiveItemFormProps) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <div className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold text-foreground">
          Add archive item
        </h2>
        <p className="text-sm text-muted-foreground">
          New items are public immediately.
        </p>
      </div>

      <ArchiveItemForm
        existingTags={existingTags}
        blobConfigured={blobConfigured}
      />
    </div>
  );
}
