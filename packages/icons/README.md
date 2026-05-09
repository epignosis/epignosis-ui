# @epignosis_llc/ui-icons

The Epignosis icon set, ported from gnosis. 631 icons across 10 categories. Ships React components (ESM + CJS + `.d.ts`) and raw `.svg` files for non-React consumers.

For the full design system see the [main repository](https://github.com/epignosis/epignosis-ui).

## Install

```bash
pnpm add @epignosis_llc/ui-icons
```

Peer dependency: `react >=19`.

## Usage

```tsx
import { CalendarSVG, CloseCircledSVG } from "@epignosis_llc/ui-icons";

export function Example() {
  return (
    <button>
      <CalendarSVG height={20} />
      <span>Pick a date</span>
      <CloseCircledSVG height={16} />
    </button>
  );
}
```

Each icon is a React component that accepts the standard `SVGProps<SVGSVGElement>`. The most common props:

| Prop                                | Effect                                        |
| ----------------------------------- | --------------------------------------------- |
| `height` / `width`                  | Size in px (numbers) or any CSS length string |
| `style` / `className`               | Standard React styling hooks                  |
| `aria-hidden`, `aria-label`, `role` | Accessibility                                 |
| `onClick` etc.                      | Event handlers                                |

## Coloring

Icons render with `currentColor`, so set `color` on a parent (or via inline style) to recolor:

```tsx
<span style={{ color: "tomato" }}>
  <CalendarSVG height={20} />
</span>
```

## Raw SVG URLs (non-React consumers)

For Vue, Svelte, or vanilla projects, import any icon as a URL via the `svg/` subpath:

```ts
import calendarUrl from "@epignosis_llc/ui-icons/svg/CalendarSVG.svg";
import closeUrl from "@epignosis_llc/ui-icons/svg/CloseCircledSVG.svg";
```

```html
<img src="{calendarUrl}" alt="" />
<!-- or, to keep currentColor recoloring, inline the file via your bundler -->
```

Filenames match the React component names exactly — `CalendarSVG.svg`, `CloseCircledSVG.svg`, `AddContentSVG.svg`. The same `currentColor` rewrite applied to the React build is applied to these files, so a CSS `color` on a parent recolors an inlined SVG identically across both entry points.

Your bundler needs to resolve `.svg` imports as URLs (Vite, webpack 5, Rollup with appropriate plugins all handle this out of the box).

## Tree-shaking

The package declares `"sideEffects": false` and exports each icon as a named ESM export, so bundlers ship only the icons you actually import. Importing `CalendarSVG` does not pull in the other 630 icons.

All icons are exported from the package root regardless of internal category.

## Browsing the icons (Storybook)

A bundled Storybook lets you search the full set, preview at any size, and click any icon to copy its named import statement to your clipboard.

### From the monorepo root

```bash
pnpm install        # first time only
pnpm storybook:icons
```

Opens at <http://localhost:6008>.

### From inside this package

```bash
pnpm --filter @epignosis_llc/ui-icons storybook
```

Same dev server on the same port.

### Run it alongside the other Storybooks

```bash
pnpm storybook:all
```

Starts the tokens, icons, react, and vue Storybooks in parallel on ports 6006–6008. Useful when designing a component that uses an icon — you can flip between catalogs without restarting.

### Build a static site

```bash
pnpm --filter @epignosis_llc/ui-icons build-storybook
```

Outputs a deployable static bundle to `packages/icons/storybook-static/`.

The default story shows every icon in one searchable grid; additional stories scope down to single categories. Each story exposes a `defaultSize` arg in the Controls panel and an inline size input for live re-testing.

## Naming

Each export is a PascalCase identifier with the `SVG` suffix, matching the gnosis convention — e.g. `CalendarSVG`, `CloseCircledSVG`, `AddContentSVG`.

## Authoring guide — adding or editing icons

Before committing a new SVG, clean it up so consumers can size and recolor it from the outside. **Two rules; everything else flows from them.**

### 1. Strip `width` and `height` from the root `<svg>`

Consumers control size through the `height` (or `width`) prop. If the SVG hardcodes its own dimensions, those win and the prop has no effect.

```diff
- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
+ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
```

Keep `viewBox` — that's what makes the icon scalable. Don't add `width`/`height` back later for "convenience."

### 2. Use `currentColor` for every fill and stroke

Consumers recolor an icon by setting `color` on a parent. Any hardcoded color blocks that.

Replace each occurrence of `fill="#xxx"`, `stroke="#xxx"`, `fill="black"`, etc. with `currentColor`:

```diff
- <path fill="#000" d="..." />
+ <path fill="currentColor" d="..." />

- <circle stroke="#1f2937" stroke-width="2" />
+ <circle stroke="currentColor" stroke-width="2" />
```

Same applies inside `<defs><style>` blocks if the icon was exported from a design tool that uses CSS classes:

```diff
  <defs>
    <style>
-     .cls-1 { fill: #0046AB; }
+     .cls-1 { fill: currentColor; }
    </style>
  </defs>
```

If an icon legitimately needs **two** distinct colors (e.g. a two-tone logo), use `currentColor` for the primary and a single hardcoded value for the accent — and call it out in the icon's filename or in a code comment so future authors know it's deliberate.

### 3. After cleanup

**Name the file and export consistently.**

The source filename uses kebab-case; the export name is the same words in PascalCase with an `SVG` suffix:

| Source file                   | Export name      |
| ----------------------------- | ---------------- |
| `src/actions/add-content.svg` | `AddContentSVG`  |
| `src/feature/ai/brain-ai.svg` | `BrainAiSVG`     |
| `src/logos/google-drive.svg`  | `GoogleDriveSVG` |

The export name is also the raw-SVG dist filename — `dist/svg/AddContentSVG.svg` — and the URL consumers import: `@epignosis_llc/ui-icons/svg/AddContentSVG.svg`. The source name and the public name must match; don't use different words in each.

**Export names must be globally unique across all categories.** If the same kebab-case filename already exists in another category (e.g. both `client/grid.svg` and `legacy/grid.svg`), append `_duplicate` to the later export: `GridSVG_duplicate`. Don't rename the source file. Check before adding:

```bash
grep -rE 'as MyNewIconSVG' packages/icons/src/
```

**Steps:**

1. Drop the cleaned SVG at `src/<category>/<kebab-name>.svg`.
2. Add the export to that category's `index.ts`:
   ```ts
   export { default as MyNewIconSVG } from "./my-new-icon.svg";
   ```
   Don't edit `src/index.ts` — it does `export * from "./<category>"` and picks up new exports automatically.
3. Run `pnpm --filter @epignosis_llc/ui-icons build`. Confirm:
   - `dist/index.{js,cjs,d.ts}` updated with the new export.
   - `dist/svg/MyNewIconSVG.svg` exists and contains `currentColor`.
4. Run `pnpm storybook:icons` and verify it renders, sizes, and recolors as expected.
