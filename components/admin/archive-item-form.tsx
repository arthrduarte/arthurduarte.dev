"use client";

import { useActionState, useEffect, useState } from "react";
import { SparklesIcon, StarIcon } from "lucide-react";

import {
  createArchiveItemAction,
  prefillArchiveMetadataAction,
  updateArchiveItemAction,
  type ArchiveActionState,
} from "@/app/admin/archive/actions";
import { ArchiveImageInput } from "@/components/admin/archive-image-input";
import { ArchiveTagInput } from "@/components/admin/archive-tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ArchiveItemRecord } from "@/lib/archive/types";

const initialState: ArchiveActionState = {};

type ArchiveItemFormProps = {
  existingTags: string[];
  item?: ArchiveItemRecord;
  blobConfigured?: boolean;
  onSuccess?: () => void;
};

export function ArchiveItemForm({
  existingTags,
  item,
  blobConfigured = true,
  onSuccess,
}: ArchiveItemFormProps) {
  const isEditing = Boolean(item);
  const action = isEditing ? updateArchiveItemAction : createArchiveItemAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [formKey, setFormKey] = useState(0);
  const [tagInputKey, setTagInputKey] = useState(0);
  const [title, setTitle] = useState(item?.title ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [isFavorite, setIsFavorite] = useState(item?.isFavorite ?? false);
  const [pastedFile, setPastedFile] = useState<File | null>(null);
  const [prefillError, setPrefillError] = useState<string | null>(null);
  const [isPrefilling, setIsPrefilling] = useState(false);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    if (isEditing) {
      onSuccess?.();
      return;
    }

    setTitle("");
    setUrl("");
    setNote("");
    setImageUrl("");
    setIsFavorite(false);
    setPastedFile(null);
    setFormKey((current) => current + 1);
    setTagInputKey((current) => current + 1);
    onSuccess?.();
  }, [state.success, isEditing, onSuccess]);

  async function handlePrefill() {
    setPrefillError(null);
    setIsPrefilling(true);

    try {
      const result = await prefillArchiveMetadataAction(url);

      if (result.error) {
        setPrefillError(result.error);
        return;
      }

      if (result.metadata?.title) {
        setTitle(result.metadata.title);
      }

      if (result.metadata?.description) {
        setNote(result.metadata.description);
      }

      if (result.metadata?.imageUrl) {
        setImageUrl(result.metadata.imageUrl);
        setPastedFile(null);
      }
    } finally {
      setIsPrefilling(false);
    }
  }

  return (
    <form
      key={formKey}
      action={async (formData) => {
        if (pastedFile) {
          formData.set("imageFile", pastedFile);
        }

        formData.set("isFavorite", isFavorite ? "true" : "false");
        await formAction(formData);
      }}
      className="space-y-5"
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
        <Label htmlFor={item ? `url-${item.id}` : "url"}>
          Paste a link to start
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id={item ? `url-${item.id}` : "url"}
            name="url"
            type="url"
            required
            placeholder="https://…"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            disabled={isPrefilling || !url.trim()}
            onClick={handlePrefill}
          >
            <SparklesIcon className="size-4" />
            {isPrefilling ? "Prefilling..." : "Autofill"}
          </Button>
        </div>
        {prefillError ? (
          <p className="text-sm text-destructive">{prefillError}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Pulls the title, image, and note from the page.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Image</Label>
        <ArchiveImageInput
          imageUrl={imageUrl}
          onImageUrlChange={setImageUrl}
          pastedFile={pastedFile}
          onPastedFileChange={setPastedFile}
          blobConfigured={blobConfigured}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={item ? `title-${item.id}` : "title"}>Title</Label>
          <Input
            id={item ? `title-${item.id}` : "title"}
            name="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={item ? `note-${item.id}` : "note"}>Note</Label>
          <Textarea
            id={item ? `note-${item.id}` : "note"}
            name="note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <ArchiveTagInput
            key={tagInputKey}
            existingTags={existingTags}
            initialTags={item?.tags ?? []}
          />
        </div>
      </div>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      {state.success && !isEditing ? (
        <p className="text-sm text-primary">Archive item created.</p>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setIsFavorite((current) => !current)}
          aria-pressed={isFavorite}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
            isFavorite
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <StarIcon
            className={cn("size-4", isFavorite && "fill-primary")}
          />
          Favorite
        </button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Save changes" : "Save item"}
        </Button>
      </div>
    </form>
  );
}
