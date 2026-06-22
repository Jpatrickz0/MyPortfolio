# Jan Patrick Ramirez — Portfolio

A premium, **single-page** portfolio built around a creative concept —
**"Memory Architecture"**: the site is a curated digital archive of a
multidisciplinary creator's experiences, projects, skills, and milestones.
Sections are framed as numbered "memories," and a loading animation indexes the
archive before it opens.

> Concept, strategy, and the full design system are documented in
> **[STRATEGY.md](STRATEGY.md)**.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives, incl. Dialog)
- **Framer Motion** (animation) + **Lenis** (smooth scroll)
- **react-icons** (brand/tech badges) + **Lucide** (UI icons)
- **React Hook Form** + **Zod** (lead form) · **Zustand** · **Sonner**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

> Tip: don't run `npm run build` while `npm run dev` is running — they share the
> `.next` folder. Stop dev first, or delete `.next` if the dev server looks
> broken after a build.

## ✏️ Editing content (no code required)

Everything you'll change lives in **`src/content/`**, one file per area. See
**[`src/content/README.md`](src/content/README.md)** for the full guide.

| File | Controls |
|------|----------|
| `profile.ts` | Name, brand/tagline, disciplines, contact, socials, portrait path, About story |
| `sections.ts` | Section titles ("Memory 01 — Origins" …) + nav labels |
| `experience.ts` | Timeline entries |
| `projects.ts` | Vault projects + each case-study modal |
| `skills.ts` | Tool badges (brand icons or 2-letter monograms) |
| `testimonials.ts` | Client quotes |

## Images

Files in `public/` are served from the site root — see
[`public/images/README.md`](public/images/README.md) for the full guide.

- **Your photo (hero centerpiece):** `public/images/portrait.png` — a
  **background-removed PNG** is best; you appear as a centered cutout in front
  of your name. Referenced as `/images/portrait.png` (set in `profile.ts`).
- **Project images:** `public/images/projects/<slug>/cover.jpg` and
  `01.jpg`, `02.jpg`, … — your long Figma mockups appear in the case-study
  modal (set in `projects.ts`).

Missing images show a styled placeholder, so the site always looks finished.

## Key UX decisions

- **Hero is a centered cinematic poster** — your cutout photo stands in the
  middle, in front of your name set huge behind you; everything animates in on
  load (name lines rise, figure emerges, spotlight blooms). No frame, not a
  side layout. A silhouette placeholder stands in until you add your photo.
- **Projects open a case-study modal** (`Dialog`) with a scrollable gallery —
  the right home for long mockups instead of dumping them on the page. (Prefer
  dedicated pages? Each project has a `slug` ready to become a route.)
- **Skills are visual badges** (icons + monograms), grouped by discipline.
- **Center-aligned timeline** with a scroll-linked growing line and entries
  that reveal progressively.

## Hide the testimonials section

In `src/app/page.tsx`, comment out / delete the single `<Testimonials />` line
(it's clearly marked).

## Concept components

- `site/loader.tsx` — "indexing the archive" loader (fail-open: skips for
  reduced-motion, revisits, and background tabs so content is never blocked).
- `site/portrait.tsx` / `site/smart-image.tsx` — images with focus-pull reveal
  and graceful placeholders.
- `motion/reveal.tsx` — `Reveal`, `StaggerGroup`, `FocusReveal`, `WordsReveal`.
- All motion respects `prefers-reduced-motion`. No cursor-following element.

## Wire the lead form

The form posts to `src/app/api/lead/route.ts`, which validates and logs the
submission. Replace the `TODO` with an email/CRM integration (e.g. Resend).

## Before launch

- Add `public/images/portrait.jpg` + project images.
- Set `profile.url` and `profile.calendar`.
- Connect the lead form to email/CRM; add an OG image + favicon.
- Replace placeholder experience / projects / testimonials with real ones.
- Deploy (Vercel recommended).
