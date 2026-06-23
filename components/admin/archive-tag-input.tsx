"use client";

import { useMemo, useState } from "react";
import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  dedupeTagNames,
  normalizeTagName,
  normalizeTagSlug,
} from "@/lib/archive/tags";

type ArchiveTagInputProps = {
  existingTags: string[];
  initialTags?: string[];
};

export function ArchiveTagInput({
  existingTags,
  initialTags = [],
}: ArchiveTagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return existingTags
      .filter((tag) => {
        const slug = normalizeTagSlug(tag);
        const isAlreadySelected = tags.some(
          (selectedTag) => normalizeTagSlug(selectedTag) === slug,
        );

        if (isAlreadySelected) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return tag.toLowerCase().includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [existingTags, query, tags]);

  function addTag(rawName: string) {
    const name = normalizeTagName(rawName);

    if (!name) {
      return;
    }

    setTags((currentTags) => dedupeTagNames([...currentTags, name]));
    setQuery("");
    setIsOpen(false);
  }

  function removeTag(tagToRemove: string) {
    const slug = normalizeTagSlug(tagToRemove);

    setTags((currentTags) =>
      currentTags.filter((tag) => normalizeTagSlug(tag) !== slug),
    );
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name="tags" value={JSON.stringify(tags)} />

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                className="rounded-sm opacity-70 transition hover:opacity-100"
                aria-label={`Remove ${tag}`}
                onClick={() => removeTag(tag)}
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="relative">
        <Input
          value={query}
          placeholder="Type a tag and press Enter"
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addTag(query);
            }
          }}
        />

        {isOpen && suggestions.length > 0 ? (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-zinc-200 bg-white py-1 shadow-sm">
            {suggestions.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
