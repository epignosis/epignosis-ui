# Migrate Button styling from plain CSS to `@emotion/react` (gnosis pattern) — Design

**Date:** 2026-04-28
**Status:** Approved (pending user review of this written spec)
**Related:**

- [`2026-04-27-button-port-from-gnosis-design.md`](./2026-04-27-button-port-from-gnosis-design.md) — the trimmed Button port this builds on
- [`2026-04-27-react-vue-packages-design.md`](./2026-04-27-react-vue-packages-design.md) — the monorepo architecture

## Goal

Replace `@epignosis-ui/react`'s plain-CSS Button styling with the same `@emotion/react` + ThemeProvider pattern that `@epignosis_llc/gnosis` uses. Add a `theme.button` config object mirroring gnosis's `button.ts`, ship a `ThemeProvider`, and rewrite `Button.tsx` to apply styles via the `css(theme)` callback. Visual output stays pixel-identical; the implementation surface changes.

## Why this is happening

Earlier in this project we picked plain CSS + CSS variables specifically to avoid `@emotion/react` as a peer dep. The user reversed that decision after the trimmed port was working: they want gnosis's exact styling pattern, including the theme provider and the `theme.button[color][state]` config object. This spec encodes the new approach.

## Non-goals

- Touch the gnosis repo. Read-only reference, as before.
- Port to `@epignosis-ui/vue`. Still placeholder Button there.
- Add a full gnosis-equivalent theme (`colors`, `typeScaleSizes`, `body`, `link`, etc.). Theme contains only `button` until a second component needs more.
- Provide a `createTheme(overrides)` factory. Single default theme; consumers can pass their own to `<ThemeProvider theme={...}>` if needed.
- Add an `@emotion/styled` API (we're going with the `css` prop, since gnosis does).
- Maintain a side-by-side plain-CSS path. Migration is a clean replacement.

## Tooling assumptions

- `@emotion/react` becomes a **peer dep** of `@epignosis-ui/react` and a dev dep for the local Storybook.
- Vite's `@vitejs/plugin-react` gets `jsxImportSource: "@emotion/react"`. This makes the `css` prop work without per-file `/** @jsxImportSource @emotion/react */` pragmas.
- TypeScript module augmentation extends `@emotion/react`'s `Theme` interface so `theme.button` is typed.

## File layout

```
packages/react/src/
├── theme/
│   ├── index.ts              public re-exports
│   ├── theme.ts              the `epignosisTheme` object
│   ├── types.ts              `EpignosisTheme` type + emotion module augmentation
│   └── ThemeProvider.tsx     thin wrapper around emotion's ThemeProvider
├── Button/
│   ├── Button.tsx            uses `css={(theme) => btnContainer(theme, …)}`
│   ├── styles.ts             emotion `css` helpers (replaces Button.css)
│   └── Button.stories.tsx    unchanged (linter-edited version)
└── types/
    └── polymorphic.ts        unchanged
```

**Deletions:**

- `packages/react/src/Button/Button.css` — removed.

**Modifications:**

- `packages/react/package.json` — add `@emotion/react` peer dep + dev dep; remove `./styles.css` from `exports`; remove `sideEffects` (no CSS files in dist anymore).
- `packages/react/vite.config.ts` — `react({ jsxImportSource: "@emotion/react" })`.
- `packages/react/.storybook/preview.ts` → renamed `preview.tsx` (decorator embeds JSX).
- `packages/react/src/index.ts` — re-export `Button`, types, plus `ThemeProvider` and `epignosisTheme`.
- `packages/react/README.md` — updated consumer usage.

## Theme structure

### `theme/theme.ts`

Mirror of gnosis's `src/theme/default/config/button.ts`. Values are **CSS-variable strings** (not raw hex), so consumer overrides at `:root` still flow through. The three alpha-modulated values gnosis computes via the `color` library stay hardcoded as `rgba(...)` strings (same as current Button.css):

| gnosis expression                | Spec value                          |
| -------------------------------- | ----------------------------------- |
| `colors.primary.lightest @ 0.25` | `"var(--color-primary-lightest25)"` |
| `colors.primary.lightest @ 0.5`  | `"var(--color-primary-lightest50)"` |
| `colors.primary.darker @ 0.9`    | `"rgba(0, 42, 103, 0.9)"`           |
| `colors.primary.darker @ 0.15`   | `"rgba(0, 42, 103, 0.15)"`          |
| `colors.white @ 0.7`             | `"rgba(255, 255, 255, 0.7)"`        |

Theme shape (excerpt — full theme has all 8 colors):

```ts
export const epignosisTheme = {
  button: {
    disabled: {
      background: "var(--color-secondary-lighter)",
      color: "var(--color-secondary-base)",
      borderColor: "var(--color-secondary-base)",
    },
    primary: {
      default: {
        background: "var(--color-primary-base)",
        borderColor: "var(--color-primary-base)",
        color: "var(--color-base-white)",
        borderRadius: "var(--border-radius-sm)",
      },
      hover: {
        background: "var(--color-primary-light)",
        borderColor: "var(--color-primary-light)",
        color: "var(--color-base-white)",
      },
      active: {
        background: "var(--color-primary-base)",
        borderColor: "var(--color-primary-base)",
        color: "var(--color-base-white)",
      },
      ghost: {
        color: "var(--color-primary-base)",
        background: "var(--color-primary-lightest25)",
        hoverColor: "var(--color-primary-base)",
      },
      outline: { color: "var(--color-primary-base)", borderColor: "var(--color-primary-base)" },
      link: { color: "var(--color-primary-base)", hoverColor: "var(--color-primary-light)" },
    },
    /* secondary, danger, success, primaryLight, primaryDarker, white, orange — same shape */
  },
} as const;
```

The remaining 7 colors come straight out of gnosis's `button.ts` with each `colors.*` reference rewritten as the matching CSS-variable string from `tokens.css`.

### `theme/types.ts`

Augments emotion's `Theme` so `theme.button[color][state]` is typed:

```ts
import "@emotion/react";
import type { epignosisTheme } from "./theme";

export type EpignosisTheme = typeof epignosisTheme;

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends EpignosisTheme {}
}
```

### `theme/ThemeProvider.tsx`

Thin wrapper. Default theme baked in; consumer can override.

```tsx
import { ThemeProvider as EmotionThemeProvider, type Theme } from "@emotion/react";
import type { ReactNode } from "react";
import { epignosisTheme } from "./theme";

export function ThemeProvider({
  theme = epignosisTheme as Theme,
  children,
}: {
  theme?: Theme;
  children: ReactNode;
}) {
  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
}
```

### `theme/index.ts`

```ts
export { ThemeProvider } from "./ThemeProvider";
export { epignosisTheme } from "./theme";
export type { EpignosisTheme } from "./types";
```

## Component

### `Button/styles.ts`

Pattern lifted near-verbatim from gnosis's `Button/styles.ts`. Per-concern helpers compose into `btnContainer`:

```ts
import { css, type SerializedStyles, type Theme } from "@emotion/react";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./Button";

const fontSizes = {
  sm: "var(--font-size-sm)",
  md: "var(--font-size-sm)",
  lg: "var(--font-size-lg)",
};
const heights = { sm: "2rem", md: "2.5rem", lg: "3rem" };
const minWidths = { sm: "2rem", md: "2.5rem", lg: "3rem" };
const paddings = { sm: "0 1rem", md: "0 1.75rem", lg: "0 3rem" };

const baseButton = (size: ButtonSize): SerializedStyles => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--border-radius-sm);
  line-height: 1.125rem;
  cursor: pointer;
  font-size: ${fontSizes[size]};
  height: ${heights[size]};
  min-width: ${minWidths[size]};
  padding: ${paddings[size]};
  transition:
    background-color var(--transition-fast) ease-in,
    color var(--transition-fast) ease-in,
    border-color var(--transition-fast) ease-in;
`;

const solidButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  color: ${button[color].default.color};
  background-color: ${button[color].default.background};
  border: 1px solid ${button[color].default.borderColor};

  &:hover:not(:disabled):not(.is-disabled),
  &:focus-visible:not(:disabled):not(.is-disabled) {
    color: ${button[color].hover.color};
    background-color: ${button[color].hover.background};
    border-color: ${button[color].hover.borderColor};
  }
`;

const outlineButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  color: ${button[color].outline.color};
  background-color: transparent;
  border: 1px solid ${button[color].outline.borderColor};

  &:hover:not(:disabled):not(.is-disabled),
  &:focus-visible:not(:disabled):not(.is-disabled) {
    color: ${button[color].hover.color};
    background-color: ${button[color].hover.background};
    border-color: ${button[color].hover.borderColor};
  }
`;

const ghostButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  background-color: transparent;
  border: none;
  color: ${button[color].ghost.color};

  &:hover:not(:disabled):not(.is-disabled) {
    color: ${button[color].ghost.hoverColor};
    background-color: ${button[color].ghost.background};
  }
`;

const linkButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  color: ${button[color].link.color};
  background-color: transparent;
  border: none;

  &:hover:not(:disabled):not(.is-disabled) {
    color: ${button[color].link.hoverColor};
  }
`;

const disabledButton = (button: Theme["button"]): SerializedStyles => css`
  &:disabled,
  &.is-disabled {
    &,
    &:hover,
    &:focus,
    &:active {
      color: ${button.disabled.color};
      background-color: ${button.disabled.background};
      border-color: ${button.disabled.borderColor};
      cursor: not-allowed;
    }
  }
`;

const variantStyles = (
  button: Theme["button"],
  variant: ButtonVariant,
  color: ButtonColor,
): SerializedStyles => {
  switch (variant) {
    case "solid":
      return solidButton(button, color);
    case "outline":
      return outlineButton(button, color);
    case "ghost":
      return ghostButton(button, color);
    case "link":
      return linkButton(button, color);
  }
};

export const btnContainer = (
  theme: Theme,
  { color, variant, size }: { color: ButtonColor; variant: ButtonVariant; size: ButtonSize },
): SerializedStyles => css`
  ${baseButton(size)};
  ${variantStyles(theme.button, variant, color)};
  ${disabledButton(theme.button)};
`;
```

### `Button/Button.tsx`

```tsx
import type { ElementType, ReactNode } from "react";
import type { PolymorphicComponentProps } from "../types/polymorphic";
import { btnContainer } from "./styles";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "primaryLight"
  | "primaryDarker"
  | "white"
  | "orange";
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

export type ButtonProps<C extends ElementType = "button"> = PolymorphicComponentProps<C, Props>;

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
      css={(theme) => btnContainer(theme, { color, variant, size })}
      className={[disabled && "is-disabled", className].filter(Boolean).join(" ") || undefined}
      {...(isNativeButton && { type: "button", disabled })}
      {...rest}
    >
      {children}
    </Component>
  );
}
```

Notes:

- `css={(theme) => …}` runs inside `<ThemeProvider>` so `theme.button` is populated and typed.
- `className` keeps the `is-disabled` hook for non-`<button>` elements (anchors don't have `disabled`), plus any consumer-supplied class. The old `eg-button--*` classnames are gone — emotion generates its own.
- The previous `cn(...)` helper is gone (only one use site, inline `[…].filter(Boolean).join(" ")` reads fine).
- The `|| undefined` fallback prevents an empty `className=""` attribute from ending up in the DOM when there's neither `disabled` nor a consumer `className`.

## Storybook

`packages/react/.storybook/preview.tsx` (renamed from `.ts`):

```tsx
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import "@epignosis-ui/tokens/tokens.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
```

Without the decorator, `theme.button` is undefined inside `css(theme)` callbacks at story-render time and buttons render unstyled. The Mulish-loading `preview-head.html` stays as-is.

The existing `Button.stories.tsx` (linter-edited form) needs **no changes** — it imports `Button` and `ButtonProps` from `./Button`, which still match.

## Public exports

```ts
// packages/react/src/index.ts
export { default as Button } from "./Button/Button";
export type { ButtonProps, ButtonColor, ButtonVariant, ButtonSize } from "./Button/Button";

export { ThemeProvider, epignosisTheme } from "./theme";
export type { EpignosisTheme } from "./theme";
```

## Consumer usage (post-migration)

```tsx
// app entry
import { ThemeProvider } from "@epignosis-ui/react";
import "@epignosis-ui/tokens/tokens.css";

createRoot(el).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);

// any component
import { Button } from "@epignosis-ui/react";

<Button color="primary" variant="solid" size="md">
  Click me
</Button>;
```

Consumer also runs `pnpm add @emotion/react` (peer dep). No more `import "@epignosis-ui/react/styles.css"` line — emotion injects styles at runtime.

## Breaking changes

| Before                                                          | After                                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `import "@epignosis-ui/react/styles.css"` is required           | no CSS import; `<ThemeProvider>` is required                                  |
| Consumer adds nothing extra                                     | Consumer adds `@emotion/react` peer dep                                       |
| `dist/styles.css` exists                                        | **`dist/styles.css` deleted**                                                 |
| `package.json` declares `./styles.css` export and `sideEffects` | both removed                                                                  |
| Stable `eg-button--{variant}` selectors for overrides           | generated emotion classes (e.g. `css-1abc23`); overrides via `className` only |

`@epignosis-ui/react` is at `0.1.0` so this is acceptable.

## What stays the same

- `@epignosis-ui/tokens` — completely unchanged.
- `@epignosis-ui/vue` — completely unchanged (still placeholder Button).
- `Button.stories.tsx` — unchanged.
- The `preview-head.html` Mulish loading — unchanged.
- Visual rendering of every story — should be **pixel-identical** to the current plain-CSS version.
- Public Button API (props, default values, polymorphic `as`).
- The polymorphic types helper.

## Verification

1. `pnpm install` from the workspace root completes (pulls `@emotion/react`).
2. `pnpm --filter @epignosis-ui/react build` succeeds. **`dist/styles.css` does NOT exist** (desired). `dist/index.d.ts` declares `Button`, `ThemeProvider`, `epignosisTheme`, plus the four type exports.
3. `pnpm storybook:react` opens on :6006, all 8 gnosis-style stories render. Spot checks:
   - `Primary`: solid sm primary button has `background: #0046AB`, hover `#0054CD`.
   - `PrimaryLight`: dark navy backdrop with the lighter-blue translucent buttons (still works after the recent fix).
   - `White`: per-row dark-bg div behind the solid buttons works.
   - DevTools shows generated emotion classes (e.g. `css-…`), no `eg-button--*`.
4. `pnpm --filter @epignosis-ui/react build-storybook` produces `storybook-static/index.html`.

## Open questions / follow-ups (out of scope today)

- Vue port: if/when we port the Button to Vue, decide whether to keep plain CSS there or pick a Vue CSS-in-JS lib. Asymmetry is acceptable until the second framework is needed.
- `createTheme(overrides)` factory — only when there's a real custom-theme need.
- Promoting the three hardcoded rgba values into `tokens.css` — only when more components need them.
- Active state, isLoading, icon slots — same as before; restore when consumer use cases appear.
