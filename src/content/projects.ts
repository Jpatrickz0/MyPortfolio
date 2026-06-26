/**
 * PROJECTS — "Memory Vault"
 * -------------------------
 * Each project shows as a thumbnail card. Clicking it opens the project — the
 * interactive prototype (Figma embed) if set, otherwise the cover/mockups.
 *
 * MINIMUM you need per project: `title` (the name shown on the card),
 * `category`, `year`, and ideally a `cover` thumbnail. Everything else is
 * optional.
 *
 * IMAGES: drop the thumbnail at /public/images/projects/<slug>/cover.jpg and
 * reference it as "/images/projects/<slug>/cover.jpg". Missing images show a
 * styled placeholder automatically.
 */

export type Project = {
  slug: string;
  /** Project NAME — shown big on the card and as the modal title. */
  title: string;
  category: string;
  year: string;
  /** Short text overlay shown on the thumbnail (e.g. "E-Commerce Website"). */
  overlay?: string;
  /** Tools / tech stack used — shown as tags under the title in the modal. */
  tech?: string[];
  /** "About this project" copy shown in the modal. Separate paragraphs with a
   *  blank line. */
  about?: string;
  accent?: string;
  /** Card thumbnail image. */
  cover?: string;
  /** How the cover fits: "cover" (default, fills/crops) or "contain" (centered,
   *  no crop — use for logos). */
  coverFit?: "cover" | "contain";
  /** Set to "phone" to render this project as mobile mockups (phone frames) on
   *  the card and in the modal. */
  device?: "phone";
  /** For "phone" projects: the app screens shown as mockups in the modal. */
  screens?: { src: string; label?: string }[];
  /** Extra showcase images shown in the modal, below the cover (e.g. a full-page
   *  export). Displayed at natural height so long designs show in full. */
  mockups?: string[];
  /** "View prototype" button — opens the Figma prototype in a new tab. Use your
   *  normal Figma share link (www.figma.com/proto/...). */
  prototypeUrl?: string;
  /** "Visit live site" button — if the project is deployed. */
  liveUrl?: string;
  /** OPTIONAL: embed the live Figma prototype as an iframe instead of the image
   *  showcase. Heavier/slower — leave unset to use the recommended image view.
   *  Use the embed form: embed.figma.com/... with &embed-host=share. */
  embedUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "seanu",
    title: "SeaNu",
    category: "Landing Page · Web Design",
    year: "2025",
    overlay: "Landing Page",
    tech: ["Figma", "Photoshop", "Canva"],
    accent: "#6EC1E4",
    cover: "/images/projects/seanu/Brand%20Showcase.png",
    about: `This project was a landing page design for SeaNu® Hair, a product made for people who want thicker, healthier hair. The aim was to create a clean, honest, and easy-to-navigate page that connects with anyone dealing with hair thinning or hair loss.

The design was built with the target audience in mind, focusing on real people looking for real results. It speaks to those who want to feel good about their hair again without feeling overwhelmed by too much info or hype.

The landing page highlights what matters most: it helps make hair look fuller, slows down hair loss, and supports new growth. Everything is laid out clearly so visitors know exactly what they're getting.`,
    prototypeUrl:
      "https://www.figma.com/proto/GSItkpa1xGvvOwEoR7ITgQ/SeaNu---Website-Recreate?node-id=1-2&p=f&t=tzMleyffR0nbBZDP-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1",
  },
  {
    slug: "circumax",
    title: "CircuMax Gold",
    category: "Landing Page · Redesign",
    year: "2025",
    overlay: "Landing Page",
    tech: ["Figma", "Photoshop", "Canva"],
    accent: "#D9A441",
    cover: "/images/projects/circumax/circumax-thumbnail.png",
    about: `A landing page redesign for CircuMax Gold, a health supplement brand. The goal was a cleaner, more trustworthy page that presents the product clearly and makes it easy for visitors to understand and take action.

I focused on simple structure, clear messaging, and strong visuals — keeping the experience honest and easy to follow from top to bottom.`,
    prototypeUrl:
      "https://www.figma.com/proto/moLa3YqIuu4fJHsizBD7A7/CircuMax-Gold---Website-Redesign?node-id=0-1&t=vyGeYlhzo6uUh063-1",
  },
  {
    slug: "sked",
    title: "Sked",
    category: "Mobile App · Flutter",
    year: "2025",
    overlay: "Mobile App",
    tech: ["Flutter", "Dart", "Riverpod", "Isar"],
    accent: "#7C9AED",
    device: "phone",
    cover: "/images/projects/sked/cover.png",
    coverFit: "contain",
    screens: [
      { src: "/images/projects/sked/screens/onboarding.png", label: "Onboarding" },
      { src: "/images/projects/sked/screens/home.png", label: "Home" },
      { src: "/images/projects/sked/screens/schedule.png", label: "Schedule" },
      { src: "/images/projects/sked/screens/tasks.png", label: "Tasks" },
    ],
    about: `Sked is a personal class-schedule and task planner for students. It keeps subjects, deadlines, and study streaks in one simple place — built to stay out of your way.

It's fast and local-first: everything works offline with no account, and it sends quiet reminders before classes and deadlines so nothing slips through.`,
  },
  {
    slug: "gala-pinoy",
    title: "GalaPinoy",
    category: "Landing Page · Web Design",
    year: "2025",
    overlay: "Landing Page",
    tech: ["Figma", "Photoshop", "Canva"],
    accent: "#34B79A",
    cover: "/images/projects/gala-pinoy/galapinoy-thumbnail.png",
    about: `GalaPinoy is a landing page made to inspire people to explore the Philippines — its destinations, food, and culture. The goal was a vibrant, welcoming page that makes discovering local spots feel exciting and easy.

The design keeps things clear and visual: bold imagery, simple navigation, and a layout that helps visitors quickly find where to go and what to do next.`,
    prototypeUrl:
      "https://www.figma.com/proto/vlAoWJpylJ3O6VBqm7faOC/Untitled?node-id=0-1&t=iz0ukNtzjHqr5AIA-1",
  },
];
