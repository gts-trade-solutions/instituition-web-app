import { prisma } from "./prisma";

/**
 * Default site copy — matched to the original design. Everything here can be
 * overridden per-key in the admin CMS (ContentBlock table), grouped by page.
 */
export const defaultContent = {
  site: {
    name: "AI Institute for Native Americans",
    tagline: "Building Stronger Nations Through AI, Financial Skills & Career Success",
    footerTagline:
      "Empowering Tribal Nations through education, innovation, and practical skills for a stronger tomorrow.",
    phone: "(555) 123-4567",
    email: "info@aiinstitutefornativeamericans.com",
    address: "123 Unity Way, Suite 100",
    cityStateZip: "Native City, ST 12345",
  },
  home: {
    heroTitle: "Building Stronger Nations",
    heroTitleAccent: "Through AI, Financial Skills & Career Success",
    heroSubtitle: "2-Day Hands-On Training for Tribal Professionals and Community Members",
    heroPrimaryCta: "Register For Upcoming Seminar",
    heroSecondaryCta: "View Seminar Details",
    priceLabel: "Per Participant",
    priceNote: "Group Rates Available",
    benefitsTitle: "Practical Skills. Real Impact.",
  },
  about: {
    title: "About Us",
    subtitle: "Empowering Tribal Nations Through Knowledge, Financial Strength, and Innovation",
    missionTitle: "Our Mission",
    missionBody1:
      "The AI Institute for Native Americans delivers practical, hands-on training that equips tribal professionals and community members with the skills to improve financial management, strengthen operations, and build long-term economic stability.",
    missionBody2:
      "We focus on real-world application—so participants leave with tools they can use immediately.",
    bannerTitle: "Strong skills build Strong Nations.",
    bannerSubtitle:
      "Together, we create lasting impact for today and future generations.",
  },
  seminars: {
    title: "Our Seminars",
    subtitle: "2 Days. 4 Powerful Sessions. Real Results.",
    intro:
      "Our hands-on seminars are designed to provide practical AI skills that you can apply immediately in your daily work. Each seminar is built for Tribal professionals, enterprises, and community members who want to save time, improve accuracy, and strengthen their operations.",
    bannerTitle: "Practical Skills. Lasting Impact.",
    bannerSubtitle: "Train your team. Strengthen your Nation. Build brighter futures.",
  },
  causes: {
    title: "Causes & Giving",
    subtitle: "Invest In Our People. Invest In Our Future.",
    intro:
      "When you attend our seminars, you have the opportunity to support initiatives that strengthen Native communities, protect our rights, and honor Mother Earth.",
    contributionNote: "100% of contributions go directly to these causes.",
    bannerTitle: "Train. Give. Impact.",
    bannerSubtitle:
      "Your participation helps build skills today—and builds a stronger, healthier future for our people.",
  },
  why: {
    title: "Why Native American",
    titleAccent: "Sovereignty",
    titleEnd: "Matters",
    subtitle:
      "Sovereignty is the foundation of our Nations. It allows us to govern ourselves, protect our cultures, and build strong futures for our people.",
    emphasis: "When our Nations are strong, our communities thrive.",
    bannerTitle: "Invest in Skills. Invest in Sovereignty. Invest in Our Future.",
    bannerSubtitle:
      "Join us in strengthening Tribal Nations through practical training and community empowerment.",
  },
  contact: {
    title: "Contact Us",
    subtitle:
      "We're here to help and answer any questions about our seminars, group training, or partnerships.",
    getInTouchBody:
      "Whether you have a question about our seminars, group rates, or want to learn more about our mission, we'd love to hear from you.",
    officeHours: "Monday – Friday, 8:00 AM – 5:00 PM (MT)",
  },
  register: {
    title: "Register For A Seminar",
    subtitle: "Invest in Your Skills. Strengthen Your Nation.",
    intro:
      "Join Tribal professionals and community members for 2 days of hands-on AI training that delivers real results.",
  },
} as const;

export type ContentTree = typeof defaultContent;

export async function getPageContent<P extends keyof ContentTree>(
  page: P,
): Promise<ContentTree[P]> {
  const base = { ...defaultContent[page] } as Record<string, string>;
  try {
    const blocks = await prisma.contentBlock.findMany({ where: { page } });
    for (const b of blocks) {
      if (b.value != null && b.value !== "") base[b.key] = b.value;
    }
  } catch {
    // DB not ready — use defaults.
  }
  return base as ContentTree[P];
}

export async function getSiteContent(): Promise<ContentTree["site"]> {
  return getPageContent("site");
}
