# @epignosis_llc/ui-icons

The Epignosis icon set as React components. 631 icons across 10 categories, ported from gnosis. Ships compiled ESM + CJS + `.d.ts`.

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

| Prop | Effect |
|---|---|
| `height` / `width` | Size in px (numbers) or any CSS length string |
| `style` / `className` | Standard React styling hooks |
| `aria-hidden`, `aria-label`, `role` | Accessibility |
| `onClick` etc. | Event handlers |

## Coloring

Icons render with `currentColor`, so set `color` on a parent (or via inline style) to recolor:

```tsx
<span style={{ color: "tomato" }}>
  <CalendarSVG height={20} />
</span>
```

## Tree-shaking

The package declares `"sideEffects": false` and exports each icon as a named ESM export, so bundlers ship only the icons you actually import. Importing `CalendarSVG` does not pull in the other 630 icons.

## Categories

Icons are grouped into the following categories:

| Category | Approx. count |
|---|---|
| `actions` | 6 |
| `arrows` | 17 |
| `carets` | 6 |
| `chevrons` | 12 |
| `client` | 377 |
| `currencies` | 22 |
| `feature` | 38 |
| `legacy` | 116 |
| `logos` | 29 |
| `social` | 8 |

All icons are exported from the package root. To browse them visually with search and click-to-copy, run the bundled Storybook from the monorepo root:

```bash
pnpm storybook:icons
```

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

- Drop the file in the right category directory: `packages/icons/src/<category>/<icon-name>.svg`
- Add the export to that category's `index.ts`:
  ```ts
  export { default as MyNewIconSVG } from "./my-new-icon.svg";
  ```
- Run `pnpm --filter @epignosis_llc/ui-icons build` and `pnpm storybook:icons` to verify it renders, sizes, and recolors as expected.
