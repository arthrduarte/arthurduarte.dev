import { dedupeTagNames } from "@/lib/archive/tags";
import { parseImageUrl } from "@/lib/archive/images";
import type {
  ArchiveItemFormInput,
  CreateArchiveItemInput,
  RestoreArchiveItemInput,
  SoftDeleteArchiveItemInput,
  UpdateArchiveItemInput,
} from "@/lib/archive/types";

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseTagNames(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return dedupeTagNames(
      parsed.filter((value): value is string => typeof value === "string"),
    );
  } catch {
    return dedupeTagNames(raw.split(","));
  }
}

function parseOptionalText(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return value.length > 0 ? value : null;
}

export function parseArchiveItemFormInput(
  formData: FormData,
): ArchiveItemFormInput {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const note = parseOptionalText(formData.get("note"));
  const isFavorite = formData.get("isFavorite") === "true";
  const tagNames = parseTagNames(formData.get("tags"));
  const imageUrl = parseImageUrl(formData.get("imageUrl"));

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!url) {
    throw new Error("URL is required.");
  }

  if (!isValidUrl(url)) {
    throw new Error("URL must be a valid http or https link.");
  }

  return {
    title,
    url,
    note,
    isFavorite,
    tagNames,
    imageUrl,
  };
}

export function parseCreateArchiveItemInput(
  formData: FormData,
): CreateArchiveItemInput {
  return parseArchiveItemFormInput(formData);
}

export function parseUpdateArchiveItemInput(
  formData: FormData,
): UpdateArchiveItemInput {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Archive item id is required.");
  }

  return {
    id,
    ...parseArchiveItemFormInput(formData),
  };
}

export function parseSoftDeleteArchiveItemInput(
  formData: FormData,
): SoftDeleteArchiveItemInput {
  const id = String(formData.get("id") ?? "").trim();
  const deletedReason = String(formData.get("deletedReason") ?? "").trim();

  if (!id) {
    throw new Error("Archive item id is required.");
  }

  if (!deletedReason) {
    throw new Error("Deletion reason is required.");
  }

  return {
    id,
    deletedReason,
  };
}

export function parseRestoreArchiveItemInput(
  formData: FormData,
): RestoreArchiveItemInput {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Archive item id is required.");
  }

  return { id };
}
