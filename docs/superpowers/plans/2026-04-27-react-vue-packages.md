# React & Vue Component Packages with Storybook — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the `epignosis-ui` repo into a pnpm workspaces monorepo with three packages — `@epignosis/tokens` (existing tokens, relocated), `@epignosis/react` and `@epignosis/vue` (each with a sample Button consuming the tokens, and its own Storybook).

**Architecture:** pnpm workspaces. Tokens ship raw `.ts` source (no build). Component packages prebuild with Vite library mode (Rollup ESM + CJS + `.d.ts`). Each component package owns its own Storybook v10 instance — React on port 6006, Vue on port 6007.

**Tech Stack:** pnpm ≥ 9, Node ≥ 20, TypeScript 5.x, Vite 6, Storybook 10, React 18, Vue 3.4 (`<script setup>` + Composition API + TS).

**Spec:** [`docs/superpowers/specs/2026-04-27-react-vue-packages-design.md`](../specs/2026-04-27-react-vue-packages-design.md)

**Note on testing:** The spec excludes unit tests (no Vitest/RTL) — verification at each task is via build success and visual confirmation in Storybook. Plan retains TDD-style discipline (small steps, verify after each, frequent commits).

---

## Pre-flight

Run from `/Users/alexboi/projects/Epignosis/epignosis-ui` (the repo root). Verify environment before starting:

```bash
node --version   # expect v20.x.x or higher
pnpm --version   # expect 9.x.x or higher
git status       # expect: clean working tree on main, ahead by 1 commit (the spec)
```

If pnpm is missing: `corepack enable && corepack prepare pnpm@latest --activate`.

---

## File Map

Files this plan creates or modifies:

**Workspace root (modify):**
- `package.json` — convert from single-package to workspace root
- `.gitignore` — add `storybook-static`
- `README.md` — rewrite for monorepo
- Delete: `src/` (after move into `packages/tokens/`)
- Delete: root `tsconfig.json` (replaced by `tsconfig.base.json` that packages extend)

**Workspace root (create):**
- `pnpm-workspace.yaml`
- `tsconfig.base.json`

**`packages/tokens/` (create):**
- `package.json`
- `README.md`
- `src/index.ts` (moved from root)
- `src/theme/tokens.ts` (moved from root)
- `src/theme/tokens.css` (new — CSS-variables mirror of `tokens.ts`)

**`packages/react/` (create):**
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `.storybook/main.ts`
- `.storybook/preview.ts`
- `src/index.ts`
- `src/Button/Button.tsx`
- `src/Button/Button.css`
- `src/Button/Button.stories.tsx`

**`packages/vue/` (create):**
- `package.json`
- `tsconfig.json`
- `tsconfig.build.json`
- `vite.config.ts`
- `env.d.ts` (Vue SFC type shim for editors / vue-tsc)
- `.storybook/main.ts`
- `.storybook/preview.ts`
- `src/index.ts`
- `src/Button/Button.vue`
- `src/Button/Button.css`
- `src/Button/Button.stories.ts`

---

## Task 1: Convert repo to pnpm workspace root

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Modify: `package.json`
- Modify: `.gitignore`
- Delete: `tsconfig.json` (root)

- [ ] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "packages/*"
```

- [ ] **Step 2: Replace root `package.json` with workspace-root version**

Overwrite the existing `package.json` with:

```json
{
  "name": "epignosis-ui-workspace",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "description": "Epignosis shared UI workspace — tokens, React components, Vue components.",
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "scripts": {
    "build": "pnpm -r --filter @epignosis/react --filter @epignosis/vue run build",
    "storybook:react": "pnpm --filter @epignosis/react storybook",
    "storybook:vue": "pnpm --filter @epignosis/vue storybook",
    "storybook:all": "pnpm -r --parallel --filter \"@epignosis/{react,vue}\" run storybook",
    "build-storybook": "pnpm -r --filter \"@epignosis/{react,vue}\" run build-storybook"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 3: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "allowSyntheticDefaultImports": true
  }
}
```

- [ ] **Step 4: Delete the root `tsconfig.json`**

```bash
git rm tsconfig.json
```

(It was for the old single-package layout. Each package extends `tsconfig.base.json` directly. We don't need TS project references for this setup.)

- [ ] **Step 5: Update `.gitignore`**

Replace contents with:

```
node_modules
dist
storybook-static
.DS_Store
*.log
```

- [ ] **Step 6: Verify pnpm accepts the workspace config**

Run: `pnpm install`
Expected: completes with no errors, prints something like `Already up to date` or installs only `typescript`. Creates `pnpm-lock.yaml` and `node_modules` at the root.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore pnpm-lock.yaml
git add -u tsconfig.json
git commit -m "Convert repo to pnpm workspace root"
```

---

## Task 2: Move existing tokens code into `packages/tokens/`

**Files:**
- Create: `packages/tokens/package.json`
- Create: `packages/tokens/tsconfig.json`
- Create: `packages/tokens/README.md`
- Move: `src/index.ts` → `packages/tokens/src/index.ts`
- Move: `src/theme/tokens.ts` → `packages/tokens/src/theme/tokens.ts`
- Create: `packages/tokens/src/theme/tokens.css`
- Delete: `src/` (root-level, after the move)

- [ ] **Step 1: Create the directory structure and move files**

```bash
mkdir -p packages/tokens/src/theme
git mv src/index.ts packages/tokens/src/index.ts
git mv src/theme/tokens.ts packages/tokens/src/theme/tokens.ts
rmdir src/theme src
```

Verify with `ls packages/tokens/src/theme/` — should show `tokens.ts`.

- [ ] **Step 2: Create `packages/tokens/package.json`**

```json
{
  "name": "@epignosis/tokens",
  "version": "0.1.0",
  "type": "module",
  "description": "Epignosis design tokens — framework-agnostic. Ships raw TS + CSS variables.",
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts",
      "require": "./src/index.ts"
    },
    "./tokens": {
      "types": "./src/theme/tokens.ts",
      "import": "./src/theme/tokens.ts",
      "require": "./src/theme/tokens.ts"
    },
    "./tokens.css": "./src/theme/tokens.css"
  },
  "files": ["src"],
  "sideEffects": ["**/*.css"]
}
```

- [ ] **Step 3: Create `packages/tokens/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"]
}
```

(`noEmit: true` — this package ships raw source, no build output.)

- [ ] **Step 4: Create `packages/tokens/src/theme/tokens.css`**

```css
/*
 * Epignosis Design Tokens — CSS Custom Properties
 *
 * Mirror of src/theme/tokens.ts. tokens.ts is the source of truth.
 * If you change values here, update tokens.ts to match (and vice versa).
 */
:root {
  /* ─────────────────────────────────────── Colors — base */
  --color-base-primary: #0046AB;
  --color-base-secondary: #9EA5A9;
  --color-base-green: #1B7855;
  --color-base-orange: #FF9C28;
  --color-base-red: #D12525;
  --color-base-black: #000000;
  --color-base-white: #FFFFFF;
  --color-base-blue: #0046AB;

  /* Colors — primary palette */
  --color-primary-lightest-25: rgba(36, 125, 255, 0.25);
  --color-primary-lightest-50: rgba(36, 125, 255, 0.5);
  --color-primary-lightest: #247DFF;
  --color-primary-lighter: #0169FF;
  --color-primary-light: #0054CD;
  --color-primary-base: #0046AB;
  --color-primary-dark: #003889;
  --color-primary-darker-50: rgba(0, 42, 103, 0.5);
  --color-primary-darker: #002A67;
  --color-primary-darkest: #001C44;

  /* Colors — secondary palette */
  --color-secondary-lightest: #FFFFFF;
  --color-secondary-lighter: #F5F5F6;
  --color-secondary-light: #C1C5C8;
  --color-secondary-base: #9EA5A9;
  --color-secondary-dark: #7B858A;
  --color-secondary-darker: #5C6468;
  --color-secondary-darkest: #3D4245;

  /* Colors — green palette */
  --color-green-lightest: #2ECC90;
  --color-green-lighter: #29B47F;
  --color-green-light-50: rgba(32, 144, 102, 0.5);
  --color-green-light: #209066;
  --color-green-base: #1B7855;
  --color-green-dark: #166044;
  --color-green-darker: #104833;
  --color-green-darkest: #0B3022;

  /* Colors — orange palette */
  --color-orange-lightest: #FFFBF6;
  --color-orange-lighter: #FFE0BB;
  --color-orange-light: #FFB763;
  --color-orange-base-50: rgba(255, 156, 40, 0.5);
  --color-orange-base: #FF9C28;
  --color-orange-dark: #EC7F00;
  --color-orange-darker: #B15F00;
  --color-orange-darkest: #764000;

  /* Colors — red palette */
  --color-red-lightest: #F1B1B1;
  --color-red-lighter: #EA8787;
  --color-red-light-50: rgba(223, 73, 73, 0.5);
  --color-red-light: #DF4949;
  --color-red-base: #D12525;
  --color-red-dark: #A71E1E;
  --color-red-darker: #7D1616;
  --color-red-darkest: #540F0F;

  /* Colors — convenience aliases */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-blue: #0046AB;

  /* ─────────────────────────────────────── Typography */
  --font-family-body: "Mulish", Arial, sans-serif;
  --font-size-xxs: 0.5rem;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.375rem;
  --font-size-2xl: 1.75rem;
  --font-size-3xl: 2.125rem;
  --line-height-base: 1.5715;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* ─────────────────────────────────────── Spacing */
  --spacing-none: 0;
  --spacing-xxs: 0.25rem;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* ─────────────────────────────────────── Border radius */
  --border-radius-none: 0;
  --border-radius-sm: 5px;
  --border-radius-xl: 30px;
  --border-radius-full: 50%;

  /* ─────────────────────────────────────── Shadows */
  --shadow-sm: 0 3px 6px #C1C5C8;
  --shadow-checkbox: 0px 0px 0px 9px rgba(36, 125, 255, 0.25);

  /* ─────────────────────────────────────── Breakpoints */
  --breakpoint-xs: 320px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1600px;
  --breakpoint-3xl: 1920px;

  /* ─────────────────────────────────────── Z-index */
  --z-index-base: 0;
  --z-index-raised: 1;
  --z-index-overlay: 2;
  --z-index-drawer: 3;
  --z-index-dropdown: 100;
  --z-index-sidebar: 1001;
  --z-index-modal: 1001;

  /* ─────────────────────────────────────── Transitions */
  --transition-fast: 0.2s;
  --transition-base: 0.3s;
  --transition-ease-in: 0.2s ease-in;
  --transition-ease-in-out: 0.3s ease-in-out;
  --transition-ease-out: 0.2s ease;
}
```

- [ ] **Step 5: Create `packages/tokens/README.md`**

```markdown
# @epignosis/tokens

Framework-agnostic design tokens for the Epignosis design system. Ships raw TypeScript and a CSS variables stylesheet — your bundler compiles them.

See the root [`DESIGN_TOKENS.md`](../../DESIGN_TOKENS.md) for the full token reference.

## Usage

```ts
import { colors, spacing } from "@epignosis/tokens";
import "@epignosis/tokens/tokens.css";
```
```

- [ ] **Step 6: Run install and verify the package resolves**

Run: `pnpm install`
Expected: completes successfully. The workspace now recognises `@epignosis/tokens`.

Verify with:

```bash
pnpm list --filter @epignosis/tokens --depth 0
```

Expected output includes a line like `@epignosis/tokens@0.1.0 /Users/alexboi/projects/Epignosis/epignosis-ui/packages/tokens`.

- [ ] **Step 7: Commit**

The `git mv` calls in Step 1 already staged the moves. Now stage the new files:

```bash
git add packages/tokens/
git status
```

`git status` should show: renamed `src/index.ts` → `packages/tokens/src/index.ts`, renamed `src/theme/tokens.ts` → `packages/tokens/src/theme/tokens.ts`, plus new files for `package.json`, `tsconfig.json`, `README.md`, `tokens.css`.

```bash
git commit -m "Move design tokens into @epignosis/tokens package, add tokens.css"
```

---

## Task 3: Scaffold `@epignosis/react` (no component yet)

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/vite.config.ts`
- Create: `packages/react/src/index.ts`

- [ ] **Step 1: Create `packages/react/package.json`**

```json
{
  "name": "@epignosis/react",
  "version": "0.1.0",
  "type": "module",
  "description": "Epignosis React component library.",
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
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "@epignosis/tokens": "workspace:*"
  },
  "devDependencies": {
    "@storybook/react-vite": "^10.2.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "storybook": "^10.2.0",
    "typescript": "^5.4.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create `packages/react/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "dist",
    "noEmit": true
  },
  "include": ["src", "vite.config.ts", ".storybook"]
}
```

(`noEmit: true` because `vite-plugin-dts` emits declarations during the Vite build.)

- [ ] **Step 3: Create `packages/react/vite.config.ts`**

```ts
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      tsconfigPath: "./tsconfig.json",
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? "";
          if (name.endsWith(".css")) return "styles.css";
          return "[name][extname]";
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
```

- [ ] **Step 4: Create empty `packages/react/src/index.ts`**

```ts
// Public exports — populated by Task 4.
export {};
```

- [ ] **Step 5: Install dependencies**

Run: `pnpm install`
Expected: completes successfully, installs Vite, React, Storybook, etc. into the workspace.

- [ ] **Step 6: Verify the (empty) build succeeds**

Run: `pnpm --filter @epignosis/react build`
Expected: succeeds. `dist/index.js`, `dist/index.cjs`, and `dist/index.d.ts` exist (even though empty).

Verify: `ls packages/react/dist/` should show those three files.

- [ ] **Step 7: Commit**

```bash
git add packages/react/ pnpm-lock.yaml
git commit -m "Scaffold @epignosis/react with Vite library build"
```

---

## Task 4: Add the React Button component

**Files:**
- Create: `packages/react/src/Button/Button.tsx`
- Create: `packages/react/src/Button/Button.css`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Create `packages/react/src/Button/Button.css`**

```css
.eg-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    opacity var(--transition-fast);
}

.eg-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.eg-button--sm {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xxs) var(--spacing-sm);
}

.eg-button--md {
  font-size: var(--font-size-md);
  padding: var(--spacing-xs) var(--spacing-md);
}

.eg-button--primary {
  background-color: var(--color-primary-base);
  color: var(--color-base-white);
}

.eg-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.eg-button--secondary {
  background-color: var(--color-secondary-lighter);
  color: var(--color-secondary-darkest);
}

.eg-button--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-light);
}
```

- [ ] **Step 2: Create `packages/react/src/Button/Button.tsx`**

```tsx
import type { MouseEvent, ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
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

- [ ] **Step 3: Update `packages/react/src/index.ts`**

```ts
export { Button } from "./Button/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button/Button";
```

- [ ] **Step 4: Build and verify outputs**

Run: `pnpm --filter @epignosis/react build`

Expected: succeeds with no errors. Verify:

```bash
ls packages/react/dist/
```

Should show: `index.js`, `index.cjs`, `index.d.ts`, `styles.css`, plus sourcemap files.

Inspect `dist/index.d.ts` — it should declare `Button` and `ButtonProps`.
Inspect `dist/styles.css` — it should contain the `.eg-button` rules.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/
git commit -m "Add React Button component consuming design tokens"
```

---

## Task 5: Set up React Storybook with Button stories

**Files:**
- Create: `packages/react/.storybook/main.ts`
- Create: `packages/react/.storybook/preview.ts`
- Create: `packages/react/src/Button/Button.stories.tsx`

- [ ] **Step 1: Create `packages/react/.storybook/main.ts`**

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  addons: [],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
```

- [ ] **Step 2: Create `packages/react/.storybook/preview.ts`**

```ts
import type { Preview } from "@storybook/react-vite";
import "@epignosis/tokens/tokens.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
```

- [ ] **Step 3: Create `packages/react/src/Button/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    disabled: { control: "boolean" },
  },
  args: { children: "Click me", variant: "primary", size: "md", disabled: false },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
export const SecondaryDisabled: Story = { args: { variant: "secondary", disabled: true } };
```

- [ ] **Step 4: Verify Storybook dev server boots**

Run: `pnpm --filter @epignosis/react storybook` (in a terminal you can leave open or run in background).
Expected: Storybook starts on http://localhost:6006. Console prints something like `Storybook 10.x.x for react-vite started`.

In a browser, open http://localhost:6006. Navigate to `Components/Button`. Verify:
- All 5 stories appear in the sidebar.
- "Primary" shows a blue button (`#0046AB`).
- "Secondary" shows a light-grey button.
- "Small" is visibly smaller than "Primary".
- "Disabled" stories are at 50% opacity.
- Toggling controls in the right panel updates the preview.

Stop the server (Ctrl+C) before continuing.

- [ ] **Step 5: Verify static build**

Run: `pnpm --filter @epignosis/react build-storybook`
Expected: succeeds, produces `packages/react/storybook-static/`. `index.html` exists in that directory.

- [ ] **Step 6: Commit**

```bash
git add packages/react/.storybook packages/react/src/Button/Button.stories.tsx
git commit -m "Add React Storybook with Button stories"
```

---

## Task 6: Scaffold `@epignosis/vue` (no component yet)

**Files:**
- Create: `packages/vue/package.json`
- Create: `packages/vue/tsconfig.json`
- Create: `packages/vue/tsconfig.build.json`
- Create: `packages/vue/vite.config.ts`
- Create: `packages/vue/env.d.ts`
- Create: `packages/vue/src/index.ts`

- [ ] **Step 1: Create `packages/vue/package.json`**

```json
{
  "name": "@epignosis/vue",
  "version": "0.1.0",
  "type": "module",
  "description": "Epignosis Vue 3 component library.",
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
    "vue": "^3.4.0"
  },
  "dependencies": {
    "@epignosis/tokens": "workspace:*"
  },
  "devDependencies": {
    "@storybook/vue3-vite": "^10.2.0",
    "@vitejs/plugin-vue": "^5.1.0",
    "storybook": "^10.2.0",
    "typescript": "^5.4.0",
    "vite": "^6.0.0",
    "vue": "^3.4.0",
    "vue-component-meta": "^2.1.0",
    "vue-tsc": "^2.1.0"
  }
}
```

(`vue-component-meta` is what the Storybook Vue3 framework uses for prop autodocs; pinning it as a devDep avoids surprises.)

- [ ] **Step 2: Create `packages/vue/tsconfig.json`** (used by editors, type-checks all files including stories and storybook config)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts", ".storybook", "env.d.ts"]
}
```

- [ ] **Step 3: Create `packages/vue/tsconfig.build.json`** (used by `vue-tsc` to emit `.d.ts` for the public API only)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist"
  },
  "include": ["src/index.ts", "src/**/*.vue", "src/**/*.ts", "env.d.ts"],
  "exclude": ["src/**/*.stories.ts", "src/**/*.stories.tsx", "node_modules", "dist"]
}
```

- [ ] **Step 4: Create `packages/vue/vite.config.ts`**

```ts
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? "";
          if (name.endsWith(".css")) return "styles.css";
          return "[name][extname]";
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
```

- [ ] **Step 5: Create `packages/vue/env.d.ts`**

```ts
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // Generic SFC shim so editors / vue-tsc can resolve `import Foo from "./Foo.vue"`.
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
```

- [ ] **Step 6: Create empty `packages/vue/src/index.ts`**

```ts
// Public exports — populated by Task 7.
export {};
```

- [ ] **Step 7: Install dependencies**

Run: `pnpm install`
Expected: completes successfully. Vue, Vite plugin, Storybook, vue-tsc all installed.

- [ ] **Step 8: Verify scaffold builds (empty)**

Run: `pnpm --filter @epignosis/vue build`
Expected: succeeds. `vue-tsc` produces `dist/index.d.ts` (essentially empty), then `vite build` produces `dist/index.js` and `dist/index.cjs`.

Verify: `ls packages/vue/dist/` shows those files.

- [ ] **Step 9: Commit**

```bash
git add packages/vue/ pnpm-lock.yaml
git commit -m "Scaffold @epignosis/vue with Vite library build"
```

---

## Task 7: Add the Vue Button component

**Files:**
- Create: `packages/vue/src/Button/Button.vue`
- Create: `packages/vue/src/Button/Button.css`
- Modify: `packages/vue/src/index.ts`

- [ ] **Step 1: Create `packages/vue/src/Button/Button.css`**

(Identical to the React package. Duplicated rather than shared — see spec for rationale.)

```css
.eg-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    opacity var(--transition-fast);
}

.eg-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.eg-button--sm {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xxs) var(--spacing-sm);
}

.eg-button--md {
  font-size: var(--font-size-md);
  padding: var(--spacing-xs) var(--spacing-md);
}

.eg-button--primary {
  background-color: var(--color-primary-base);
  color: var(--color-base-white);
}

.eg-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.eg-button--secondary {
  background-color: var(--color-secondary-lighter);
  color: var(--color-secondary-darkest);
}

.eg-button--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-light);
}
```

- [ ] **Step 2: Create `packages/vue/src/Button/Button.vue`**

```vue
<script setup lang="ts">
import "./Button.css";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  type: "button",
});

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
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

- [ ] **Step 3: Update `packages/vue/src/index.ts`**

```ts
export { default as Button } from "./Button/Button.vue";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button/Button.vue";
```

- [ ] **Step 4: Build and verify outputs**

Run: `pnpm --filter @epignosis/vue build`
Expected: `vue-tsc` succeeds (no type errors), then `vite build` succeeds. Verify:

```bash
ls packages/vue/dist/
```

Should show: `index.js`, `index.cjs`, `index.d.ts`, `styles.css`, plus sourcemap files.

Inspect `dist/index.d.ts` — it should declare a `Button` export. The exact form will be `vue-tsc`'s emitted SFC type.
Inspect `dist/styles.css` — it should contain the `.eg-button` rules.

- [ ] **Step 5: Commit**

```bash
git add packages/vue/src/
git commit -m "Add Vue Button component consuming design tokens"
```

---

## Task 8: Set up Vue Storybook with Button stories

**Files:**
- Create: `packages/vue/.storybook/main.ts`
- Create: `packages/vue/.storybook/preview.ts`
- Create: `packages/vue/src/Button/Button.stories.ts`

- [ ] **Step 1: Create `packages/vue/.storybook/main.ts`**

```ts
import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {
      docgen: "vue-component-meta",
    },
  },
  addons: [],
};

export default config;
```

- [ ] **Step 2: Create `packages/vue/.storybook/preview.ts`**

```ts
import type { Preview } from "@storybook/vue3-vite";
import "@epignosis/tokens/tokens.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
```

- [ ] **Step 3: Create `packages/vue/src/Button/Button.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Button from "./Button.vue";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    disabled: { control: "boolean" },
  },
  args: { variant: "primary", size: "md", disabled: false },
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

- [ ] **Step 4: Verify Storybook dev server boots**

Run: `pnpm --filter @epignosis/vue storybook`
Expected: starts on http://localhost:6007.

In a browser, open http://localhost:6007. Navigate to `Components/Button`. Verify:
- All 5 stories appear in the sidebar.
- "Primary" shows the same blue button (`#0046AB`) as the React Storybook.
- All variants/sizes/disabled states render identically to the React side.
- Controls in the right panel update the preview.

Stop the server (Ctrl+C) before continuing.

- [ ] **Step 5: Verify static build**

Run: `pnpm --filter @epignosis/vue build-storybook`
Expected: succeeds, produces `packages/vue/storybook-static/index.html`.

- [ ] **Step 6: Commit**

```bash
git add packages/vue/.storybook packages/vue/src/Button/Button.stories.ts
git commit -m "Add Vue Storybook with Button stories"
```

---

## Task 9: Update root README and final smoke test

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite `README.md`**

Replace the entire file with:

````markdown
# epignosis-ui

Monorepo hosting the shared Epignosis UI:

| Package | What it is |
| --- | --- |
| [`@epignosis/tokens`](./packages/tokens) | Framework-agnostic design tokens (TS + CSS variables). |
| [`@epignosis/react`](./packages/react) | React 18 component library + Storybook. |
| [`@epignosis/vue`](./packages/vue) | Vue 3 component library + Storybook. |

See [`DESIGN_TOKENS.md`](./DESIGN_TOKENS.md) for the full token reference.

## Requirements

- Node ≥ 20
- pnpm ≥ 9 (`corepack enable && corepack prepare pnpm@latest --activate` if missing)

## Install

```bash
pnpm install
```

## Build the component packages

```bash
pnpm build
```

Builds `@epignosis/react` and `@epignosis/vue`. Tokens has no build step (ships raw source).

## Run Storybook

```bash
pnpm storybook:react       # React Storybook on http://localhost:6006
pnpm storybook:vue         # Vue Storybook on http://localhost:6007
pnpm storybook:all         # Both, in parallel
pnpm build-storybook       # Static builds for both, output to packages/*/storybook-static/
```

## Layout

```
epignosis-ui/
├── packages/
│   ├── tokens/             @epignosis/tokens (raw TS source, no build)
│   ├── react/              @epignosis/react (Vite library build, Storybook on :6006)
│   └── vue/                @epignosis/vue (Vite library build, Storybook on :6007)
├── DESIGN_TOKENS.md        token reference
├── docs/superpowers/       design specs and implementation plans
├── pnpm-workspace.yaml
└── tsconfig.base.json      shared TS settings
```

## Consumer usage

### React

```ts
import { Button } from "@epignosis/react";
import "@epignosis/tokens/tokens.css";
import "@epignosis/react/styles.css";
```

### Vue

```ts
import { Button } from "@epignosis/vue";
import "@epignosis/tokens/tokens.css";
import "@epignosis/vue/styles.css";
```
````

- [ ] **Step 2: Run the full smoke test**

```bash
pnpm install
pnpm build
```

Expected: install completes, then both `@epignosis/react` and `@epignosis/vue` build cleanly. `dist/` exists in both with `index.js`, `index.cjs`, `index.d.ts`, `styles.css`.

- [ ] **Step 3: Run both Storybooks together**

Run: `pnpm storybook:all`
Expected: both Storybooks boot. React on :6006, Vue on :6007. No port conflicts.

Open both URLs in a browser, navigate to `Components/Button` in each, and visually confirm:
- Primary buttons in both Storybooks render the same blue (`#0046AB`).
- Secondary buttons in both render the same light-grey.
- Sizes match.
- Disabled state matches.

Stop with Ctrl+C.

- [ ] **Step 4: Run static Storybook build**

Run: `pnpm build-storybook`
Expected: succeeds. Both `packages/react/storybook-static/` and `packages/vue/storybook-static/` exist with `index.html`.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "Update README for monorepo layout"
```

- [ ] **Step 6: Final verification — clean tree**

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

```bash
git log --oneline
```

Expected: see commits for each task on top of the spec commit and `initial commit`.

---

## Done

The monorepo is now in place with:
- `@epignosis/tokens` — relocated, with new `tokens.css`
- `@epignosis/react` — sample Button + Storybook on :6006
- `@epignosis/vue` — sample Button + Storybook on :6007
- Root scripts that fan out to per-package builds and Storybooks

Out-of-scope follow-ups (from the spec): tests, CI/lint/Prettier, publishing flow, Storybook composition, codegen for `tokens.css`.
