import { describe, expect, it } from "vitest";

import { parseCreateArchiveItemInput } from "@/lib/archive/validation";

function buildFormData(values: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

describe("parseCreateArchiveItemInput", () => {
  it("parses a valid archive item payload", () => {
    const input = parseCreateArchiveItemInput(
      buildFormData({
        title: "Interesting essay",
        url: "https://example.com/essay",
        note: "Worth revisiting",
        source: "Example Site",
        imageUrl: "https://example.com/cover.jpg",
        isFavorite: "true",
        tags: JSON.stringify(["Design", "design", "Essays"]),
      }),
    );

    expect(input).toEqual({
      title: "Interesting essay",
      url: "https://example.com/essay",
      note: "Worth revisiting",
      source: "Example Site",
      imageUrl: "https://example.com/cover.jpg",
      isFavorite: true,
      tagNames: ["Design", "Essays"],
    });
  });

  it("requires title and a valid http(s) URL", () => {
    expect(() =>
      parseCreateArchiveItemInput(
        buildFormData({
          title: "",
          url: "https://example.com",
        }),
      ),
    ).toThrow("Title is required.");

    expect(() =>
      parseCreateArchiveItemInput(
        buildFormData({
          title: "Example",
          url: "not-a-url",
        }),
      ),
    ).toThrow("URL must be a valid http or https link.");
  });
});
