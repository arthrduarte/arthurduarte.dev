"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Person } from "@/lib/family-data";
import { FAMILY_PORTRAIT_PLACEHOLDER, getPortraitCandidates } from "@/lib/family-data";

type FamilyPortraitProps = {
  person: Pick<Person, "id" | "slug" | "portrait" | "name">;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function FamilyPortrait({
  person,
  alt,
  width,
  height,
  className,
  priority = false,
}: FamilyPortraitProps) {
  const sources = useMemo(
    () => [...getPortraitCandidates(person), FAMILY_PORTRAIT_PLACEHOLDER],
    [person],
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const source = sources[sourceIndex] ?? FAMILY_PORTRAIT_PLACEHOLDER;

  return (
    <Image
      key={source}
      src={source}
      alt={alt ?? person.name}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        setSourceIndex((current) => {
          if (current >= sources.length - 1) {
            return current;
          }
          return current + 1;
        });
      }}
    />
  );
}
