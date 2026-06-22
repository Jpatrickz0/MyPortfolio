# Portfolio Strategy, Concept & Design System

Jan Patrick Ramirez — a **single-page**, conversion-focused portfolio for a
**multidisciplinary digital creator** (design, web development, ecommerce,
digital marketing, motion/video, branding). This documents the concept and the
decisions behind the build; file references point to where each lives.

---

## 1. Creative concept — "Memory Architecture"

The portfolio is a **curated digital archive**. Rather than a list of sections,
visitors explore a thoughtfully organized collection of memories — experiences,
projects, skills, and milestones. The concept stays subtle and easy to navigate:

- Sections are numbered **"Memory 0X"** with archival titles.
- The **loader** "indexes the archive" — a grid of memory cells lights up to
  100%, then opens to reveal the site.
- Monospace index tags, fine architectural lines, and a warm amber-on-ink
  palette give an archival, editorial feel (not a typical dev portfolio, and
  deliberately not a dashboard/terminal/pixel style).

### Section map (one page)
| Nav | Section | Concept title |
|-----|---------|---------------|
| Origins | About | **Memory 01 — Origins** |
| Timeline | Work Experience | **Memory 02 — Professional Timeline** |
| Vault | Projects | **Memory 03 — Memory Vault** |
| Tools | Skills | **Memory 04 — Tools Collected Along the Way** |
| (Voices) | Testimonials | **Memory 05 — Shared Experiences** *(optional/hideable)* |
| Contact | Contact | **Memory 06 — Create the Next Memory** |

Labels are editable in `src/content/sections.ts`.

---

## 2. Personal brand (not a single job title)

Positioned as a **multidisciplinary digital creator** with no job title — the
hero leads with the line **"Building and shaping digital experiences from
concept to execution."** About lists the disciplines (Design, Web Development,
Ecommerce, Digital Marketing, Motion, Branding) as an archival index. Defined in
`src/content/profile.ts`.

---

## 3. Page structure / wireframe (`src/app/page.tsx`)

```
┌─ Loader (indexing the archive) → opens to reveal
├─ Sticky nav (JPR · archival labels · Book a call) + scroll-progress bar
├─ HERO          image-led: portrait centerpiece + name + rotating disciplines + CTAs
├─ ORIGINS       story + values + quick facts + disciplines index
├─ TIMELINE      center-aligned, scroll-animated growing line, alternating entries
├─ VAULT         project cards → scrollable case-study MODAL (long mockups)
├─ TOOLS         skill badges (brand icons + monograms) by discipline
├─ SHARED EXP.   testimonials (optional — one line to hide)
├─ CONTACT       persuasion + assurances + lead form
└─ FOOTER        "Let's talk", email, nav, socials
```

## 4. Key UX recommendations (and how they're built)

- **Centered cinematic hero (poster composition)** — the cutout photo is the
  centerpiece, standing in front of the name set huge behind it. On load: name
  lines rise, the figure emerges from the bottom, and a spotlight blooms. No
  frame, not a side layout. `sections/hero.tsx` + `site/hero-portrait.tsx`.
- **Projects → case-study modal** — long Figma mockups don't belong inline on
  the homepage. Cards open a `Dialog` with overview, challenge/solution,
  results, and a **scrollable mockup gallery** (`sections/projects.tsx`). Each
  project has a `slug`, so promoting any to a dedicated route later is trivial.
- **Center timeline** — a scroll-linked line grows as you read and entries
  reveal progressively (`useScroll` + `useSpring`, `sections/experience.tsx`).
- **Skills as badges** — brand icons (react-icons) + 2-letter monograms for
  tools without a brand mark (Adobe, Klaviyo); interactive hover lift.

## 5. CRO & lead-gen strategy

- One primary action everywhere (**Start a project / Book a call**); sticky nav
  CTA + hero + every case study + final section + footer.
- Proof beside claims: result metrics on cards and in case studies, quantified
  experience highlights, result-tagged testimonials, quick-fact stats.
- Friction reducers in Contact: free consult, reply-within-a-day, fixed
  proposal, budget chips (leads self-qualify).
- Lead form → `POST /api/lead` (Zod-validated, honeypot, success state). Wire
  the `TODO` to email/CRM to go live.

## 6. SEO

Templated metadata + OpenGraph/Twitter (`layout.tsx`), `Person` JSON-LD
(`page.tsx`), auto `sitemap.xml`/`robots.txt`, semantic HTML, single `<h1>`,
static rendering. Content is in the DOM regardless of JS (the loader is an
overlay, not a gate) so crawlers always see it.

## 7. Accessibility & performance

Skip link, visible focus rings, Radix a11y primitives (Dialog, etc.), full
`prefers-reduced-motion` support (loader, parallax, rotating word, reveals all
degrade gracefully), keyboard-dismissable modal, fluid `clamp()` type. Static
HTML, `next/font`, lazy images. **No cursor-following element.**

## 8. Mobile-first

Single-column by default; the timeline switches to a left-aligned rail on small
screens and center-alternating at `lg`. Full-width CTAs, dedicated mobile nav
overlay, touch-friendly badges, modal sized to the viewport.

## 9. Animation & micro-interactions

Custom archive loader; CSS page-fade transition; scroll reveals (`Reveal`,
`FocusReveal`, `StaggerGroup`); scroll-linked timeline line; hover micro-
interactions (card lift, badge raise, arrow rotate, hero name-line rise +
figure emerge + spotlight bloom). Transform/opacity-driven; blur used sparingly.

---

## 10. Design system

**Aesthetic:** warm, archival "ink + bone + amber" with film grain and fine
framing lines. Tokens in `src/app/globals.css`, mapping in `tailwind.config.ts`.

### Color (HSL CSS variables)
| Token | Value | Use |
|---|---|---|
| `--background` (ink) | `240 16% 5%` | Base |
| `--foreground` (bone) | `48 22% 95%` | Text |
| `--card` | `240 13% 8%` | Surfaces |
| `--muted-foreground` | `240 7% 64%` | Secondary text |
| `--border` | `240 9% 16%` | Hairlines |
| `--brand` / `--primary` (amber) | `38 92% 58%` | CTAs, accents, focus |

Per-project accent colors live in `projects.ts`.

### Typography
- **Display** — *Fraunces* (variable serif): expressive headings + the archival
  numerals.
- **Sans** — *Inter* (body/UI). **Mono** — *JetBrains Mono* (index tags, labels,
  loader counter). Fluid `clamp()` scale; `next/font`, self-hosted.

## 11. Content architecture (easy future edits)

All copy/data is separated from components in **`src/content/`** (one file per
area + a README). Images live in `/public/images`. You can update your name,
brand, experience, projects, skills, testimonials, and section labels without
touching component code.
