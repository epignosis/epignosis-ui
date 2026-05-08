# epignosis-ui

Monorepo hosting the shared Epignosis UI:

| Package | What it is |
| --- | --- |
| [`@epignosis_llc/ui-tokens`](./packages/tokens) | Framework-agnostic design tokens (TS + CSS variables). |
| [`@epignosis_llc/ui-icons`](./packages/icons) | 631 SVG icons as tree-shakable React components. |
| [`@epignosis_llc/ui-react`](./packages/react) | React 19 component library + Storybook. |
| [`@epignosis_llc/ui-vue`](./packages/vue) | Vue 3 component library + Storybook. |

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

Builds tokens, icons, react, and vue in topological order.

## Run Storybook

```bash
pnpm storybook:tokens      # Tokens reference on http://localhost:6007
pnpm storybook:icons       # Icon catalog on http://localhost:6008
pnpm storybook:react       # React components on http://localhost:6006
pnpm storybook:vue         # Vue components on http://localhost:6007
pnpm storybook:all         # All four in parallel
pnpm build-storybook       # Static builds for all, output to packages/*/storybook-static/
```

The icons Storybook lets you search the full set, preview at any size, and click an icon to copy its named import.

## Layout

```
epignosis-ui/
├── packages/
│   ├── tokens/             @epignosis_llc/ui-tokens (tsup build, Storybook on :6007)
│   ├── icons/              @epignosis_llc/ui-icons (Vite + svgr, Storybook on :6008)
│   ├── react/              @epignosis_llc/ui-react (Vite library build, Storybook on :6006)
│   └── vue/                @epignosis_llc/ui-vue (Vite library build, Storybook on :6007)
├── DESIGN_TOKENS.md        token reference
├── docs/superpowers/       design specs and implementation plans
├── pnpm-workspace.yaml
└── tsconfig.base.json      shared TS settings
```

## Consumer usage

### React

```ts
import { Button } from "@epignosis_llc/ui-react";
import "@epignosis_llc/ui-tokens/tokens.css";
import "@epignosis_llc/ui-react/styles.css";
```

### Vue

```ts
import { Button } from "@epignosis_llc/ui-vue";
import "@epignosis_llc/ui-tokens/tokens.css";
import "@epignosis_llc/ui-vue/styles.css";
```

### Icons

```tsx
import { CalendarSVG, CloseCircledSVG } from "@epignosis_llc/ui-icons";

<CalendarSVG height={24} />;
```

Icons render with `currentColor`, so set the parent's `color` to recolor.

## Releases

This monorepo uses [Changesets](https://github.com/changesets/changesets) and a GitHub Actions workflow to publish `@epignosis_llc/ui-tokens`, `@epignosis_llc/ui-icons`, `@epignosis_llc/ui-react`, and `@epignosis_llc/ui-vue` to npm.

### Author workflow

1. Make code changes.
2. Run `pnpm changeset` and follow the prompts (which packages, bump type, summary).
3. Commit the generated `.changeset/*.md` alongside your code change.
4. Open a PR. CI runs install + build.
5. After merging to `main`, the release workflow opens (or updates) a "chore: version packages" PR that consumes pending changesets and bumps versions.
6. Merging that PR triggers `pnpm release`, which publishes to npm.

### Auto-changeset

If you push to `main` without a changeset, the release workflow auto-generates a **patch** changeset for any changed `packages/*` directories using the commit subject as the summary. Manually run `pnpm changeset` only when you want a `minor` or `major` bump.

### Authentication (OIDC Trusted Publishing)

CI publishes via GitHub OIDC — no `NPM_TOKEN` secret is used. Each publishable package has a Trusted Publisher entry on npmjs.com pointing at this repo's `release.yml`. The workflow needs `id-token: write` permission (already set) and npm CLI ≥ 11.5.1 (the workflow upgrades npm before publishing).

When adding a new package, the *first* publish has to happen locally (Trusted Publisher can only be configured for an existing package). After the first version is on npm, register the Trusted Publisher and let CI handle subsequent releases.
