"use server";

import { revalidatePath } from "next/cache";

import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  createArchiveItem,
  updateArchiveItem,
} from "@/lib/archive/mutations";
import { resolveSubmittedImageUrl } from "@/lib/archive/images";
import { fetchArchiveUrlMetadata } from "@/lib/archive/metadata";
import type { ArchiveUrlMetadata } from "@/lib/archive/types";
import {
  parseCreateArchiveItemInput,
  parseUpdateArchiveItemInput,
} from "@/lib/archive/validation";

export type ArchiveActionState = {
  error?: string;
  success?: boolean;
};

export type PrefillArchiveMetadataState = {
  error?: string;
  metadata?: ArchiveUrlMetadata;
};

async function requireAdminAction<T>(
  handler: () => Promise<T>,
): Promise<T | ArchiveActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to manage archive items." };
  }

  return handler();
}

function revalidateArchivePaths() {
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
}

export async function createArchiveItemAction(
  _previousState: ArchiveActionState,
  formData: FormData,
): Promise<ArchiveActionState> {
  const result = await requireAdminAction(async () => {
    try {
      const input = parseCreateArchiveItemInput(formData);
      const imageUrl = await resolveSubmittedImageUrl(formData);

      await createArchiveItem({
        ...input,
        imageUrl,
      });

      revalidateArchivePaths();

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create archive item.",
      };
    }
  });

  return result ?? { error: "You must be signed in to manage archive items." };
}

export async function updateArchiveItemAction(
  _previousState: ArchiveActionState,
  formData: FormData,
): Promise<ArchiveActionState> {
  const result = await requireAdminAction(async () => {
    try {
      const input = parseUpdateArchiveItemInput(formData);
      const imageUrl = await resolveSubmittedImageUrl(formData);

      await updateArchiveItem({
        ...input,
        imageUrl,
      });

      revalidateArchivePaths();

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update archive item.",
      };
    }
  });

  return result ?? { error: "You must be signed in to manage archive items." };
}

export async function prefillArchiveMetadataAction(
  url: string,
): Promise<PrefillArchiveMetadataState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to prefill metadata." };
  }

  try {
    const metadata = await fetchArchiveUrlMetadata(url);
    return { metadata };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to fetch metadata for that URL.",
    };
  }
}
