# React & Vue Component Packages with Storybook — Design

**Date:** 2026-04-27
**Status:** Approved (pending user review of this written spec)

## Goal

Restructure the `epignosis-ui` repo from a single tokens-only package into a pnpm workspaces monorepo that hosts:

1. `@epignosis-ui/tokens` — the existing design tokens (TS + CSS variables), framework-agnostic.
2. `@epignosis-ui/react` — a React 18 component library that consumes the tokens, with its own Storybook.
3. `@epignosis-ui/vue` — a Vue 3 component library that consumes the tokens, with its own Storybook.

A sample `Button` component lives in each component package and demonstrates real consumption of the tokens (colors, spacing, typography, border-radius, transitions). Each Button has variants `primary | secondary`, sizes `sm | md`, and a `disabled` state.

## Non-goals

- Test suites beyond Storybook (no Vitest/RTL).
- CI, lint, Prettier configuration.
- A publishing/release flow (changesets, release-please). Consumption stays as today: install from git URL.
- A combined ("composition") Storybook that aggregates both frameworks. Each Storybook is independent.
- Building out a full component library beyond the sample Button.

## Repo layout

```
epignosis-ui/
├── package.json                  workspace root, devDeps + fan-out scripts only
├── pnpm-workspace.yaml
├── tsconfig.base.json            shared TS settings; packages extend this
├── .gitignore
├── README.md                     updated to describe the monorepo
├── DESIGN_TOKENS.md              kept at repo root, content unchanged
├── docs/superpowers/specs/       this design lives here
└── packages/
    ├── tokens/                   @epignosis-ui/tokens
    ├── react/                    @epignosis-ui/react
    └── vue/                      @epignosis-ui/vue
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
```

## Tooling assumptions

- Node ≥ 20.
- pnpm ≥ 9 already installed locally.
- All packages use **TypeScript 6.x** (current latest).
- Component packages use **Vite 8** in library mode for builds; tokens package ships raw `.ts` source (no build step).
- Storybook 10.x using `@storybook/react-vite` and `@storybook/vue3-vite` framework adapters with CSF 3 stories.
- React 19 in the React package, Vue 3.5 in the Vue package.

> **Note:** This spec was originally drafted with React 18 / TypeScript 5 / Vite 6 / Vue 3.4 to match what felt like "stable defaults." The user requested latest-of-everything during implementation; the values above reflect what actually shipped. The plan document captures the build-tooling consequences of the bump (notably: `vite-plugin-dts` could not produce a typed rollup under TS 6, so the React package emits declarations via a plain `tsc -p tsconfig.build.json` step like Vue does).

## Package: `@epignosis-ui/tokens`

The current code (`src/theme/tokens.ts`, `src/index.ts`) moves into `packages/tokens/src/` essentially unchanged.

### Layout

```
packages/tokens/
├── package.json
├── src/
│   ├── index.ts                  re-exports from theme/tokens
│   └── theme/
│       ├── tokens.ts             current tokens.ts, unchanged
│       └── tokens.css            NEW — CSS variables mirror of tokens.ts
└── README.md                     slim, points back to root DESIGN_TOKENS.md
```

### `package.json`

```json
{
  "name": "@epignosis-ui/tokens",
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".":            { "types": "./src/index.ts", "import": "./src/index.ts" },
    "./tokens":     { "types": "./src/theme/tokens.ts", "import": "./src/theme/tokens.ts" },
    "./tokens.css": "./src/theme/tokens.css"
  },
  "files": ["src"],
  "sideEffects": ["**/*.css"]
}
```

### Differences from today

- Renamed from `epignosis-ui` to `@epignosis-ui/tokens`.
- React peer deps removed (tokens are framework-agnostic).
- `src/theme/tokens.css` is added. The existing root `package.json` already references it in its exports map but the file did not exist.

### `tokens.css`

`tokens.ts` remains the source of truth. `tokens.css` is hand-written to match and is kept in sync manually. A header comment in `tokens.css` reminds maintainers to update both files together. Variable names follow the conventions already documented in `DESIGN_TOKENS.md` (e.g. `--color-primary-base`, `--font-size-md`, `--spacing-xs`). Alpha variants in JS like `colors.primary.lightest25` map to `--color-primary-lightest-25` in CSS.

If drift becomes a real problem later, replace the hand-written file with a small codegen script. Out of scope today.

## Package: `@epignosis-ui/react`

### Layout

```
packages/react/
├── package.json
├── tsconfig.json                  extends ../../tsconfig.base.json
├── tsconfig.build.json            emits .d.ts only, declarationDir: dist
├── vite.config.ts                 library mode build
├── .storybook/
│   ├── main.ts
│   └── preview.ts                 imports @epignosis-ui/tokens/tokens.css globally
└── src/
    ├── index.ts                   public exports
    └── Button/
        ├── Button.tsx
        ├── Button.css
        └── Button.stories.tsx
```

### `package.json`

```json
{
  "name": "@epignosis-ui/react",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0"
  },
  "dependencies": {
    "@epignosis-ui/tokens": "workspace:*"
  },
  "devDependencies": {
    "@storybook/react-vite": "^10.2.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "storybook": "^10.2.0",
    "typescript": "^6.0.0",
    "vite": "^8.0.0"
  }
}
```

### Build output

`vite.config.ts` configures library mode:

- `entry: src/index.ts`
- `formats: ['es', 'cjs']` → `dist/index.js`, `dist/index.cjs`
- `rollupOptions.external: ['react', 'react-dom', 'react/jsx-runtime']`
- All component CSS aggregates into `dist/styles.css` (one stylesheet consumers import once)
- Declarations emitted by a separate `tsc -p tsconfig.build.json` step after `vite build`. (Originally we tried `vite-plugin-dts`, but its bundled API Extractor doesn't yet support TS 6 — it silently produced an empty rolled-up `.d.ts`. Plain `tsc` with `rootDir: "./src"` works cleanly and gives us symmetry with Vue.)

### Sample `Button` API

```tsx
// Button.tsx
import "./Button.css";

export type ButtonProps = {
  variant?: "primary" | "secondary";    // default: "primary"
  size?: "sm" | "md";                    // default: "md"
  disabled?: boolean;
  type?: "button" | "submit" | "reset";  // default: "button"
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  disabled,
  type = "button",
  onClick,
  children,
}: ButtonProps) {
  const className = `eg-button eg-button--${variant} eg-button--${size}`;
  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
```

### Sample `Button` CSS

`Button.css` consumes CSS variables from `@epignosis-ui/tokens/tokens.css`. The `eg-` prefix prevents collisions in consumer apps.

```css
.eg-button {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), opacity var(--transition-fast);
}
.eg-button:disabled { opacity: 0.5; cursor: not-allowed; }

.eg-button--sm { font-size: var(--font-size-sm); padding: var(--spacing-xxs) var(--spacing-sm); }
.eg-button--md { font-size: var(--font-size-md); padding: var(--spacing-xs)  var(--spacing-md); }

.eg-button--primary           { background-color: var(--color-primary-base);   color: var(--color-base-white); }
.eg-button--primary:hover     { background-color: var(--color-primary-dark); }
.eg-button--primary:disabled  { background-color: var(--color-primary-base); }

.eg-button--secondary          { background-color: var(--color-secondary-lighter); color: var(--color-secondary-darkest); }
.eg-button--secondary:hover    { background-color: var(--color-secondary-light); }
```

### Storybook stories

```tsx
// Button.stories.tsx — CSF 3
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant:  { control: "inline-radio", options: ["primary", "secondary"] },
    size:     { control: "inline-radio", options: ["sm", "md"] },
    disabled: { control: "boolean" },
  },
  args: { children: "Click me", variant: "primary", size: "md" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
export const SecondaryDisabled: Story = { args: { variant: "secondary", disabled: true } };
```

### Public exports

```ts
// src/index.ts
export { Button } from "./Button/Button";
export type { ButtonProps } from "./Button/Button";
```

### Consumer usage

```ts
import { Button } from "@epignosis-ui/react";
import "@epignosis-ui/tokens/tokens.css";
import "@epignosis-ui/react/styles.css";
```

## Package: `@epignosis-ui/vue`

### Layout

```
packages/vue/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vite.config.ts                 library mode + @vitejs/plugin-vue
├── .storybook/
│   ├── main.ts                    framework: '@storybook/vue3-vite', docgen: 'vue-component-meta'
│   └── preview.ts                 imports @epignosis-ui/tokens/tokens.css globally
└── src/
    ├── index.ts                   public exports
    └── Button/
        ├── Button.vue
        ├── Button.css
        └── Button.stories.ts
```

### `package.json`

```json
{
  "name": "@epignosis-ui/vue",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "vue-tsc -p tsconfig.build.json && vite build",
    "dev": "vite build --watch",
    "storybook": "storybook dev -p 6007",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "dependencies": {
    "@epignosis-ui/tokens": "workspace:*"
  },
  "devDependencies": {
    "@storybook/vue3-vite": "^10.2.0",
    "@vitejs/plugin-vue": "^6.0.0",
    "storybook": "^10.2.0",
    "typescript": "^6.0.0",
    "vite": "^8.0.0",
    "vue": "^3.5.0",
    "vue-component-meta": "^3.0.0",
    "vue-tsc": "^3.0.0"
  }
}
```

### Build output

Vite library mode with `@vitejs/plugin-vue` to compile SFCs. The Vue build runs `vue-tsc -p tsconfig.build.json` **after** `vite build` (not before — Vite's `emptyOutDir: true` would otherwise wipe vue-tsc's output). External: `vue`. Component CSS aggregates into `dist/styles.css`.

`tsconfig.build.json` sets `rootDir: "./src"` (TS 6 requires it explicitly) and `types: ["vite/client"]` (TS 6 needs CSS side-effect imports declared, which `vite/client` provides).

### Sample `Button` (`<script setup>` + Composition API + TS)

```vue
<!-- Button.vue -->
<script setup lang="ts">
import "./Button.css";

export interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  type: "button",
});

defineEmits<{ (e: "click", event: MouseEvent): void }>();
</script>

<template>
  <button
    :class="['eg-button', `eg-button--${props.variant}`, `eg-button--${props.size}`]"
    :type="props.type"
    :disabled="props.disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
```

### Sample `Button` CSS

Identical to the React package's `Button.css`. Same class names, same CSS-variable references. The file is duplicated rather than extracted into a shared internal package — at ~40 lines for one component, duplication is simpler. If/when more components arrive and CSS overlap grows, extract a `@epignosis-ui/styles` internal package then.

### Storybook stories

```ts
// Button.stories.ts — CSF 3
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Button from "./Button.vue";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant:  { control: "inline-radio", options: ["primary", "secondary"] },
    size:     { control: "inline-radio", options: ["sm", "md"] },
    disabled: { control: "boolean" },
  },
  args: { variant: "primary", size: "md" },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Click me</Button>',
  }),
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
export const SecondaryDisabled: Story = { args: { variant: "secondary", disabled: true } };
```

### Public exports

```ts
// src/index.ts
export { default as Button } from "./Button/Button.vue";
export type { ButtonProps } from "./Button/Button.vue";
```

### Consumer usage

```ts
import { Button } from "@epignosis-ui/vue";
import "@epignosis-ui/tokens/tokens.css";
import "@epignosis-ui/vue/styles.css";
```

## Storybook architecture

Each package owns its own Storybook. No shared shell, no cross-framework navigation. Each Storybook is independently deployable.

| Decision | Choice | Why |
| --- | --- | --- |
| Storybook major | v10 | Current stable; Vite 5/6 native; CSF 3. |
| React adapter | `@storybook/react-vite` | Matches the Vite library build. |
| Vue adapter | `@storybook/vue3-vite` with `docgen: 'vue-component-meta'` | Best TS prop inference for autodocs. |
| Stories format | CSF 3 (not CSF Next) | Stable, well-documented. |
| Story location | Colocated next to component source | Standard practice. |
| Tokens in preview | Each `.storybook/preview.ts` imports `@epignosis-ui/tokens/tokens.css` | Stories render with real CSS variables. |
| Web fonts in preview | Each package has a `.storybook/preview-head.html` that loads Mulish from Google Fonts | The tokens declare `font-family: "Mulish", Arial, sans-serif` but don't ship the font file. Without this, Storybook silently falls back to Arial. (Gnosis has the same gap — its consuming apps load Mulish themselves.) |
| Default ports | React 6006, Vue 6007 | Both can run simultaneously. |
| Build output | Each package's own `storybook-static/` | Independent deploys. |
| Addons | None beyond what ships in SB 10 core | Avoid addon drift. |

### Root scripts

```json
"scripts": {
  "build":            "pnpm -r --filter @epignosis-ui/react --filter @epignosis-ui/vue run build",
  "storybook:react":  "pnpm --filter @epignosis-ui/react storybook",
  "storybook:vue":    "pnpm --filter @epignosis-ui/vue storybook",
  "storybook:all":    "pnpm -r --parallel --filter @epignosis-ui/react --filter @epignosis-ui/vue run storybook",
  "build-storybook":  "pnpm -r --filter @epignosis-ui/react --filter @epignosis-ui/vue run build-storybook"
}
```

### Considered and rejected

- **Storybook composition (refs)** — adds a third config to maintain for marginal value at this scope. Easy to add later if useful.
- **Shared base `.storybook/` config** — framework-specific differences (Vite plugins, docgen options) make sharing more painful than helpful for two configs.

## Inter-package dependencies

`@epignosis-ui/react` and `@epignosis-ui/vue` each declare `@epignosis-ui/tokens` with `workspace:*`. pnpm symlinks the local source. Component packages import like:

```ts
import { colors } from "@epignosis-ui/tokens";
import "@epignosis-ui/tokens/tokens.css";
```

## Verification once built

1. `pnpm install` from the root succeeds with no errors.
2. `pnpm -r build` builds `@epignosis-ui/react` and `@epignosis-ui/vue` cleanly. (`@epignosis-ui/tokens` has no build.)
3. `pnpm storybook:react` opens on :6006 and renders all 5 Button stories with tokens visibly applied (primary blue = `#0046AB`).
4. `pnpm storybook:vue` opens on :6007 and renders the same 5 stories.
5. `pnpm storybook:all` runs both in parallel without port conflicts.

## Open questions / follow-ups (out of scope)

- Tests (Vitest + Testing Library / Vue Test Utils).
- CI, lint, Prettier.
- Publishing flow (changesets).
- Storybook composition into a single shell.
- Codegen for `tokens.css` from `tokens.ts` if hand-sync becomes a problem.
- Extracting shared component CSS into an internal package once more components exist.
