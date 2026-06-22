# Editing your content

Everything you'll want to change lives in this folder — **no component code
required.**

| File | What it controls |
|------|------------------|
| `profile.ts` | Name, brand/tagline, email, booking link, social links, portrait path, and the **About** story |
| `sections.ts` | Section titles ("Memory 01 — Origins", etc.) and the top navigation labels |
| `experience.ts` | Work history shown on the timeline (order = array order) |
| `projects.ts` | Projects in the "Memory Vault" + each case-study modal |
| `skills.ts` | Tools shown as badges (icons or 2-letter monograms) |
| `testimonials.ts` | Client quotes ("Shared Experiences") |

## Images

Put images in `/public` and reference them with a path starting at `/`:

- **Your photo:** add `/public/images/portrait.jpg` (set in `profile.ts` → `portrait`).
- **Project images:** `/public/images/projects/<slug>/cover.jpg` and
  `01.jpg`, `02.jpg`, … (your long Figma mockups). Set in `projects.ts`.

Missing images fall back to a styled placeholder automatically, so the site
always looks finished while you gather assets.

## Hiding the testimonials section

Open `src/app/page.tsx` and comment out (or delete) the single
`<Testimonials />` line — it's clearly marked.

## Adding a skill with a new brand icon

In `skills.ts`, import the icon (e.g. `import { SiNotion } from "react-icons/si"`)
and add `{ name: "Notion", Icon: SiNotion }`. For tools without a brand icon,
use a monogram instead: `{ name: "Premiere Pro", mono: "Pr" }`.
