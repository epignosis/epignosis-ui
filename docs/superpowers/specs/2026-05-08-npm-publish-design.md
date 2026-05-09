# Prepare epignosis-ui for npm publishing

**Status:** Approved (design)
**Date:** 2026-05-08
**Owner:** Alexander Antoniades

## Goal

Publish all three workspace packages to npm under the existing `@epignosis_llc` organization so external client apps can consume them as normal dependencies.

## Context

`epignosis-ui` is a pnpm workspace with three packages:

- `@epignosis-ui/react` — React component library (built via Vite)
- `@epignosis-ui/vue` — Vue 3 component library (built via Vite)
- `@epignosis-ui/tokens` — design tokens (currently exports raw `.ts` from `src/`, no build step)

None are published. A sibling client app cannot import them because the `@epignosis-ui` scope does not exist on npm. The existing org `@epignosis_llc` already hosts `@epignosis_llc/gnosis` (the predecessor design system). The new packages will live under the same org with `ui-` prefixed names to distinguish them from gnosis.

## Decisions

| Decision        | Choice                                                                         |
| --------------- | ------------------------------------------------------------------------------ |
| Scope of work   | All three packages (react, vue, tokens)                                        |
| npm scope       | `@epignosis_llc` (existing)                                                    |
| Package names   | `@epignosis_llc/ui-react`, `@epignosis_llc/ui-vue`, `@epignosis_llc/ui-tokens` |
| License         | MIT                                                                            |
| Release tooling | Changesets                                                                     |
| Publish runner  | GitHub Actions (no local publish)                                              |
| Tokens builder  | tsup                                                                           |
| Repository      | https://github.com/epignosis/epignosis-ui                                      |
| Initial version | `0.1.0` for all three (pre-stable per semver)                                  |

## Design

### 1. Renames and metadata

Rename every package and add the publishing metadata npm expects.

**Renames** (in each affected `packages/*/package.json`):

- `@epignosis-ui/react` → `@epignosis_llc/ui-react`
- `@epignosis-ui/vue` → `@epignosis_llc/ui-vue`
- `@epignosis-ui/tokens` → `@epignosis_llc/ui-tokens`

**Internal references that must update in lockstep:**

- `dependencies["@epignosis-ui/tokens"]` in react and vue `package.json`
- Root `package.json` script filters (`--filter @epignosis-ui/...`)
- Any `import` statements in `packages/*/src/**` that reference `@epignosis-ui/*`
- Storybook configs (`.storybook/main.ts`, vite aliases, addon configs)
- Workspace docs: `README.md`, `DESIGN_TOKENS.md`, anything under `docs/`

`pnpm-workspace.yaml` is unaffected (uses path globs).

**Metadata added to each publishable `package.json`:**

```json
{
  "license": "MIT",
  "author": "Epignosis LLC",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/epignosis/epignosis-ui.git",
    "directory": "packages/<react|vue|tokens>"
  },
  "homepage": "https://github.com/epignosis/epignosis-ui#readme",
  "bugs": { "url": "https://github.com/epignosis/epignosis-ui/issues" },
  "publishConfig": { "access": "public" },
  "keywords": ["epignosis", "design-system", "<react|vue|tokens>", "ui", "components"]
}
```

A single MIT `LICENSE` lives at the repo root (`Copyright (c) 2026 Epignosis LLC`). npm picks this up for each package's tarball.

### 2. Tokens build step

`@epignosis_llc/ui-tokens` currently points `main`/`module`/`types`/`exports` at `src/*.ts`. This works inside the workspace because Vite/Storybook compile TypeScript on the fly; it fails for npm consumers whose bundlers may not transpile `node_modules` TS.

**Add tsup as the builder.** tsup wraps esbuild, supports ESM + CJS + `.d.ts` in one config, and matches the lightweight nature of a token package.

`packages/tokens/tsup.config.ts`:

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tokens: "src/theme/tokens.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  loader: { ".css": "copy" },
});
```

`tokens.css` must end up at `dist/tokens.css`. The exact mechanism (tsup `loader`, an `onSuccess` copy, or a manual `cp` step) is finalized during implementation by trying the simplest option that produces the right output.

`packages/tokens/package.json` updates:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./tokens": {
      "types": "./dist/tokens.d.ts",
      "import": "./dist/tokens.js",
      "require": "./dist/tokens.cjs"
    },
    "./tokens.css": "./dist/tokens.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

Root workspace `build` script becomes:

```json
"build": "pnpm -r --filter @epignosis_llc/ui-tokens --filter @epignosis_llc/ui-react --filter @epignosis_llc/ui-vue run build"
```

pnpm respects workspace dep order, so tokens builds first regardless of filter order, but listing it first makes the intent explicit.

**Workspace-internal consumers of tokens.** Any current deep import like `@epignosis-ui/tokens/src/...` must be rewritten to use the package's `exports` entry points. A grep before the rename catches them.

### 3. Changesets

Install `@changesets/cli` and `@changesets/changelog-github` at the root.

`.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "epignosis/epignosis-ui" }],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- `linked: []` — packages version independently.
- `updateInternalDependencies: "patch"` — when tokens bumps, react and vue auto-bump as patches because they depend on tokens.

Root `package.json` scripts:

```json
{
  "changeset": "changeset",
  "version-packages": "changeset version",
  "release": "pnpm build && changeset publish"
}
```

**Author workflow:**

1. Make a code change.
2. `pnpm changeset` → pick affected packages, bump type, write a one-line summary.
3. Commit the generated `.changeset/*.md` alongside the code change.

**Release workflow** (handled by GitHub Actions, see §4):

1. Push to `main` with pending changesets → bot opens/updates a "Version Packages" PR.
2. Merge that PR → CI runs `changeset publish` → packages go to npm.

`workspace:*` deps are rewritten to real versions at pack time by `pnpm publish` — no manual conversion.

### 4. GitHub Actions

`.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: https://registry.npmjs.org

      - run: pnpm install --frozen-lockfile

      - run: pnpm build

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          version: pnpm version-packages
          publish: pnpm release
          commit: "chore: version packages"
          title: "chore: version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NPM_CONFIG_PROVENANCE: "true"
```

`NPM_CONFIG_PROVENANCE` + `id-token: write` produces a signed provenance attestation visible on npm.

`.github/workflows/ci.yml` (also added) runs `pnpm install --frozen-lockfile && pnpm build` on every PR so a broken build never lands on `main` and triggers a failed release.

**Manual prerequisites** (the user does these once, outside the implementation):

- Generate a granular npm access token scoped to `@epignosis_llc` with publish permissions.
- Add it to the repo as the `NPM_TOKEN` secret.
- Verify publish access to the org.

### 5. Pre-publish hardening

`.npmrc` at repo root:

```
provenance=true
```

Belt-and-suspenders for any local fallback `pnpm publish`.

Each publishable package gets:

- A short `README.md` (install command, minimal usage example, link to the main repo) — npm renders these on the package page.
- `"prepublishOnly": "pnpm build"` — guards the manual publish path.

Before the first publish, run `pnpm pack` in each package and inspect the `.tgz`:

```
tar -tzf @epignosis_llc-ui-react-0.1.0.tgz
```

The tarball must contain only `dist/`, `package.json`, `README.md`, `LICENSE`. Anything else is a `files` allowlist mistake.

### 6. Implementation order and risks

**Order:**

1. Add MIT `LICENSE` at repo root.
2. Set up tokens build (tsup + config + package.json updates — using the current `@epignosis-ui/tokens` name, since the rename happens in Step 3). Verify `pnpm --filter @epignosis-ui/tokens build` produces correct `dist/`.
3. Rename packages and update all internal references. Single coordinated change.
4. `pnpm install` to refresh the lockfile, then `pnpm build` and `pnpm storybook:all` to verify nothing broke.
5. Add publishing metadata + per-package READMEs + `prepublishOnly` scripts.
6. Install and configure Changesets.
7. Add GitHub Actions release + CI workflows.
8. Pre-flight `pnpm pack` and inspect tarballs in each package.
9. (User, manual) create `NPM_TOKEN` secret, verify org access.
10. Dry-run: create an initial changeset, run `pnpm version-packages` locally, inspect the diff. Do not publish from local — let the merged PR trigger CI.

**Risks:**

- **Rename blast radius (Step 3)** — touches every package, internal cross-references, Storybook configs, and docs. Mitigation: exhaustive grep before changes, full build + Storybook smoke test after.
- **Workspace deep imports of tokens (Step 2)** — `@epignosis-ui/tokens/src/...` style imports break once tokens publishes a built `dist/`. Mitigation: grep before the rename, rewrite to package entry points.
- **First publish is irreversible** — once `@epignosis_llc/ui-react@0.1.0` exists on npm, that name+version pair is permanently burned (unpublish only within 72h). Mitigation: tarball inspection step in §5.
- **Storybook regressions after rename** — Storybook configs sometimes hardcode package names in `optimizeDeps`, aliases, addons. Mitigation: smoke test all three Storybooks after the rename.

## Out of scope

- Migrating downstream consumers off `@epignosis-ui/*` (the client app will need a one-line dependency rename — called out, not solved here).
- Creating the npm org or token (user prerequisite).
- Documentation site, contribution guide, RFC process.
- Visual regression / component testing.
