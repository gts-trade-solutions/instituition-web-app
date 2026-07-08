"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { requireAdminFeature } from "@/lib/adminFeatures";

const STATUSES = ["PENDING", "PAID", "CANCELLED"] as const;

export async function updateRegistrationStatus(formData: FormData) {
  await requireAdmin();
  requireAdminFeature("registrations");
  const id = formData.get("id") as string;
  const status = formData.get("status");
  // Never write an unvalidated value into the enum column.
  if (typeof status !== "string" || !STATUSES.includes(status as never)) return;
  try {
    await prisma.registration.update({
      where: { id },
      data: { status: status as (typeof STATUSES)[number] },
    });
  } catch {
    // ignore
  }
  revalidatePath("/admin/registrations");
  revalidatePath("/admin");
}

export async function deleteRegistration(formData: FormData) {
  await requireAdmin();
  requireAdminFeature("registrations");
  const id = formData.get("id") as string;
  try {
    await prisma.registration.delete({ where: { id } });
  } catch {
    // ignore
  }
  revalidatePath("/admin/registrations");
  revalidatePath("/admin");
}
