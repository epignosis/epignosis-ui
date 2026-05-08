# epignosis-ui

Monorepo hosting the shared Epignosis UI:

| Package | What it is |
| --- | --- |
| [`@epignosis_llc/ui-tokens`](./packages/tokens) | Framework-agnostic design tokens (TS + CSS variables). |
| [`@epignosis_llc/ui-react`](./packages/react) | React 18 component library + Storybook. |
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

Builds `@epignosis_llc/ui-react` and `@epignosis_llc/ui-vue`. Tokens has no build step (ships raw source).

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
│   ├── tokens/             @epignosis_llc/ui-tokens (raw TS source, no build)
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

## Releases

This monorepo uses [Changesets](https://github.com/changesets/changesets) and a GitHub Actions workflow to publish `@epignosis_llc/ui-tokens`, `@epignosis_llc/ui-react`, and `@epignosis_llc/ui-vue` to npm.

### Author workflow

1. Make code changes.
2. Run `pnpm changeset` and follow the prompts (which packages, bump type, summary).
3. Commit the generated `.changeset/*.md` alongside your code change.
4. Open a PR. CI runs install + build.
5. After merging to `main`, the release workflow opens (or updates) a "chore: version packages" PR that consumes pending changesets and bumps versions.
6. Merging that PR triggers `pnpm release`, which publishes to npm.

### One-time prerequisites (already done if you see versions on npm)

- The `@epignosis_llc` org exists on npm and has publish access for the maintainer team.
- A granular npm access token scoped to `@epignosis_llc` with publish permissions exists.
- The token is stored as the `NPM_TOKEN` repository secret in GitHub.
