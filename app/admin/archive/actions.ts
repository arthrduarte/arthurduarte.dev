"use server";

import { revalidatePath } from "next/cache";

import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createArchiveItem } from "@/lib/archive/mutations";
import { parseCreateArchiveItemInput } from "@/lib/archive/validation";

export type CreateArchiveItemActionState = {
  error?: string;
  success?: boolean;
};

export async function createArchiveItemAction(
  _previousState: CreateArchiveItemActionState,
  formData: FormData,
): Promise<CreateArchiveItemActionState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to create archive items." };
  }

  try {
    const input = parseCreateArchiveItemInput(formData);
    await createArchiveItem(input);

    revalidatePath("/admin/archive");
    revalidatePath("/archive");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to create archive item.",
    };
  }
}
