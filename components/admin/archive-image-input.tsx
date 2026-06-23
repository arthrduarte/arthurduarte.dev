"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UploadIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ArchiveImageInputProps = {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  pastedFile: File | null;
  onPastedFileChange: (file: File | null) => void;
};

export function ArchiveImageInput({
  imageUrl,
  onImageUrlChange,
  pastedFile,
  onPastedFileChange,
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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="size-4" />
          Upload image
        </Button>
        {pastedFile || imageUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onPastedFileChange(null);
              onImageUrlChange("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            <XIcon className="size-4" />
            Clear image
          </Button>
        ) : null}
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="imageUrl">External image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          placeholder="https://..."
          onChange={(event) => {
            onPastedFileChange(null);
            onImageUrlChange(event.target.value);
          }}
        />
      </div>

      <p className="text-xs text-zinc-500">
        Paste an image anywhere on the page, upload a file, or paste an external
        URL. Uploaded images are stored in Vercel Blob.
      </p>

      {activePreview ? (
        <div
          className={cn(
            "overflow-hidden rounded-md border border-zinc-200 bg-zinc-50",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePreview}
            alt="Archive item preview"
            className="max-h-48 w-full object-cover"
          />
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500">
          No image selected
        </div>
      )}
    </div>
  );
}
