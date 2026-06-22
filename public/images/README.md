# Images — where to put your files

Anything in the `public/` folder is served from the site root. So a file at
`public/images/portrait.png` is referenced in code as **`/images/portrait.png`**
(no `public`, leading slash).

## 1. Your hero photo (required for the centerpiece)

- **Put it here:** `public/images/portrait.png`
- **Format:** a **background-removed PNG** (transparent) works best — you'll
  appear as a clean cutout standing in the center of the hero. A `.jpg` also
  works but won't be transparent.
- **Orientation:** vertical / full-body or head-to-torso, fairly high-res. It's
  anchored to the bottom and centered, like a standing subject.
- It's referenced in `src/content/profile.ts` → `portrait: "/images/portrait.png"`.
  To use a different filename, change that value (keep the leading `/images/`).

Until the file exists, a silhouette placeholder shows — so the layout always
looks finished.

## 2. Project images (optional)

For each project in `src/content/projects.ts` (matched by its `slug`):

```
public/images/projects/<slug>/cover.jpg     ← card + modal cover
public/images/projects/<slug>/01.jpg        ← your long mockups (modal)
public/images/projects/<slug>/02.jpg
```

Reference them in `projects.ts` as `/images/projects/<slug>/cover.jpg`, etc.
Missing images fall back to a styled placeholder automatically.

## Quick reference

| File on disk | Path you use in code |
|---|---|
| `public/images/portrait.png` | `/images/portrait.png` |
| `public/images/projects/lumen-saas/cover.jpg` | `/images/projects/lumen-saas/cover.jpg` |
