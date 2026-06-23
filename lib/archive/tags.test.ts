import { describe, expect, it } from "vitest";

import {
  dedupeTagNames,
  normalizeTagName,
  normalizeTagSlug,
} from "@/lib/archive/tags";

describe("normalizeTagSlug", () => {
  it("normalizes casing and spacing into a stable slug", () => {
    expect(normalizeTagSlug("Design")).toBe("design");
    expect(normalizeTagSlug(" design ")).toBe("design");
    expect(normalizeTagSlug("design engineering")).toBe("design-engineering");
  });
});

describe("dedupeTagNames", () => {
  it("prevents duplicate tags that normalize to the same slug", () => {
    expect(dedupeTagNames(["Design", "design", "DESIGN"])).toEqual(["Design"]);
    expect(dedupeTagNames(["design engineering", "Design Engineering"])).toEqual(
      ["design engineering"],
    );
  });

  it("ignores empty tag names", () => {
    expect(dedupeTagNames(["  ", "Valid", ""])).toEqual(["Valid"]);
  });
});

describe("normalizeTagName", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeTagName("  design   engineering  ")).toBe(
      "design engineering",
    );
  });
});
