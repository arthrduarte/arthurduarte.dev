import { describe, expect, it } from "vitest";

import { parseArchiveMetadataFromHtml } from "@/lib/archive/metadata";

describe("parseArchiveMetadataFromHtml", () => {
  it("extracts Open Graph metadata from HTML", () => {
    const html = `
      <html>
        <head>
          <title>Fallback title</title>
          <meta property="og:title" content="OG Title" />
          <meta property="og:description" content="A useful article" />
          <meta property="og:image" content="/cover.jpg" />
          <meta property="og:site_name" content="Example Site" />
        </head>
      </html>
    `;

    expect(
      parseArchiveMetadataFromHtml(html, "https://example.com/post"),
    ).toEqual({
      title: "OG Title",
      description: "A useful article",
      imageUrl: "https://example.com/cover.jpg",
      source: "Example Site",
    });
  });

  it("falls back gracefully when metadata is missing", () => {
    expect(
      parseArchiveMetadataFromHtml(
        "<html><head><title>Plain page</title></head></html>",
        "https://example.org/page",
      ),
    ).toEqual({
      title: "Plain page",
      source: "example.org",
    });
  });
});
