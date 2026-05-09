# CLAUDE.md — @epignosis_llc/ui-icons

Package-specific guidance. Repo-wide rules (commit hygiene, releases, changesets) live in the root `CLAUDE.md`.

## Source layout

Categorized by domain:

```
src/
  actions/      arrows/      carets/      chevrons/
  client/       currencies/  feature/     legacy/
  logos/        social/
  client/{assignments,custom-homepage,editor,empty-state-icons,
          product-fruits,quick-actions,referral,reports,skills,widgets}/
  feature/{ai,questions,rating,teams,training-matrix,units,verticalStepper}/
  index.ts        # `export * from "./<category>"` — picks up new exports automatically
  Icons.stories.tsx
  svg.d.ts        # ambient `*.svg` module declaration for the source build
```

Each category directory has an `index.ts` that re-exports its `.svg` files as named React components.

## Adding a new icon

1. Drop the cleaned SVG at `src/<category>/<name>.svg`.
2. Add the export to that category's `index.ts`:
   ```ts
   export { default as MyIconSVG } from "./my-icon.svg";
   ```
   Don't edit `src/index.ts` — it does `export * from "./<category>"` and picks up new exports automatically.
3. Run `pnpm --filter @epignosis_llc/ui-icons build`. Confirm both:
   - `dist/index.{js,cjs,d.ts}` updated
   - `dist/svg/MyIconSVG.svg` exists

## SVG authoring rules

Two non-negotiables, full guide in `README.md`:

- **Strip `width`/`height` from the root `<svg>`** — keep `viewBox`. Consumers size via the `height`/`width` prop.
- **Use `currentColor` for every `fill` and `stroke`** — and inside `<defs><style>` blocks. The vite-plugin-svgr config rewrites `#000`/`#000000` to `currentColor` automatically as a safety net, but keep it explicit when you can.

If an icon legitimately needs two distinct colors (e.g. a two-tone logo), use `currentColor` for the primary and a hardcoded value for the accent — note it in the filename or a code comment.

## Naming

- PascalCase + `SVG` suffix (`CalendarSVG`, `AddContentSVG`) — matches the gnosis convention.
- The PascalCase name is **also** the published raw-SVG filename: postbuild writes `dist/svg/<Name>.svg`. So component names must be globally unique across categories.
- Kebab-case source filenames are allowed to collide across categories (e.g. `client/grid.svg` vs `legacy/grid.svg`); the client-side React export appends `_duplicate` (`GridSVG_duplicate`). Follow this pattern; don't rename source files.
- Before adding a new export, check the name isn't taken:
  ```bash
  grep -rE 'export\s*\{\s*default as MyIconSVG\b' src/
  ```

## Build pipeline

`pnpm --filter @epignosis_llc/ui-icons build` runs `vite build && node scripts/postbuild.mjs`.

| Output                | Produced by             | Purpose                                                                                                                                      |
| --------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `dist/index.{js,cjs}` | vite + vite-plugin-svgr | React component bundle (ESM + CJS)                                                                                                           |
| `dist/index.d.ts`     | postbuild               | Flat declaration of every named export. tsc isn't used because the chain of `*.svg` ambient declarations doesn't survive re-exports cleanly. |
| `dist/svg/<Name>.svg` | postbuild               | Raw SVG for non-React consumers, with `#000`/`#000000` → `currentColor` applied so behavior matches the React build.                         |

The `currentColor` rewrite lives in **two** places that must stay in sync:

- `vite.config.ts` — `svgr.svgrOptions.replaceAttrValues` for the JSX bundle.
- `scripts/postbuild.mjs` — the regex `/="#000(?:000)?"/gi` for the raw-SVG copies.

If you change one, change the other.

## Public API

Two entry points, both shipped from `dist/`:

- `import { CalendarSVG } from "@epignosis_llc/ui-icons"` — React component.
- `import url from "@epignosis_llc/ui-icons/svg/CalendarSVG.svg"` — raw SVG file (consumer's bundler decides whether to expose as URL, raw string, or component).

Filename = component name across both, by design. Never break that invariant.

## What to avoid

- Adding `width`/`height` to the root `<svg>` — breaks consumer sizing.
- Hardcoded colors where `currentColor` would do.
- Introducing a component name that collides with an existing export.
- Moving SVG files into a flat `src/svg/` directory — the categorized source layout is intentional. Flat output is produced at build time.
- `prepublishOnly` in `package.json` (the release workflow already builds; reintroducing it caused publish-time failures historically — see root `CLAUDE.md`).
