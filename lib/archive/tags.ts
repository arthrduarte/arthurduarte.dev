export function normalizeTagName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeTagSlug(name: string): string {
  return normalizeTagName(name)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function dedupeTagNames(tagNames: string[]): string[] {
  const uniqueBySlug = new Map<string, string>();

  for (const rawName of tagNames) {
    const name = normalizeTagName(rawName);

    if (!name) {
      continue;
    }

    const slug = normalizeTagSlug(name);

    if (!slug || uniqueBySlug.has(slug)) {
      continue;
    }

    uniqueBySlug.set(slug, name);
  }

  return [...uniqueBySlug.values()];
}
