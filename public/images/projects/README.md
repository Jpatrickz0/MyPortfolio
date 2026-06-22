# Project thumbnails (Memory Vault)

Each project card in the Vault uses a **thumbnail** = the project's `cover`
image. Drop your image in that project's folder here.

## Where to put each thumbnail

There's one folder per project (named after the project's `slug` in
`src/content/projects.ts`):

```
public/images/projects/<slug>/cover.jpg     ← the card thumbnail (showcase image)
public/images/projects/<slug>/01.jpg        ← optional extra images (only shown
public/images/projects/<slug>/02.jpg          if the project has no embed/prototype)
```

You reference it in `projects.ts` (no `public`, leading slash):

```ts
cover: "/images/projects/<slug>/cover.jpg",
```

## Current folders (rename to match your real projects)

| Folder | Project slug |
|--------|--------------|
| `seanu/` | seanu |
| `vela-commerce/` | vela-commerce |
| `northwind-brand/` | northwind-brand |
| `cascade-campaign/` | cascade-campaign |

When you rename a project's `slug` in `projects.ts`, rename its folder here to
match (or just point `cover` at wherever you put the file).

## Tips
- **Format:** `.jpg`, `.png`, or `.webp`. Landscape works best (cards are 16:10).
- **Size:** ~1200×750px is plenty.
- If a thumbnail is missing, a styled placeholder shows automatically — the
  site never looks broken.
