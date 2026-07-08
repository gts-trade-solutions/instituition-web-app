"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { requireAdminFeature } from "@/lib/adminFeatures";
import { defaultContent } from "@/lib/content";

export type ContentState = { ok?: boolean; error?: string };

const MAX_VALUE_LEN = 5000;

export async function saveContent(
  _prev: ContentState,
  formData: FormData,
): Promise<ContentState> {
  await requireAdmin();
  requireAdminFeature("content");
  const page = formData.get("__page") as keyof typeof defaultContent;
  const defaults = defaultContent[page] as Record<string, string> | undefined;
  if (!defaults) return { error: "Unknown page." };

  // Validate before writing anything, so one over-long field doesn't leave a
  // half-saved page.
  const values: Record<string, string> = {};
  for (const key of Object.keys(defaults)) {
    const value = String(formData.get(key) ?? "");
    if (value.length > MAX_VALUE_LEN) {
      return { error: `"${key}" is too long (max ${MAX_VALUE_LEN} characters).` };
    }
    values[key] = value;
  }

  try {
    for (const key of Object.keys(defaults)) {
      const value = values[key];
      await prisma.contentBlock.upsert({
        where: { page_key: { page: page as string, key } },
        create: { page: page as string, key, value },
        update: { value },
      });
    }
  } catch {
    return { error: "Could not save content. Please try again." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetPageContent(formData: FormData) {
  await requireAdmin();
  requireAdminFeature("content");
  const page = formData.get("__page") as string;
  try {
    await prisma.contentBlock.deleteMany({ where: { page } });
  } catch {
    // ignore
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
}
