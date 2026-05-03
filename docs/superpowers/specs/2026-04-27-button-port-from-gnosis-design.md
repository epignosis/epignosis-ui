# Port the gnosis Button into `@epignosis-ui/react` — Design

**Date:** 2026-04-27
**Status:** Approved (pending user review of this written spec)
**Related:** [`2026-04-27-react-vue-packages-design.md`](./2026-04-27-react-vue-packages-design.md) (the monorepo + design-tokens architecture this builds on)

## Goal

Replace the placeholder `Button` in `@epignosis-ui/react` with a port of `@epignosis_llc/gnosis`'s Button (`/Users/alexboi/projects/Epignosis/gnosis/src/components/Button/Button.tsx`), trimmed to essentials and re-styled to consume `@epignosis-ui/tokens` CSS variables instead of an `@emotion/react` theme.

## Non-goals

- Touch the gnosis repo. We read it for reference; we don't modify or delete the gnosis Button. Consumer migration is out of scope.
- Port to `@epignosis-ui/vue`. Vue stays at its placeholder Button until specifically requested.
- Add semantic "button" tokens to `@epignosis-ui/tokens` (e.g. `--button-primary-default-bg`). Mapping lives in the component's own CSS file. Tokens stay as raw values.
- Bring in `@emotion/react`, `framer-motion`, `react-spinners`, the `Loader` component, or `color`. None of those become deps.
- Faithful reproduction of every gnosis prop. We're trimming `isLoading`, `iconBefore`, `iconAfter`, `rounded`, `block`, `noGutters`, `underlined`, `active`. Those return when there's a real consumer need.

## Public API

```ts
// packages/react/src/Button/Button.tsx
import type { ReactNode, ElementType } from "react";
import type { PolymorphicComponentProps } from "../types/polymorphic";

export type ButtonColor =
  | "primary" | "secondary" | "danger" | "success"
  | "primaryLight" | "primaryDarker" | "white" | "orange";

export type ButtonVariant = "solid" | "outline" | "ghost" | "link";

export type ButtonSize = "sm" | "md" | "lg";

type Props = {
  color?: ButtonColor;       // default "primary"
  variant?: ButtonVariant;   // default "solid"
  size?: ButtonSize;         // default "md"
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export type ButtonProps<C extends ElementType = "button"> =
  PolymorphicComponentProps<C, Props>;

export default function Button<C extends ElementType = "button">(
  props: ButtonProps<C>,
): JSX.Element;
```

This is a **breaking change** versus the placeholder Button (which had `variant: "primary" | "secondary"` only and was a non-polymorphic named export). Acceptable: `@epignosis-ui/react` is at `0.1.0`, no public consumers yet.

### Public exports

```ts
// packages/react/src/index.ts
export { default as Button } from "./Button/Button";
export type {
  ButtonProps,
  ButtonColor,
  ButtonVariant,
  ButtonSize,
} from "./Button/Button";
```

## File layout

```
packages/react/src/
├── Button/
│   ├── Button.tsx              ← port + polymorphic
│   ├── Button.css              ← color × variant × state matrix
│   └── Button.stories.tsx      ← 7 representative stories
├── types/
│   └── polymorphic.ts          ← ~10-line PolymorphicComponentProps helper
└── index.ts                    ← updated exports
```

## Polymorphic helper (`src/types/polymorphic.ts`)

Standard TS pattern. Replaces gnosis's `types/common` import.

```ts
import type { ComponentPropsWithoutRef, ElementType } from "react";

type AsProp<C extends ElementType> = { as?: C };

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = object,
> = Props & AsProp<C> & Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
```

Lets consumers do:

```tsx
<Button>Click me</Button>                          // <button>
<Button as="a" href="/path">Go</Button>            // <a>, href type-checked
<Button as={NextLink} to="/path">Go</Button>       // any component
```

## Component (`Button.tsx`)

```tsx
import type { ElementType, ReactNode } from "react";
import type { PolymorphicComponentProps } from "../types/polymorphic";
import "./Button.css";

export type ButtonColor =
  | "primary" | "secondary" | "danger" | "success"
  | "primaryLight" | "primaryDarker" | "white" | "orange";
export type ButtonVariant = "solid" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

type Props = {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export type ButtonProps<C extends ElementType = "button"> =
  PolymorphicComponentProps<C, Props>;

function cn(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export default function Button<C extends ElementType = "button">({
  as,
  color = "primary",
  variant = "solid",
  size = "md",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps<C>) {
  const Component = (as ?? "button") as ElementType;
  const isNativeButton = as === undefined || as === "button";

  return (
    <Component
      className={cn(
        "eg-button",
        `eg-button--${variant}`,
        `eg-button--${color}`,
        `eg-button--${size}`,
        disabled && "is-disabled",
        className,
      )}
      {...(isNativeButton && { type: "button", disabled })}
      {...rest}
    >
      {children}
    </Component>
  );
}
```

Notes:
- Renders the requested element via `as`. Native `<button>` gets `type="button"` by default (overridable via the consumer's `type` in `...rest`) and the `disabled` attribute. Non-button elements (e.g. `<a>`) only get the `is-disabled` class — anchors have no native `disabled` attribute.
- `disabled` is destructured before `...rest`, so the spread can't accidentally re-add it for non-button elements.
- `cn` is a 1-line inline helper. No `classnames` dep.

## Styles (`Button.css`)

### Class structure

Component renders e.g. `class="eg-button eg-button--solid eg-button--primary eg-button--md"`. Selectors compose like `.eg-button--solid.eg-button--primary` (variant AND color). 4 variants × 8 colors = 32 visual blocks; sizes are independent.

### Base + sizing

```css
.eg-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--border-radius-sm);
  line-height: 1.125rem;
  cursor: pointer;
  transition:
    background-color var(--transition-fast) ease-in,
    color var(--transition-fast) ease-in,
    border-color var(--transition-fast) ease-in;
}

.eg-button--sm { font-size: var(--font-size-sm); height: 2rem;   min-width: 2rem;   padding: 0 1rem; }
.eg-button--md { font-size: var(--font-size-sm); height: 2.5rem; min-width: 2.5rem; padding: 0 1.75rem; }
.eg-button--lg { font-size: var(--font-size-lg); height: 3rem;   min-width: 3rem;   padding: 0 3rem; }

.eg-button:disabled,
.eg-button.is-disabled {
  background-color: var(--color-secondary-lighter);
  color: var(--color-secondary-base);
  border-color: var(--color-secondary-base);
  cursor: not-allowed;
}
```

### Variant + color matrix

For each of the 8 colors (`primary`, `secondary`, `danger`, `success`, `primaryLight`, `primaryDarker`, `white`, `orange`), the file emits four blocks (solid, outline, ghost, link), each with default + hover/focus rules. Mapping comes from gnosis's `button.ts` translated 1:1. Excerpt for `primary`:

```css
/* solid: primary */
.eg-button--solid.eg-button--primary {
  background-color: var(--color-primary-base);
  border: 1px solid var(--color-primary-base);
  color: var(--color-base-white);
}
.eg-button--solid.eg-button--primary:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--primary:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
}

/* outline: primary */
.eg-button--outline.eg-button--primary {
  background-color: transparent;
  border: 1px solid var(--color-primary-base);
  color: var(--color-primary-base);
}
.eg-button--outline.eg-button--primary:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--primary:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
  color: var(--color-base-white);
}

/* ghost: primary — transparent by default, tints on hover */
.eg-button--ghost.eg-button--primary {
  background-color: transparent;
  border: none;
  color: var(--color-primary-base);
}
.eg-button--ghost.eg-button--primary:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-primary-lightest25);
  /* gnosis ghost.hoverColor for primary equals ghost.color, so text color stays */
}

/* link: primary */
.eg-button--link.eg-button--primary {
  background-color: transparent;
  border: none;
  color: var(--color-primary-base);
}
.eg-button--link.eg-button--primary:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-primary-light);
}
```

The remaining 7 colors follow the same structure with values from gnosis's `button.ts`.

### Token coverage

The existing `tokens.css` covers everything gnosis's `button.ts` needs **except** these alpha-modulated shades that gnosis computes at runtime via the `color` library:

| gnosis expression | Where it lives in our build |
| --- | --- |
| `colors.primary.lightest @ 0.25` | Already in tokens: `var(--color-primary-lightest25)` |
| `colors.primary.lightest @ 0.5` | Already in tokens: `var(--color-primary-lightest50)` |
| `colors.primary.darker @ 0.5` | Already in tokens: `var(--color-primary-darker50)` |
| `colors.primary.darker @ 0.9` | **Hardcoded in Button.css:** `rgba(0, 42, 103, 0.9)` |
| `colors.primary.darker @ 0.15` | **Hardcoded in Button.css:** `rgba(0, 42, 103, 0.15)` |
| `colors.white @ 0.7` | **Hardcoded in Button.css:** `rgba(255, 255, 255, 0.7)` |

Three hardcoded rgba values, each used by exactly one of `primaryLight`, `primaryDarker`, `white`. If a future component needs them, we'll promote to `tokens.css` then.

## Stories (`Button.stories.tsx`)

Seven representative stories — chosen to cover the matrix without 96 individual cells.

1. **Default** — `color="primary"`, `variant="solid"`, `size="md"`
2. **AllColorsSolid** — single story rendering 8 solid/md buttons, one per color (custom render)
3. **AllVariantsPrimary** — single story rendering 4 primary/md buttons, one per variant (custom render)
4. **AllSizes** — sm / md / lg solid primaries side by side (custom render)
5. **Disabled** — solid primary + outline secondary, both disabled
6. **AsAnchor** — `<Button as="a" href="https://example.com" target="_blank">` to demonstrate polymorphic rendering with a real `<a href>`
7. **Playground** — full `argTypes` controls (color/variant/size/disabled), default args = primary/solid/md

## Storybook controls

Inferred from CSF 3 `argTypes`:

```ts
argTypes: {
  color:    { control: "select", options: [
    "primary","secondary","danger","success","primaryLight","primaryDarker","white","orange",
  ] },
  variant:  { control: "inline-radio", options: ["solid","outline","ghost","link"] },
  size:     { control: "inline-radio", options: ["sm","md","lg"] },
  disabled: { control: "boolean" },
},
```

The `Playground` story exposes all four. The "All*" stories override `parameters.controls.disable: true` for fields they're sweeping (so the panel doesn't suggest you're controlling things you aren't).

## Verification

1. `pnpm --filter @epignosis-ui/react build` — clean build. `dist/index.d.ts` declares the polymorphic `Button` plus four exported types.
2. `pnpm storybook:react` — all 7 stories render on http://localhost:6006:
   - Solid primary blue matches `#0046AB`
   - Solid danger red matches `#D12525`
   - Solid success green matches `#1B7855`
   - Solid orange matches `#FF9C28`
   - Hover on a solid primary swaps bg to `#0054CD` (`--color-primary-light`)
   - Outline primary shows transparent bg + primary blue border + primary blue text
   - Ghost primary shows the alpha-25 primary tint as bg
   - Link primary is text-only
   - Disabled stories show the secondary-lighter bg + secondary-base text/border, cursor not-allowed
3. `AsAnchor` story renders `<a href>` (verifiable in browser DevTools).

## Open questions / follow-ups (out of scope today)

- Active state — gnosis exposes an `active` prop and an `&.active` selector. We removed both. If a real consumer needs visual "pressed" feedback, add an `aria-pressed` selector or restore the prop later.
- isLoading + Loader port — when consumers need it, port `Loader` from gnosis (it uses `react-spinners`) into `@epignosis-ui/react/Loader`, then add `isLoading` back to Button.
- Icon slots — when needed, add `iconBefore`/`iconAfter` props (icon components passed in by the consumer; we don't bring an icon system in).
- Vue port — when needed, translate Button.tsx → Button.vue (`<script setup lang="ts">`), reuse Button.css verbatim.
- Promoting the three hardcoded rgba values to `tokens.css` if more components need them.
