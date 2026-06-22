/**
 * WORK EXPERIENCE — "Professional Timeline"
 * -----------------------------------------
 * Clean, minimal structure: a duration, a simple role name, and a few short
 * responsibility bullets. Entries render top-to-bottom in array order.
 */

export type Experience = {
  period: string;
  role: string;
  /** Optional, kept subtle. Remove the line if you'd rather omit it. */
  company?: string;
  responsibilities: string[];
};

export const experience: Experience[] = [
  {
    period: "2023 — Present",
    role: "Design & Front-End Lead",
    company: "Lumen SaaS",
    responsibilities: [
      "Brand, marketing site, and product UI",
      "Design system and component library",
      "Performance and Core Web Vitals",
    ],
  },
  {
    period: "2021 — 2023",
    role: "Ecommerce & Email Marketing",
    company: "Vela Commerce",
    responsibilities: [
      "Shopify storefronts, end to end",
      "Klaviyo lifecycle email flows",
      "Product photography and promo video",
    ],
  },
  {
    period: "2019 — 2021",
    role: "Designer & Video Editor",
    company: "Orbit Studio",
    responsibilities: [
      "Brand and visual design",
      "Campaign video editing",
      "Social content and assets",
    ],
  },
  {
    period: "2016 — 2019",
    role: "Multidisciplinary Creator",
    company: "Freelance",
    responsibilities: [
      "Websites, stores, and brand kits",
      "Direct client collaboration",
    ],
  },
];
