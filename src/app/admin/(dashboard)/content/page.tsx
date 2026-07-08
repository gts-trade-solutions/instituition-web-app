import { prisma } from "@/lib/prisma";
import { defaultContent } from "@/lib/content";
import { ContentEditor } from "./ContentEditor";
import { requireAdminFeature } from "@/lib/adminFeatures";

const PAGE_LABELS: Record<string, string> = {
  site: "Global / Site",
  home: "Home",
  about: "About",
  seminars: "Seminars",
  causes: "Causes",
  why: "Why It Matters",
  contact: "Contact",
  register: "Register",
};

function humanize(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

const MULTILINE = /body|subtitle|intro|missionBody|heroSubtitle|ctaSubtitle/i;

export default async function ContentPage() {
  requireAdminFeature("content");
  // Load all overrides once.
  const overrides = new Map<string, string>();
  try {
    const blocks = await prisma.contentBlock.findMany();
    for (const b of blocks) overrides.set(`${b.page}:${b.key}`, b.value);
  } catch {
    // DB unavailable — defaults only.
  }

  const pages = (Object.keys(defaultContent) as (keyof typeof defaultContent)[]).map(
    (page) => {
      const defaults = defaultContent[page] as Record<string, string>;
      return {
        page: page as string,
        label: PAGE_LABELS[page] ?? humanize(page),
        fields: Object.entries(defaults).map(([key, def]) => {
          // Match the public site: an empty stored override falls back to the
          // default, so the editor shows what visitors actually see.
          const stored = overrides.get(`${page}:${key}`);
          return {
            key,
            label: humanize(key),
            value: stored != null && stored !== "" ? stored : def,
            multiline: MULTILINE.test(key) || def.length > 80,
          };
        }),
      };
    },
  );

  return <ContentEditor pages={pages} />;
}
