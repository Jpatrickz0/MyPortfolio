/**
 * CORE PROFILE & BRAND
 * --------------------
 * Edit your name, brand, contact details, social links, and the About story
 * here. No component code needs to change.
 */

export const profile = {
  name: "Jan Patrick Ramirez",
  shortName: "JPR",

  // Multidisciplinary positioning — no single job title.
  brand: "Building and shaping digital experiences from concept to execution.",
  // Used only in the page <title> / metadata (kept title-free).
  roleLine: "Building digital experiences from concept to execution",
  // The disciplines you work across — shown as an index in the About section.
  disciplines: [
    "Design",
    "Web Development",
    "Ecommerce",
    "Digital Marketing",
    "Motion & Video",
    "Branding",
  ],

  tagline:
    "Building and shaping digital experiences from concept to execution.",

  // SEO description.
  description:
    "Jan Patrick Ramirez is a multidisciplinary digital creator — design, web development, ecommerce, and digital marketing — building digital experiences that turn attention into results.",

  email: "janpatrickramirez00@gmail.com",
  calendar: "https://cal.com/", // replace with your booking link
  location: "Remote · Worldwide",
  url: "https://janpatrickramirez.com",

  // Hero portrait. Use a BACKGROUND-REMOVED PNG (transparent) so you appear as
  // a clean cutout over the background. Drop it at this path in /public — no
  // code change needed. (A .jpg works too, but it won't be transparent.)
  portrait: "/images/portrait.png",

  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "Email", href: "mailto:janpatrickramirez00@gmail.com" },
  ],
};

/** About Me — "Memory 01 — Origins" */
export const about = {
  paragraphs: [
    "I'm Jan Patrick Ramirez — a multidisciplinary creator exploring the space where design, development, ecommerce, and marketing meet.",
    "What started as curiosity about how things are made online turned into a craft: designing brands in Photoshop, cutting stories in Premiere Pro, building fast websites, and growing stores with Shopify and Klaviyo.",
    "I think of every project as a memory worth building well — something that performs, lasts, and is genuinely good to experience.",
  ],
  values: [
    "Craft over shortcuts",
    "Outcomes over output",
    "Detail in every layer",
    "Build to be remembered",
  ],
  // Honest, beginner-friendly facts — versatility, effort, and availability
  // build trust without overstating experience. Edit freely.
  quickFacts: [
    { value: "5", label: "Disciplines combined" },
    { value: "100%", label: "Effort on every project" },
    { value: "Open", label: "To new projects" },
  ],
};
