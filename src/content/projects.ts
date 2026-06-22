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
  /** "About this project" copy shown in the modal. Separate paragraphs with a
   *  blank line. */
  about?: string;
  accent?: string;
  /** Card thumbnail image. */
  cover?: string;
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
    accent: "#6EC1E4",
    cover: "/images/projects/seanu/Brand%20Showcase.png",
    about: `This project was a landing page design for SeaNu® Hair, a product made for people who want thicker, healthier hair. The aim was to create a clean, honest, and easy-to-navigate page that connects with anyone dealing with hair thinning or hair loss.

The design was built with the target audience in mind, focusing on real people looking for real results. It speaks to those who want to feel good about their hair again without feeling overwhelmed by too much info or hype.

The landing page highlights what matters most: it helps make hair look fuller, slows down hair loss, and supports new growth. Everything is laid out clearly so visitors know exactly what they're getting.`,
    prototypeUrl:
      "https://www.figma.com/proto/GSItkpa1xGvvOwEoR7ITgQ/SeaNu---Website-Recreate?node-id=1-2&p=f&t=tzMleyffR0nbBZDP-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1",
  },
  {
    slug: "vela-commerce",
    title: "Vela Commerce",
    category: "Ecommerce · Shopify",
    year: "2025",
    overlay: "Shopify Storefront",
    accent: "#F2A33C",
    cover: "/images/projects/vela-commerce/cover.jpg",
  },
  {
    slug: "northwind-brand",
    title: "Northwind",
    category: "Branding · Web",
    year: "2024",
    overlay: "Brand & Website",
    accent: "#E97D6B",
    cover: "/images/projects/northwind-brand/cover.jpg",
  },
  {
    slug: "cascade-campaign",
    title: "Cascade",
    category: "Campaign · Motion",
    year: "2024",
    overlay: "Launch Campaign",
    accent: "#9D8DF1",
    cover: "/images/projects/cascade-campaign/cover.jpg",
  },
];
