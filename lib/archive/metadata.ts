import type { ArchiveUrlMetadata } from "@/lib/archive/types";
import { parseImageUrl } from "@/lib/archive/images";

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function readMetaContent(html: string, key: string): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }

  return undefined;
}

function readTitleTag(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtmlEntities(match[1]) : undefined;
}

function resolveMetadataUrl(value: string | undefined, pageUrl: URL): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, pageUrl).toString();
  } catch {
    return undefined;
  }
}

export function parseArchiveMetadataFromHtml(
  html: string,
  pageUrl: string,
): ArchiveUrlMetadata {
  const url = new URL(pageUrl);

  const title =
    readMetaContent(html, "og:title") ??
    readMetaContent(html, "twitter:title") ??
    readTitleTag(html);

  const description =
    readMetaContent(html, "og:description") ??
    readMetaContent(html, "description") ??
    readMetaContent(html, "twitter:description");

  const imageCandidate =
    readMetaContent(html, "og:image") ??
    readMetaContent(html, "twitter:image");

  const metadata: ArchiveUrlMetadata = {};

  if (title) {
    metadata.title = title;
  }

  if (description) {
    metadata.description = description;
  }

  const resolvedImage = resolveMetadataUrl(imageCandidate, url);
  const parsedImage = resolvedImage ? parseImageUrl(resolvedImage) : null;

  if (parsedImage) {
    metadata.imageUrl = parsedImage;
  }

  return metadata;
}

export async function fetchArchiveUrlMetadata(
  rawUrl: string,
): Promise<ArchiveUrlMetadata> {
  let url: URL;

  try {
    url = new URL(rawUrl.trim());

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("URL must use http or https.");
    }
  } catch {
    throw new Error("URL must be a valid http or https link.");
  }

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "ArthurArchiveBot/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch metadata (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("text/html")) {
    return {};
  }

  const html = await response.text();

  return parseArchiveMetadataFromHtml(html.slice(0, 250_000), url.toString());
}
