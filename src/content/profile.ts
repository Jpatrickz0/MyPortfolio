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

  // OPTIONAL animated 2D character. Drop a TRANSPARENT cartoon/illustration PNG
  // of yourself at this path in /public and it becomes the animated hero figure
  // (idle float + leans toward the cursor). Until it exists, the hero shows the
  // particle portrait instead.
  character: "/images/portrait.png",

  // Photo shown in the Origins (About) section.
  aboutPhoto: "/images/about.png",

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
    "Hi, I'm Jan Patrick Ramirez.",
    "I'm a passionate and adaptable professional who enjoys turning ideas into practical solutions and continuously learning along the way. I'm always looking for opportunities to grow, take on new challenges, and create meaningful work.",
    "Welcome to my portfolio — a collection of my skills, experience, and projects.",
  ],
  // "Little things about me" — personal traits shown in Origins. Edit freely.
  // `icon` is one of: flame, zap, scan, users, compass, shield.
  traits: [
    { icon: "flame", title: "Hardworking", note: "I show up and see things through." },
    { icon: "zap", title: "Fast learner", note: "New tool? Give me a weekend." },
    { icon: "scan", title: "Detail-oriented", note: "The small stuff is the big stuff." },
    { icon: "users", title: "Team player", note: "Clear, kind, easy to work with." },
    { icon: "compass", title: "Curious", note: "Always exploring better ways." },
    { icon: "shield", title: "Reliable", note: "Deadlines kept, promises kept." },
  ],
};
