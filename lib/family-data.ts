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

export type FamilyUnit = {
  id: string;
  parentIds: string[];
  childIds: string[];
};

export type FamilyGraph = {
  peopleById: Map<string, Person>;
  partnerIdsByPersonId: Map<string, string[]>;
  childrenByParentId: Map<string, string[]>;
  familyUnitsByPersonId: Map<string, FamilyUnit[]>;
};

export const familyData = peopleData as FamilyData;

export const peopleById = new Map<string, Person>(
  familyData.people.map((person) => [person.id, person]),
);

export const familyGraph = buildFamilyGraph(familyData);

export function getPersonById(id: string): Person | undefined {
  return peopleById.get(id);
}

export function formatLifeRange(person: Person): string {
  return `${person.birth ?? "Unknown"} - ${person.death ?? "Present"}`;
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

export function buildFamilyGraph(data: FamilyData): FamilyGraph {
  const peopleById = new Map<string, Person>(data.people.map((person) => [person.id, person]));
  const personOrder = new Map<string, number>(data.people.map((person, index) => [person.id, index]));

  const partnerSets = new Map<string, Set<string>>();
  const childrenSets = new Map<string, Set<string>>();
  const familyUnitMap = new Map<string, { parentIds: string[]; childIds: Set<string> }>();

  const ensureSet = (map: Map<string, Set<string>>, key: string) => {
    const existing = map.get(key);
    if (existing) {
      return existing;
    }

    const next = new Set<string>();
    map.set(key, next);
    return next;
  };

  const sortPersonIds = (ids: Iterable<string>) =>
    Array.from(new Set(ids))
      .filter((id) => peopleById.has(id))
      .sort((left, right) => (personOrder.get(left) ?? 0) - (personOrder.get(right) ?? 0));

  const ensureFamilyUnit = (parentIds: string[]) => {
    const normalizedParentIds = sortPersonIds(parentIds);
    const unitId = `family:${normalizedParentIds.join("|")}`;
    const existing = familyUnitMap.get(unitId);

    if (existing) {
      return { id: unitId, unit: existing };
    }

    const unit = {
      parentIds: normalizedParentIds,
      childIds: new Set<string>(),
    };

    familyUnitMap.set(unitId, unit);
    return { id: unitId, unit };
  };

  data.people.forEach((person) => {
    person.spouse.forEach((partnerId) => {
      if (!peopleById.has(partnerId)) {
        return;
      }

      ensureSet(partnerSets, person.id).add(partnerId);
      ensureSet(partnerSets, partnerId).add(person.id);
      ensureFamilyUnit([person.id, partnerId]);
    });
  });

  data.people.forEach((person) => {
    const registeredChildren = new Set<string>();

    person.children.forEach((childId) => {
      if (!peopleById.has(childId)) {
        return;
      }

      registeredChildren.add(childId);
      ensureSet(childrenSets, person.id).add(childId);

      const child = peopleById.get(childId);
      const coParents =
        child?.parents.filter((parentId) => parentId !== person.id && peopleById.has(parentId)) ?? [];
      const parentIds = coParents.length > 0 ? [person.id, ...coParents] : [person.id];
      const { unit } = ensureFamilyUnit(parentIds);

      unit.childIds.add(childId);

      coParents.forEach((coParentId) => {
        ensureSet(partnerSets, person.id).add(coParentId);
        ensureSet(partnerSets, coParentId).add(person.id);
      });
    });

    person.parents.forEach((parentId) => {
      if (!peopleById.has(parentId)) {
        return;
      }

      ensureSet(childrenSets, parentId).add(person.id);
    });

    const validParentIds = sortPersonIds(person.parents);
    if (validParentIds.length > 0) {
      const { unit } = ensureFamilyUnit(validParentIds);
      unit.childIds.add(person.id);

      validParentIds.forEach((parentId) => {
        validParentIds
          .filter((candidateId) => candidateId !== parentId)
          .forEach((coParentId) => {
            ensureSet(partnerSets, parentId).add(coParentId);
          });
      });
    }
  });

  const familyUnits = Array.from(familyUnitMap.entries()).map(([id, unit]) => ({
    id,
    parentIds: unit.parentIds,
    childIds: sortPersonIds(unit.childIds),
  }));

  const familyUnitsByPersonId = new Map<string, FamilyUnit[]>();

  familyUnits.forEach((familyUnit) => {
    familyUnit.parentIds.forEach((parentId) => {
      const currentUnits = familyUnitsByPersonId.get(parentId) ?? [];
      currentUnits.push(familyUnit);
      familyUnitsByPersonId.set(parentId, currentUnits);
    });
  });

  const sortUnits = (units: FamilyUnit[]) =>
    [...units].sort((left, right) => {
      const leftFirstId = left.childIds[0] ?? left.parentIds[1] ?? left.parentIds[0];
      const rightFirstId = right.childIds[0] ?? right.parentIds[1] ?? right.parentIds[0];
      return (personOrder.get(leftFirstId) ?? 0) - (personOrder.get(rightFirstId) ?? 0);
    });

  return {
    peopleById,
    partnerIdsByPersonId: new Map(
      Array.from(partnerSets.entries()).map(([personId, partnerIds]) => [
        personId,
        sortPersonIds(partnerIds),
      ]),
    ),
    childrenByParentId: new Map(
      Array.from(childrenSets.entries()).map(([parentId, childIds]) => [parentId, sortPersonIds(childIds)]),
    ),
    familyUnitsByPersonId: new Map(
      Array.from(familyUnitsByPersonId.entries()).map(([personId, units]) => [personId, sortUnits(units)]),
    ),
  };
}

export function getPersonParents(personId: string, graph: FamilyGraph): string[] {
  const person = graph.peopleById.get(personId);
  return person?.parents.filter((parentId) => graph.peopleById.has(parentId)) ?? [];
}

export function getPersonPartners(personId: string, graph: FamilyGraph): string[] {
  return graph.partnerIdsByPersonId.get(personId) ?? [];
}

export function getPersonChildren(personId: string, graph: FamilyGraph): string[] {
  return graph.childrenByParentId.get(personId) ?? [];
}

export function getPersonSiblings(personId: string, graph: FamilyGraph): string[] {
  const siblingIds = new Set<string>();

  getPersonParents(personId, graph).forEach((parentId) => {
    getPersonChildren(parentId, graph).forEach((childId) => {
      if (childId !== personId) {
        siblingIds.add(childId);
      }
    });
  });

  return Array.from(siblingIds).filter((siblingId) => graph.peopleById.has(siblingId));
}

export function getPersonFamilyUnits(personId: string, graph: FamilyGraph): FamilyUnit[] {
  return graph.familyUnitsByPersonId.get(personId) ?? [];
}

export function validateFamilyData(data: FamilyData): string[] {
  const issues: string[] = [];
  const peopleById = new Map<string, Person>(data.people.map((person) => [person.id, person]));

  data.people.forEach((person) => {
    person.parents.forEach((parentId) => {
      const parent = peopleById.get(parentId);

      if (!parent) {
        issues.push(`Missing parent reference: ${person.id} -> ${parentId}`);
        return;
      }

      if (!parent.children.includes(person.id)) {
        issues.push(`Parent missing child backlink: ${parentId} -> ${person.id}`);
      }
    });

    person.children.forEach((childId) => {
      const child = peopleById.get(childId);

      if (!child) {
        issues.push(`Missing child reference: ${person.id} -> ${childId}`);
        return;
      }

      if (!child.parents.includes(person.id)) {
        issues.push(`Child missing parent backlink: ${childId} -> ${person.id}`);
      }
    });

    person.spouse.forEach((partnerId) => {
      const partner = peopleById.get(partnerId);

      if (!partner) {
        issues.push(`Missing spouse reference: ${person.id} -> ${partnerId}`);
        return;
      }

      if (!partner.spouse.includes(person.id)) {
        issues.push(`Asymmetric spouse reference: ${person.id} -> ${partnerId}`);
      }
    });
  });

  return Array.from(new Set(issues));
}
