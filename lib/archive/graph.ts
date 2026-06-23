import type { ArchiveItemRecord } from "@/lib/archive/types";

export type ArchiveGraphNode = {
  id: string;
  item: ArchiveItemRecord;
  /** 1-5, maps to the warm --chart-* ramp in globals.css */
  colorIndex: number;
};

export type ArchiveGraphEdge = {
  source: string;
  target: string;
  /** Number of tags the two items share. */
  weight: number;
};

export type ArchiveGraph = {
  nodes: ArchiveGraphNode[];
  edges: ArchiveGraphEdge[];
};

export type Point = { x: number; y: number };

/** Deterministic 32-bit hash so layout + colors are stable across renders/SSR. */
export function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Assign each tag slug a color in the 1-5 range. Tags are sorted first so the
 * mapping does not depend on item ordering.
 */
export function assignTagColors(items: ArchiveItemRecord[]): Map<string, number> {
  const slugs = new Set<string>();

  for (const item of items) {
    for (const slug of item.tagSlugs) {
      slugs.add(slug);
    }
  }

  const colors = new Map<string, number>();

  for (const slug of [...slugs].sort()) {
    colors.set(slug, (hashString(slug) % 5) + 1);
  }

  return colors;
}

/**
 * A node's color comes from its first tag (alphabetically), so an item keeps a
 * single characteristic cluster color. Untagged items fall back to color 5.
 */
function nodeColorIndex(
  item: ArchiveItemRecord,
  tagColors: Map<string, number>,
): number {
  const primarySlug = [...item.tagSlugs].sort()[0];
  return primarySlug ? (tagColors.get(primarySlug) ?? 5) : 5;
}

/**
 * Build the constellation graph: one node per item, an edge between any two
 * items that share at least one tag (weighted by how many they share).
 */
export function buildArchiveGraph(items: ArchiveItemRecord[]): ArchiveGraph {
  const tagColors = assignTagColors(items);

  const nodes: ArchiveGraphNode[] = items.map((item) => ({
    id: item.id,
    item,
    colorIndex: nodeColorIndex(item, tagColors),
  }));

  const edges: ArchiveGraphEdge[] = [];

  for (let i = 0; i < items.length; i += 1) {
    const a = items[i];
    const aTags = new Set(a.tagSlugs);

    for (let j = i + 1; j < items.length; j += 1) {
      const b = items[j];
      let shared = 0;

      for (const slug of b.tagSlugs) {
        if (aTags.has(slug)) {
          shared += 1;
        }
      }

      if (shared > 0) {
        edges.push({ source: a.id, target: b.id, weight: shared });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Deterministic starting positions spread on a phyllotaxis (sunflower) spiral
 * around the origin. Gives the simulation a non-degenerate, evenly-spread seed
 * and doubles as the static layout under reduced motion.
 */
export function computeInitialPositions(
  nodes: ArchiveGraphNode[],
  radius: number,
): Map<string, Point> {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const positions = new Map<string, Point>();
  const count = Math.max(nodes.length, 1);

  nodes.forEach((node, index) => {
    // Spread radius by sqrt for even area density; jitter by id hash so equal
    // indices across renders still look organic but stay deterministic.
    const distance = radius * Math.sqrt((index + 0.5) / count);
    const jitter = (hashString(node.id) % 1000) / 1000 - 0.5;
    const angle = index * golden + jitter;

    positions.set(node.id, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
  });

  return positions;
}
