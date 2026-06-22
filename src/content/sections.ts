/**
 * SECTION LABELS & NAVIGATION ("Memory Architecture")
 * ---------------------------------------------------
 * Section titles use the archival concept. Change a label or nav name here and
 * it updates everywhere. `index` is the small "Memory 0X" tag above each title.
 */

export const sections = {
  about: { id: "about", index: "Memory 01", title: "Origins", nav: "Origins" },
  experience: {
    id: "experience",
    index: "Memory 02",
    title: "Professional Timeline",
    nav: "Timeline",
  },
  projects: {
    id: "work",
    index: "Memory 03",
    title: "Memory Vault",
    nav: "Vault",
  },
  skills: {
    id: "skills",
    index: "Memory 04",
    title: "Tools Collected Along the Way",
    nav: "Tools",
  },
  // NOTE: testimonials is currently HIDDEN (see src/app/page.tsx). Contact is
  // numbered "Memory 05" so the visible sequence has no gap. If you re-enable
  // testimonials, set it to "Memory 05" and bump contact back to "Memory 06".
  testimonials: {
    id: "testimonials",
    index: "Memory 05",
    title: "Shared Experiences",
    nav: "Voices",
  },
  contact: {
    id: "contact",
    index: "Memory 05",
    title: "Create the Next Memory",
    nav: "Contact",
  },
} as const;

/** Top navigation (testimonials intentionally omitted to keep nav tight). */
export const nav = [
  { label: sections.about.nav, href: `#${sections.about.id}` },
  { label: sections.experience.nav, href: `#${sections.experience.id}` },
  { label: sections.projects.nav, href: `#${sections.projects.id}` },
  { label: sections.skills.nav, href: `#${sections.skills.id}` },
  { label: sections.contact.nav, href: `#${sections.contact.id}` },
];
