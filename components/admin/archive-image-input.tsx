"use client";

import { useEffect, useRef, useState } from "react";
import { UploadIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ArchiveImageInputProps = {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  pastedFile: File | null;
  onPastedFileChange: (file: File | null) => void;
  blobConfigured?: boolean;
};

export function ArchiveImageInput({
  imageUrl,
  onImageUrlChange,
  pastedFile,
  onPastedFileChange,
  blobConfigured = true,
}: ArchiveImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pastedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(pastedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [pastedFile]);

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      const item = event.clipboardData?.items[0];

      if (!item?.type.startsWith("image/")) {
        return;
      }

      const file = item.getAsFile();

      if (file) {
        onPastedFileChange(file);
      }
    }

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [onPastedFileChange]);

  const activePreview = previewUrl ?? (imageUrl || null);

  function clearImage() {
    onPastedFileChange(null);
    onImageUrlChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        name="imageFile"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          onPastedFileChange(file);
        }}
      />

      {activePreview ? (
        <div className="group relative overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePreview}
            alt="Archive item preview"
            className="aspect-video w-full object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs text-foreground opacity-0 backdrop-blur-sm transition group-hover:opacity-100 focus-visible:opacity-100"
          >
            <XIcon className="size-3.5" />
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground transition hover:border-primary/50 hover:bg-muted/50 hover:text-foreground",
          )}
        >
          <UploadIcon className="size-6" />
          <span className="font-medium">Click to upload</span>
          <span className="text-xs">or drop / paste an image anywhere</span>
        </button>
      )}

      <Input
        id="imageUrl"
        name="imageUrl"
        value={imageUrl}
        placeholder="…or paste an external image URL"
        onChange={(event) => {
          onPastedFileChange(null);
          onImageUrlChange(event.target.value);
        }}
      />

      {!blobConfigured ? (
        <p className="text-xs text-destructive">
          BLOB_READ_WRITE_TOKEN is not configured. External image URLs still
          work, but upload and clipboard paste require Blob storage. See
          docs/arthurs-archive-setup.md.
        </p>
      ) : null}
    </div>
  );
}
