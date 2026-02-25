import peopleData from "@/family-data/people.json";

export type Person = {
  id: string;
  slug: string;
  name: string;
  birth: string;
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
  return `${person.birth} - ${person.death ?? "Present"}`;
}

export function getSideRelativeIds(person: Person): string[] {
  return [...(person.siblings ?? []), ...(person.cousins ?? []), ...(person.unclesAunts ?? [])];
}
