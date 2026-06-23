export function parseImageUrl(raw: FormDataEntryValue | string | null): string | null {
  const value = typeof raw === "string" ? raw : String(raw ?? "").trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function getBlobReadWriteToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  return token;
}

export function isBlobStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadArchiveImage(file: File): Promise<string> {
  const { put } = await import("@vercel/blob");

  const safeName = file.name.replace(/[^\w.-]+/g, "-") || "image";
  const blob = await put(`archive/${Date.now()}-${safeName}`, file, {
    access: "public",
    token: getBlobReadWriteToken(),
  });

  return blob.url;
}

export async function resolveSubmittedImageUrl(
  formData: FormData,
): Promise<string | null> {
  const imageFile = formData.get("imageFile");

  if (imageFile instanceof File && imageFile.size > 0) {
    return uploadArchiveImage(imageFile);
  }

  return parseImageUrl(formData.get("imageUrl"));
}
