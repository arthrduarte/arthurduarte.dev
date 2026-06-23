import { describe, expect, it } from "vitest";

import {
  assignTagColors,
  buildArchiveGraph,
  computeInitialPositions,
  hashString,
} from "@/lib/archive/graph";
import type { ArchiveItemRecord } from "@/lib/archive/types";

function makeItem(
  id: string,
  tags: string[],
  overrides: Partial<ArchiveItemRecord> = {},
): ArchiveItemRecord {
  return {
    id,
    title: `Item ${id}`,
    url: `https://example.com/${id}`,
    imageUrl: null,
    note: null,
    isFavorite: false,
    source: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    tags,
    tagSlugs: tags.map((tag) => tag.toLowerCase()),
    ...overrides,
  };
}

describe("buildArchiveGraph", () => {
  it("creates one node per item and edges between items sharing tags", () => {
    const items = [
      makeItem("1", ["design", "css"]),
      makeItem("2", ["css"]),
      makeItem("3", ["finance"]),
    ];

    const { nodes, edges } = buildArchiveGraph(items);

    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(1);
    expect(edges[0]).toMatchObject({ source: "1", target: "2", weight: 1 });
  });

  it("weights an edge by the number of shared tags", () => {
    const items = [
      makeItem("1", ["design", "css", "type"]),
      makeItem("2", ["css", "type"]),
    ];

    const { edges } = buildArchiveGraph(items);

    expect(edges).toHaveLength(1);
    expect(edges[0].weight).toBe(2);
  });

  it("does not connect items with no shared tags", () => {
    const items = [makeItem("1", ["a"]), makeItem("2", ["b"])];

    expect(buildArchiveGraph(items).edges).toHaveLength(0);
  });
});

describe("assignTagColors", () => {
  it("maps every tag slug to a color in the 1-5 range, deterministically", () => {
    const items = [makeItem("1", ["design", "css", "finance", "type", "news"])];

    const colors = assignTagColors(items);

    expect(colors.size).toBe(5);
    for (const value of colors.values()) {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    }
    // Stable across calls.
    expect(assignTagColors(items)).toEqual(colors);
  });
});

describe("computeInitialPositions", () => {
  it("returns a deterministic position per node within the radius", () => {
    const { nodes } = buildArchiveGraph([
      makeItem("1", ["a"]),
      makeItem("2", ["b"]),
      makeItem("3", ["c"]),
    ]);

    const first = computeInitialPositions(nodes, 500);
    const second = computeInitialPositions(nodes, 500);

    expect(first.size).toBe(3);
    expect(first).toEqual(second);

    for (const point of first.values()) {
      expect(Math.hypot(point.x, point.y)).toBeLessThanOrEqual(500 + 1);
    }
  });
});

describe("hashString", () => {
  it("is stable and unsigned", () => {
    expect(hashString("design")).toBe(hashString("design"));
    expect(hashString("design")).toBeGreaterThanOrEqual(0);
    expect(hashString("a")).not.toBe(hashString("b"));
  });
});
