"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { requireAdminFeature } from "@/lib/adminFeatures";

const STATUSES = ["NEW", "READ", "ARCHIVED"] as const;

export async function setMessageStatus(formData: FormData) {
  await requireAdmin();
  requireAdminFeature("messages");
  const id = formData.get("id") as string;
  const status = formData.get("status");
  if (typeof status !== "string" || !STATUSES.includes(status as never)) return;
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: status as (typeof STATUSES)[number] },
    });
  } catch {
    // ignore
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  requireAdminFeature("messages");
  const id = formData.get("id") as string;
  try {
    await prisma.contactMessage.delete({ where: { id } });
  } catch {
    // ignore
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
