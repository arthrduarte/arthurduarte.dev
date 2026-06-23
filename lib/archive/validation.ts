import type { CreateArchiveItemInput } from "@/lib/archive/types";
import { dedupeTagNames } from "@/lib/archive/tags";

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

export function parseCreateArchiveItemInput(
  formData: FormData,
): CreateArchiveItemInput {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const noteValue = String(formData.get("note") ?? "").trim();
  const note = noteValue.length > 0 ? noteValue : null;
  const isFavorite = formData.get("isFavorite") === "true";
  const tagNames = parseTagNames(formData.get("tags"));

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
  };
}
