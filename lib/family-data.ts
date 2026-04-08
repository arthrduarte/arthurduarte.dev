import peopleData from "@/family-data/people.json";

export const FAMILY_PORTRAIT_PLACEHOLDER = "/family-photos/portrait-placeholder.jpg";

export type Person = {
  id: string;
  slug: string;
  name: string;
  birth: string | null;
  death: string | null;
  parents: string[];
  spouse: string[];
  children: string[];
  siblings: string[];
  cousins?: string[];
  unclesAunts?: string[];
  bio: string;
  portrait: string;
  gallery: string[];
  videos: string[];
};

export type FamilyData = {
  rootPersonId: string;
  people: Person[];
};

export const familyData = peopleData as FamilyData;

export const peopleById = new Map<string, Person>(
  familyData.people.map((person) => [person.id, person]),
);

export function getPersonById(id: string): Person | undefined {
  return peopleById.get(id);
}

export function formatLifeRange(person: Person): string {
  return `${person.birth ?? "Unknown"} - ${person.death ?? "Present"}`;
}

export function getSideRelativeIds(person: Person): string[] {
  return [...(person.siblings ?? []), ...(person.cousins ?? []), ...(person.unclesAunts ?? [])];
}

export function getPortraitCandidates(person: Pick<Person, "id" | "slug" | "portrait">): string[] {
  const candidates = new Set<string>();
  const baseNames = Array.from(new Set([person.id, person.slug].filter(Boolean)));
  const extensions = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".webp", ".WEBP"];

  if (person.portrait && person.portrait !== FAMILY_PORTRAIT_PLACEHOLDER) {
    candidates.add(person.portrait);
  }

  for (const baseName of baseNames) {
    for (const extension of extensions) {
      candidates.add(`/family-photos/${baseName}${extension}`);
    }
  }

  return Array.from(candidates);
}
