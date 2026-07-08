"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z
  .object({
    title: z.string().min(3, "Title is required.").max(200),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    location: z.string().min(1).max(200),
    price: z.coerce.number().min(0).max(100_000, "Price looks too large."),
    capacity: z.coerce.number().int().min(1).max(100_000),
    description: z.string().max(5000).optional(),
    published: z.union([z.literal("on"), z.null()]).optional(),
  })
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export type SeminarFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parse(formData: FormData) {
  return schema.safeParse({
    title: formData.get("title"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    price: formData.get("price"),
    capacity: formData.get("capacity"),
    description: formData.get("description"),
    published: formData.get("published"),
  });
}

export async function saveSeminar(
  _prev: SeminarFormState,
  formData: FormData,
): Promise<SeminarFormState> {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const parsed = parse(formData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const d = parsed.data;
  const data = {
    title: d.title,
    startDate: new Date(d.startDate),
    endDate: new Date(d.endDate),
    location: d.location,
    priceCents: Math.round(d.price * 100),
    capacity: d.capacity,
    description: d.description || null,
    published: d.published === "on",
  };

  try {
    if (id) {
      await prisma.seminar.update({ where: { id }, data });
    } else {
      await prisma.seminar.create({ data });
    }
  } catch {
    return { error: "Could not save the seminar. Please try again." };
  }

  revalidatePath("/admin/seminars");
  revalidatePath("/seminars");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSeminar(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  try {
    await prisma.seminar.delete({ where: { id } });
  } catch {
    // ignore
  }
  revalidatePath("/admin/seminars");
  revalidatePath("/seminars");
}

export async function togglePublish(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";
  try {
    await prisma.seminar.update({ where: { id }, data: { published: !published } });
  } catch {
    // ignore
  }
  revalidatePath("/admin/seminars");
  revalidatePath("/seminars");
}
