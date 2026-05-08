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
