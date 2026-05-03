# Port the gnosis Button into `@epignosis-ui/react` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `Button` in `@epignosis-ui/react` with a trimmed, polymorphic port of `@epignosis_llc/gnosis`'s Button, styled with `@epignosis-ui/tokens` CSS variables.

**Architecture:** Five small, focused files under `packages/react/src/`. The component renders a polymorphic element (`as` prop, default `<button>`) with composed class names. Plain CSS file owns the full color × variant × state matrix using `var(--…)` references. Standalone polymorphic-types helper (~10 lines).

**Tech Stack:** React 19, TypeScript 6, plain CSS, no new runtime deps. The gnosis source is read-only reference — we don't modify or delete it.

**Spec:** [`docs/superpowers/specs/2026-04-27-button-port-from-gnosis-design.md`](../specs/2026-04-27-button-port-from-gnosis-design.md)

> **Operating constraint for this run:** the user has asked us not to commit. The plan steps below omit `git commit`. After each task, run the verification, then move on.

---

## Pre-flight

```bash
cd /Users/alexboi/projects/Epignosis/epignosis-ui
git status     # expect: clean working tree (the user has been keeping changes uncommitted; some files may already be modified — that's expected)
node --version # ≥ 20
pnpm --version # ≥ 9
```

The gnosis Button source we're porting from:
- `/Users/alexboi/projects/Epignosis/gnosis/src/components/Button/Button.tsx`
- `/Users/alexboi/projects/Epignosis/gnosis/src/components/Button/styles.ts`
- `/Users/alexboi/projects/Epignosis/gnosis/src/theme/default/config/button.ts`

These stay read-only.

---

## File Map

**Create:**
- `packages/react/src/types/polymorphic.ts` — `PolymorphicComponentProps` helper

**Replace (file already exists from earlier work, will be overwritten):**
- `packages/react/src/Button/Button.tsx`
- `packages/react/src/Button/Button.css`
- `packages/react/src/Button/Button.stories.tsx`

**Modify:**
- `packages/react/src/index.ts` — export the new types

---

## Task 1: Add the polymorphic-types helper

**Files:**
- Create: `packages/react/src/types/polymorphic.ts`

- [ ] **Step 1: Create `packages/react/src/types/polymorphic.ts`**

```ts
import type { ComponentPropsWithoutRef, ElementType } from "react";

type AsProp<C extends ElementType> = { as?: C };

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = object,
> = Props & AsProp<C> & Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
```

- [ ] **Step 2: Verify no type errors with the existing build**

Run: `pnpm --filter @epignosis-ui/react build`
Expected: succeeds. `dist/` includes `types/polymorphic.d.ts`. Stories and component still reference the old placeholder Button — they will be replaced in later tasks. The build passes regardless.

---

## Task 2: Replace `Button.tsx`

**Files:**
- Replace: `packages/react/src/Button/Button.tsx`

- [ ] **Step 1: Overwrite `packages/react/src/Button/Button.tsx`**

```tsx
import type { ElementType, ReactNode } from "react";
import type { PolymorphicComponentProps } from "../types/polymorphic";
import "./Button.css";

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

(Notes: `disabled` is destructured before `...rest` so it can't leak onto non-button elements. Native buttons get `type="button"` as a default; consumer-provided `type` in `rest` overrides via the later spread.)

- [ ] **Step 2: Type-check the new component (excluding the still-stale stories file)**

Run: `pnpm --filter @epignosis-ui/react exec tsc -p tsconfig.build.json --noEmit`
Expected: succeeds, no errors.

(`tsconfig.build.json` excludes `*.stories.tsx`. `Button.stories.tsx` will still be the old placeholder at this point — it imports the old named `Button` export and uses the old `variant: "primary" | "secondary"` type. We replace it in Task 4. Don't type-check via `tsconfig.json` here — it includes stories and will fail.)

---

## Task 3: Replace `Button.css` with the full color × variant × state matrix

**Files:**
- Replace: `packages/react/src/Button/Button.css`

- [ ] **Step 1: Overwrite `packages/react/src/Button/Button.css`**

```css
/*
 * Epignosis UI Button — port of @epignosis_llc/gnosis Button.
 *
 * Trimmed: no isLoading, icons, rounded, block, noGutters, underlined, active.
 * Colors  : primary, secondary, danger, success, primaryLight, primaryDarker, white, orange
 * Variants: solid, outline, ghost, link
 * Sizes   : sm, md, lg
 *
 * All values come from gnosis's src/theme/default/config/button.ts.
 * Three alpha-modulated rgba values are hardcoded (gnosis computes them at
 * runtime via the `color` library): rgba(0,42,103,0.9), rgba(0,42,103,0.15),
 * rgba(255,255,255,0.7). They are only used by primaryDarker/primaryLight/white.
 */

/* ─── base ─────────────────────────────────────────────────────────── */
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

/* ─── sizes ────────────────────────────────────────────────────────── */
.eg-button--sm {
  font-size: var(--font-size-sm);
  height: 2rem;
  min-width: 2rem;
  padding: 0 1rem;
}
.eg-button--md {
  font-size: var(--font-size-sm);
  height: 2.5rem;
  min-width: 2.5rem;
  padding: 0 1.75rem;
}
.eg-button--lg {
  font-size: var(--font-size-lg);
  height: 3rem;
  min-width: 3rem;
  padding: 0 3rem;
}

/* ─── disabled (wins over color/variant) ───────────────────────────── */
.eg-button:disabled,
.eg-button.is-disabled {
  background-color: var(--color-secondary-lighter);
  color: var(--color-secondary-base);
  border-color: var(--color-secondary-base);
  cursor: not-allowed;
}

/* ─── solid: primary ───────────────────────────────────────────────── */
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

/* ─── solid: secondary ─────────────────────────────────────────────── */
.eg-button--solid.eg-button--secondary {
  background-color: var(--color-secondary-lighter);
  border: 1px solid var(--color-secondary-lighter);
  color: var(--color-base-black);
}
.eg-button--solid.eg-button--secondary:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--secondary:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-secondary-base);
  border-color: var(--color-secondary-base);
}

/* ─── solid: danger ────────────────────────────────────────────────── */
.eg-button--solid.eg-button--danger {
  background-color: var(--color-red-base);
  border: 1px solid var(--color-red-base);
  color: var(--color-base-white);
}
.eg-button--solid.eg-button--danger:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--danger:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-red-light);
  border-color: var(--color-red-light);
}

/* ─── solid: success ───────────────────────────────────────────────── */
.eg-button--solid.eg-button--success {
  background-color: var(--color-green-base);
  border: 1px solid var(--color-green-base);
  color: var(--color-base-white);
}
.eg-button--solid.eg-button--success:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--success:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-green-light);
  border-color: var(--color-green-light);
}

/* ─── solid: primaryLight ──────────────────────────────────────────── */
.eg-button--solid.eg-button--primaryLight {
  background-color: var(--color-primary-lightest25);
  border: 1px solid transparent;
  color: var(--color-base-white);
}
.eg-button--solid.eg-button--primaryLight:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--primaryLight:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-primary-lightest50);
  border-color: transparent;
}

/* ─── solid: primaryDarker ─────────────────────────────────────────── */
.eg-button--solid.eg-button--primaryDarker {
  background-color: var(--color-primary-darker);
  border: 1px solid var(--color-primary-darker);
  color: var(--color-base-white);
}
.eg-button--solid.eg-button--primaryDarker:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--primaryDarker:focus-visible:not(:disabled):not(.is-disabled) {
  /* gnosis: Color(primary.darker).alpha(0.9) */
  background-color: rgba(0, 42, 103, 0.9);
  border-color: rgba(0, 42, 103, 0.9);
}

/* ─── solid: white ─────────────────────────────────────────────────── */
.eg-button--solid.eg-button--white {
  background-color: var(--color-base-white);
  border: 1px solid var(--color-base-white);
  color: var(--color-primary-darker);
}
.eg-button--solid.eg-button--white:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--white:focus-visible:not(:disabled):not(.is-disabled) {
  /* solid white only changes text color on hover */
  color: var(--color-primary-base);
}

/* ─── solid: orange ────────────────────────────────────────────────── */
.eg-button--solid.eg-button--orange {
  background-color: var(--color-orange-base);
  border: 1px solid var(--color-orange-base);
  color: var(--color-base-black);
}
.eg-button--solid.eg-button--orange:hover:not(:disabled):not(.is-disabled),
.eg-button--solid.eg-button--orange:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-orange-light);
  border-color: var(--color-orange-light);
}

/* ─── outline: primary ─────────────────────────────────────────────── */
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

/* ─── outline: secondary ───────────────────────────────────────────── */
.eg-button--outline.eg-button--secondary {
  background-color: transparent;
  border: 1px solid var(--color-secondary-dark);
  color: var(--color-secondary-darker);
}
.eg-button--outline.eg-button--secondary:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--secondary:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-secondary-base);
  border-color: var(--color-secondary-base);
  color: var(--color-base-black);
}

/* ─── outline: danger ──────────────────────────────────────────────── */
.eg-button--outline.eg-button--danger {
  background-color: transparent;
  border: 1px solid var(--color-red-base);
  color: var(--color-red-base);
}
.eg-button--outline.eg-button--danger:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--danger:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-red-light);
  border-color: var(--color-red-light);
  color: var(--color-base-white);
}

/* ─── outline: success ─────────────────────────────────────────────── */
.eg-button--outline.eg-button--success {
  background-color: transparent;
  border: 1px solid var(--color-green-base);
  color: var(--color-green-base);
}
.eg-button--outline.eg-button--success:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--success:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-green-light);
  border-color: var(--color-green-light);
  color: var(--color-base-white);
}

/* ─── outline: primaryLight ────────────────────────────────────────── */
.eg-button--outline.eg-button--primaryLight {
  background-color: transparent;
  border: 1px solid var(--color-primary-lightest25);
  color: var(--color-base-white);
}
.eg-button--outline.eg-button--primaryLight:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--primaryLight:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-primary-lightest50);
  border-color: transparent;
  color: var(--color-base-white);
}

/* ─── outline: primaryDarker ───────────────────────────────────────── */
.eg-button--outline.eg-button--primaryDarker {
  background-color: transparent;
  border: 1px solid var(--color-primary-darker);
  color: var(--color-primary-darker);
}
.eg-button--outline.eg-button--primaryDarker:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--primaryDarker:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: rgba(0, 42, 103, 0.9);
  border-color: rgba(0, 42, 103, 0.9);
  color: var(--color-base-white);
}

/* ─── outline: white ───────────────────────────────────────────────── */
.eg-button--outline.eg-button--white {
  background-color: transparent;
  border: 1px solid var(--color-base-white);
  color: var(--color-primary-darker);
}
.eg-button--outline.eg-button--white:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--white:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-base-white);
  border-color: var(--color-base-white);
  color: var(--color-primary-base);
}

/* ─── outline: orange ──────────────────────────────────────────────── */
.eg-button--outline.eg-button--orange {
  background-color: transparent;
  border: 1px solid var(--color-orange-light);
  color: var(--color-base-black);
}
.eg-button--outline.eg-button--orange:hover:not(:disabled):not(.is-disabled),
.eg-button--outline.eg-button--orange:focus-visible:not(:disabled):not(.is-disabled) {
  background-color: var(--color-orange-light);
  border-color: var(--color-orange-light);
  color: var(--color-base-black);
}

/* ─── ghost: transparent default, tints on hover ───────────────────── */
.eg-button--ghost {
  background-color: transparent;
  border: none;
}

/* ─── ghost: primary ───────────────────────────────────────────────── */
.eg-button--ghost.eg-button--primary {
  color: var(--color-primary-base);
}
.eg-button--ghost.eg-button--primary:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-primary-lightest25);
  /* gnosis: hoverColor === color, so text color stays primary-base */
}

/* ─── ghost: secondary ─────────────────────────────────────────────── */
.eg-button--ghost.eg-button--secondary {
  color: var(--color-base-black);
}
.eg-button--ghost.eg-button--secondary:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-secondary-light);
}

/* ─── ghost: danger ────────────────────────────────────────────────── */
.eg-button--ghost.eg-button--danger {
  color: var(--color-red-base);
}
.eg-button--ghost.eg-button--danger:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-red-light);
  color: var(--color-base-white);
}

/* ─── ghost: success ───────────────────────────────────────────────── */
.eg-button--ghost.eg-button--success {
  color: var(--color-green-base);
}
.eg-button--ghost.eg-button--success:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-green-light);
  color: var(--color-base-white);
}

/* ─── ghost: primaryLight ──────────────────────────────────────────── */
.eg-button--ghost.eg-button--primaryLight {
  color: var(--color-base-white);
}
.eg-button--ghost.eg-button--primaryLight:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-primary-lightest50);
}

/* ─── ghost: primaryDarker ─────────────────────────────────────────── */
.eg-button--ghost.eg-button--primaryDarker {
  color: var(--color-primary-darker);
}
.eg-button--ghost.eg-button--primaryDarker:hover:not(:disabled):not(.is-disabled) {
  /* gnosis: Color(primary.darker).alpha(0.15) */
  background-color: rgba(0, 42, 103, 0.15);
}

/* ─── ghost: white ─────────────────────────────────────────────────── */
.eg-button--ghost.eg-button--white {
  color: var(--color-primary-darker);
}
.eg-button--ghost.eg-button--white:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-base-white);
  color: var(--color-primary-base);
}

/* ─── ghost: orange ────────────────────────────────────────────────── */
.eg-button--ghost.eg-button--orange {
  color: var(--color-orange-base);
}
.eg-button--ghost.eg-button--orange:hover:not(:disabled):not(.is-disabled) {
  background-color: var(--color-orange-light);
  color: var(--color-base-black);
}

/* ─── link: text-only, transparent everything ──────────────────────── */
.eg-button--link {
  background-color: transparent;
  border: none;
}

/* ─── link: primary ────────────────────────────────────────────────── */
.eg-button--link.eg-button--primary {
  color: var(--color-primary-base);
}
.eg-button--link.eg-button--primary:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-primary-light);
}

/* ─── link: secondary ──────────────────────────────────────────────── */
.eg-button--link.eg-button--secondary {
  color: var(--color-base-black);
}
.eg-button--link.eg-button--secondary:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-secondary-base);
}

/* ─── link: danger ─────────────────────────────────────────────────── */
.eg-button--link.eg-button--danger {
  color: var(--color-red-base);
}
.eg-button--link.eg-button--danger:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-red-lightest);
}

/* ─── link: success ────────────────────────────────────────────────── */
.eg-button--link.eg-button--success {
  color: var(--color-green-base);
}
.eg-button--link.eg-button--success:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-green-lightest);
}

/* ─── link: primaryLight ───────────────────────────────────────────── */
.eg-button--link.eg-button--primaryLight {
  color: var(--color-base-white);
}
.eg-button--link.eg-button--primaryLight:hover:not(:disabled):not(.is-disabled) {
  /* gnosis: Color(white).alpha(0.7) */
  color: rgba(255, 255, 255, 0.7);
}

/* ─── link: primaryDarker ──────────────────────────────────────────── */
.eg-button--link.eg-button--primaryDarker {
  color: var(--color-primary-darker);
}
.eg-button--link.eg-button--primaryDarker:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-primary-base);
}

/* ─── link: white ──────────────────────────────────────────────────── */
.eg-button--link.eg-button--white {
  color: var(--color-primary-darker);
}
.eg-button--link.eg-button--white:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-primary-base);
}

/* ─── link: orange ─────────────────────────────────────────────────── */
.eg-button--link.eg-button--orange {
  color: var(--color-orange-base);
}
.eg-button--link.eg-button--orange:hover:not(:disabled):not(.is-disabled) {
  color: var(--color-primary-base);
}
```

- [ ] **Step 2: Build to confirm CSS is bundled**

Run: `pnpm --filter @epignosis-ui/react build`
Expected: succeeds. `dist/styles.css` size grows substantially (was ~0.91KB, will be ~5–6KB raw / ~1.5KB gzipped). `dist/index.d.ts` declares the new types from Task 2.

Verify: `wc -l packages/react/src/Button/Button.css` should show ~250–300 lines.

---

## Task 4: Replace `Button.stories.tsx` with the 7 representative stories

**Files:**
- Replace: `packages/react/src/Button/Button.stories.tsx`

- [ ] **Step 1: Overwrite `packages/react/src/Button/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button, { type ButtonColor, type ButtonVariant, type ButtonSize } from "./Button";

const COLORS: ButtonColor[] = [
  "primary",
  "secondary",
  "danger",
  "success",
  "primaryLight",
  "primaryDarker",
  "white",
  "orange",
];
const VARIANTS: ButtonVariant[] = ["solid", "outline", "ghost", "link"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    color: { control: "select", options: COLORS },
    variant: { control: "inline-radio", options: VARIANTS },
    size: { control: "inline-radio", options: SIZES },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Click me",
    color: "primary",
    variant: "solid",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// All 8 colors at solid/md, side by side. Background swatch handles the
// "white" and "primaryLight" variants which only render legibly on dark bg.
export const AllColorsSolid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        padding: "1rem",
        background: "var(--color-primary-darker)",
      }}
    >
      {COLORS.map((c) => (
        <Button key={c} color={c} variant="solid" size="md">
          {c}
        </Button>
      ))}
    </div>
  ),
};

// All 4 variants for primary, side by side.
export const AllVariantsPrimary: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      {VARIANTS.map((v) => (
        <Button key={v} color="primary" variant={v} size="md">
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      {SIZES.map((s) => (
        <Button key={s} color="primary" variant="solid" size={s}>
          size {s}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button color="primary" variant="solid" disabled>
        solid disabled
      </Button>
      <Button color="secondary" variant="outline" disabled>
        outline disabled
      </Button>
    </div>
  ),
};

export const AsAnchor: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Button as="a" href="https://example.com" target="_blank" rel="noreferrer">
      I render as an anchor
    </Button>
  ),
};

export const Playground: Story = {
  args: { children: "Playground" },
};
```

- [ ] **Step 2: Verify Storybook serves all stories**

Start Storybook (background):

```bash
pnpm --filter @epignosis-ui/react storybook
```

Wait until "Storybook ready!" appears, then probe:

```bash
curl -s http://localhost:6006/index.json | python3 -c "import sys, json; print(sorted(json.load(sys.stdin)['entries'].keys()))"
```

Expected: 7 entries — `components-button--default`, `components-button--all-colors-solid`, `components-button--all-variants-primary`, `components-button--all-sizes`, `components-button--disabled`, `components-button--as-anchor`, `components-button--playground`.

Open http://localhost:6006 in a browser and visually verify:
- **Default** — solid blue button, label "Click me".
- **AllColorsSolid** — 8 buttons on a dark navy backdrop. Primary blue (`#0046AB`), secondary off-white, red danger, green success, the two primaryLight/primaryDarker semi-transparent ones, white, orange.
- **AllVariantsPrimary** — solid (filled blue), outline (transparent w/ blue border), ghost (transparent text-only that tints on hover), link (text-only).
- **AllSizes** — three buttons in increasing height: 32px / 40px / 48px.
- **Disabled** — both buttons have grey bg, grey-base text, `cursor: not-allowed` on hover.
- **AsAnchor** — inspect with DevTools: it's an `<a href="https://example.com" target="_blank">`, not a `<button>`.
- **Playground** — controls panel works, all 4 fields toggleable.

Stop the server (Ctrl-C) before continuing.

---

## Task 5: Update `src/index.ts` to export the new types

**Files:**
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Overwrite `packages/react/src/index.ts`**

```ts
export { default as Button } from "./Button/Button";
export type { ButtonProps, ButtonColor, ButtonVariant, ButtonSize } from "./Button/Button";
```

(The previous file used `export { Button } from …` because the placeholder was a named export. The new component is a default export, so we re-export it as a named import for the public API.)

- [ ] **Step 2: Final build**

Run: `pnpm --filter @epignosis-ui/react build`
Expected: succeeds. Inspect the output:

```bash
cat packages/react/dist/index.d.ts
```

Expected output:

```ts
export { default as Button } from "./Button/Button";
export type { ButtonProps, ButtonColor, ButtonVariant, ButtonSize } from "./Button/Button";
```

```bash
ls packages/react/dist/
```

Expected: `Button/`, `index.cjs`, `index.cjs.map`, `index.d.ts`, `index.js`, `index.js.map`, `styles.css`, `types/`.

`dist/Button/Button.d.ts` exists and declares the polymorphic `Button` plus the four exported types. `dist/types/polymorphic.d.ts` exists and declares `PolymorphicComponentProps`.

---

## Task 6: Final smoke test from the workspace root

**Files:** none (verification only)

- [ ] **Step 1: Build the whole workspace**

Run: `pnpm build`
Expected: both `@epignosis-ui/react` and `@epignosis-ui/vue` build cleanly. (Vue is unaffected — it still has its placeholder Button.)

- [ ] **Step 2: Run both Storybooks in parallel**

Run: `pnpm storybook:all` (background)

Probe both endpoints:

```bash
curl -s -o /dev/null -w "react=%{http_code}\n" http://localhost:6006/
curl -s -o /dev/null -w "vue=%{http_code}\n"   http://localhost:6007/
curl -s http://localhost:6006/index.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('react stories:', len(d['entries']))"
curl -s http://localhost:6007/index.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('vue stories:', len(d['entries']))"
```

Expected:
- `react=200`, 7 stories.
- `vue=200`, 5 stories (the placeholder Vue Button is untouched).

Visually open http://localhost:6006/?path=/story/components-button--all-colors-solid in a browser and confirm the dark-bg swatch shows all 8 colored buttons rendering correctly.

Stop the server when done.

---

## Done

- `@epignosis-ui/react` ships a real polymorphic Button matching the gnosis API surface (color/variant/size + `as`).
- All styles consume `@epignosis-ui/tokens` CSS variables; only three alpha-modulated rgba values are hardcoded inline.
- No new runtime dependencies. No emotion, framer-motion, classnames, or color in the package's deps tree.
- Vue and tokens packages are untouched.
- Working tree has the changes uncommitted, per the user's standing instruction.

Out-of-scope follow-ups (from the spec):
- Active state (`aria-pressed` or restored prop) when consumers need it.
- `isLoading` + Loader port when consumers need it.
- Icon slots when consumers need them.
- Vue port when consumers need it.
- Promoting the three hardcoded rgba values into `tokens.css` if more components need them.
