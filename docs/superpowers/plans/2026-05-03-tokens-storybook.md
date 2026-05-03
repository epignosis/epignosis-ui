# Tokens Package Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up an HTML-based Storybook in `@epignosis-ui/tokens` that visually showcases every token category by iterating the existing `tokens.ts` exports.

**Architecture:** Standalone Storybook inside `packages/tokens/` using `@storybook/html-vite`. Stories return HTML strings — no React, no JSX. `preview.ts` imports `tokens.css` so demos that use `var(--…)` resolve correctly. Each story file iterates the corresponding `tokens.ts` export so the showcase auto-updates when tokens change.

**Tech Stack:** Storybook 10, `@storybook/html-vite`, Vite 8, TypeScript 6, pnpm workspaces.

**Reference spec:** `docs/superpowers/specs/2026-05-03-tokens-storybook-design.md`

---

## File Structure

| File | Created by | Purpose |
|---|---|---|
| `packages/tokens/package.json` | Task 1 (modify) | Add `storybook` / `build-storybook` scripts + Storybook devDeps |
| `packages/tokens/.storybook/main.ts` | Task 1 | Storybook config (html-vite framework, story glob) |
| `packages/tokens/.storybook/preview.ts` | Task 1 | Imports `tokens.css` so CSS vars resolve |
| `packages/tokens/.storybook/preview-head.html` | Task 1 | Mulish font link (Google Fonts) |
| `packages/tokens/src/stories/Colors.stories.ts` | Task 1 | Base + 5 palette swatch grids |
| `packages/tokens/src/stories/Typography.stories.ts` | Task 2 | Font family / scale / weights specimens |
| `packages/tokens/src/stories/Spacing.stories.ts` | Task 2 | Labeled scale bars |
| `packages/tokens/src/stories/BorderRadius.stories.ts` | Task 2 | Labeled radius boxes |
| `packages/tokens/src/stories/Shadows.stories.ts` | Task 2 | Labeled shadow boxes |
| `packages/tokens/src/stories/Transitions.stories.ts` | Task 2 | Hover-to-demo transition boxes |
| `packages/tokens/src/stories/Breakpoints.stories.ts` | Task 3 | Reference table |
| `packages/tokens/src/stories/ZIndex.stories.ts` | Task 3 | Reference table |

The plan groups work into 3 tasks: **(1)** tooling + the canonical first story (Colors) to validate the whole pipeline, **(2)** the remaining visual stories, **(3)** the two reference-table stories.

---

## Task 1: Tooling + Colors story

**Files:**
- Modify: `packages/tokens/package.json` (add scripts + devDeps)
- Create: `packages/tokens/.storybook/main.ts`
- Create: `packages/tokens/.storybook/preview.ts`
- Create: `packages/tokens/.storybook/preview-head.html`
- Create: `packages/tokens/src/stories/Colors.stories.ts`

- [ ] **Step 1: Add scripts and devDeps to `packages/tokens/package.json`**

The existing `package.json` has no `scripts` and no `devDependencies` blocks. Add both. Final shape (preserve existing fields exactly, just add the two new blocks at the end):

```json
{
  "name": "@epignosis-ui/tokens",
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
  "sideEffects": ["**/*.css"],
  "scripts": {
    "storybook": "storybook dev -p 6007",
    "build-storybook": "storybook build"
  },
  "devDependencies": {
    "@storybook/html-vite": "^10.2.0",
    "@types/node": "^20.0.0",
    "storybook": "^10.2.0",
    "typescript": "^6.0.0",
    "vite": "^8.0.0"
  }
}
```

Port `6007` is intentional — `@epignosis-ui/react` uses `6006` (see `packages/react/package.json:21`). The two Storybooks need different ports to run concurrently.

- [ ] **Step 2: Install the new devDeps**

Run from the repo root:

```bash
pnpm install
```

Expected: command exits 0. `pnpm-lock.yaml` is updated. The Storybook 10 packages and Vite 8 should already be cached from the `@epignosis-ui/react` install — pnpm will just symlink.

If pnpm complains about peer-dependency mismatches between `@storybook/html-vite` and `vite`, accept the warning and continue. If it errors, report BLOCKED with the message.

- [ ] **Step 3: Create `packages/tokens/.storybook/main.ts`**

```ts
import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.ts"],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  addons: [],
};

export default config;
```

- [ ] **Step 4: Create `packages/tokens/.storybook/preview.ts`**

```ts
import "../src/theme/tokens.css";
```

That single import makes every CSS variable from `tokens.css` available in every story (so you can use `var(--font-family-body)`, `var(--transition-fast)`, etc. inline).

- [ ] **Step 5: Create `packages/tokens/.storybook/preview-head.html`**

```html
<!-- Loads Mulish from Google Fonts so typography specimens render in the brand font.
     Falls back to Arial when offline. -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 6: Create `packages/tokens/src/stories/Colors.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { colorBase, colors } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Colors",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const swatch = (label: string, value: string): string => `
  <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start;">
    <div style="width:96px;height:96px;border-radius:6px;background:${value};border:1px solid #e5e5e5;"></div>
    <div style="font-family:Mulish,Arial,sans-serif;font-size:14px;font-weight:600;">${label}</div>
    <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">${value}</code>
  </div>
`;

const grid = (children: string): string => `
  <div style="display:flex;flex-wrap:wrap;gap:24px;padding:24px;font-family:Mulish,Arial,sans-serif;">
    ${children}
  </div>
`;

const palette = (name: "primary" | "secondary" | "green" | "orange" | "red"): Story => ({
  render: () =>
    grid(
      Object.entries(colors[name])
        .map(([k, v]) => swatch(k, v))
        .join(""),
    ),
});

export const Base: Story = {
  render: () =>
    grid(
      Object.entries(colorBase)
        .map(([k, v]) => swatch(k, v))
        .join(""),
    ),
};

export const Primary: Story = palette("primary");
export const Secondary: Story = palette("secondary");
export const Green: Story = palette("green");
export const Orange: Story = palette("orange");
export const Red: Story = palette("red");
```

Note on scope: only the five palette objects (`primary` … `red`) get their own story. The flat single-value entries `colors.black`, `colors.white`, `colors.blue` are already covered by the `Base` story (which iterates `colorBase`), so no separate stories for them.

- [ ] **Step 7: Verify Storybook builds**

Run from the repo root:

```bash
pnpm --filter @epignosis-ui/tokens build-storybook
```

Expected: command exits 0. A `storybook-static/` directory is produced under `packages/tokens/`. No "no stories found" error (the Colors stories are present).

If it fails:
- Type errors in `Colors.stories.ts` → fix per the error message.
- "Cannot find module '@storybook/html-vite'" → re-run `pnpm install`.
- Port conflict during build → not applicable, `build-storybook` doesn't bind a port.

The `storybook-static/` output is gitignored (`.gitignore` line 3) — don't commit it.

- [ ] **Step 8: Commit**

Stage only the new/modified files (NOT `storybook-static/`, NOT anything else). Verify with `git status` first:

```bash
git status
```

Expected: 5 new files (4 in `.storybook/` and `Colors.stories.ts`) and 2 modified (`packages/tokens/package.json`, `pnpm-lock.yaml`). If anything else appears, STOP and report.

Then:

```bash
git add packages/tokens/.storybook \
        packages/tokens/src/stories/Colors.stories.ts \
        packages/tokens/package.json \
        pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
Add tokens-package Storybook with Colors story

Standalone @storybook/html-vite Storybook in @epignosis-ui/tokens.
Includes the Storybook config, preview wiring (loads tokens.css and
Mulish font), and the Colors story (Base + five palette grids).

Spec: docs/superpowers/specs/2026-05-03-tokens-storybook-design.md
EOF
)"
```

---

## Task 2: Visual stories (Typography, Spacing, BorderRadius, Shadows, Transitions)

**Files:**
- Create: `packages/tokens/src/stories/Typography.stories.ts`
- Create: `packages/tokens/src/stories/Spacing.stories.ts`
- Create: `packages/tokens/src/stories/BorderRadius.stories.ts`
- Create: `packages/tokens/src/stories/Shadows.stories.ts`
- Create: `packages/tokens/src/stories/Transitions.stories.ts`

- [ ] **Step 1: Create `packages/tokens/src/stories/Typography.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { typography } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Typography",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const wrap = (children: string): string => `
  <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
    ${children}
  </div>
`;

const remToPx = (value: string): string => {
  const n = parseFloat(value);
  if (isNaN(n) || !value.endsWith("rem")) return "";
  return `${n * 16}px`;
};

export const FontFamily: Story = {
  render: () =>
    wrap(`
      <p style="font-family:var(--font-family-body);font-size:1rem;line-height:1.5;">
        The quick brown fox jumps over the lazy dog.
      </p>
      <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
        body: ${typography.fontFamily.body}
      </code>
    `),
};

export const Scale: Story = {
  render: () =>
    wrap(
      Object.entries(typography.fontSize)
        .map(
          ([k, v]) => `
            <div style="margin-bottom:20px;">
              <p style="font-family:var(--font-family-body);font-size:${v};line-height:1.3;margin:0 0 4px;">
                The quick brown fox jumps over the lazy dog.
              </p>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
                ${k} — ${v} (${remToPx(v)})
              </code>
            </div>
          `,
        )
        .join(""),
    ),
};

export const Weights: Story = {
  render: () =>
    wrap(
      Object.entries(typography.fontWeight)
        .map(
          ([k, v]) => `
            <div style="margin-bottom:20px;">
              <p style="font-family:var(--font-family-body);font-size:1.125rem;font-weight:${v};margin:0 0 4px;">
                The quick brown fox jumps over the lazy dog.
              </p>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
                ${k} — ${v}
              </code>
            </div>
          `,
        )
        .join(""),
    ),
};
```

- [ ] **Step 2: Create `packages/tokens/src/stories/Spacing.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { colors, spacing } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Spacing",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const remToPx = (value: string): string => {
  const n = parseFloat(value);
  if (isNaN(n) || !value.endsWith("rem")) return "";
  return `${n * 16}px`;
};

export const Scale: Story = {
  render: () => `
    <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      ${Object.entries(spacing)
        .map(
          ([k, v]) => `
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;width:200px;">
                ${k} — ${v}${remToPx(v) ? ` (${remToPx(v)})` : ""}
              </code>
              <div style="width:${v};height:16px;background:${colors.primary.light};"></div>
            </div>
          `,
        )
        .join("")}
    </div>
  `,
};
```

- [ ] **Step 3: Create `packages/tokens/src/stories/BorderRadius.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { borderRadius, colors } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/BorderRadius",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => `
    <div style="display:flex;flex-wrap:wrap;gap:24px;padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      ${Object.entries(borderRadius)
        .map(
          ([k, v]) => `
            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start;">
              <div style="width:96px;height:96px;background:${colors.primary.light};border-radius:${v};"></div>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
                ${k} — ${v}
              </code>
            </div>
          `,
        )
        .join("")}
    </div>
  `,
};
```

- [ ] **Step 4: Create `packages/tokens/src/stories/Shadows.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { shadows } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Shadows",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const All: Story = {
  render: () => `
    <div style="display:flex;flex-wrap:wrap;gap:32px;padding:32px;font-family:Mulish,Arial,sans-serif;color:#222;background:#FAFAFA;">
      ${Object.entries(shadows)
        .map(
          ([k, v]) => `
            <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
              <div style="width:120px;height:80px;background:#FFFFFF;border-radius:6px;box-shadow:${v};"></div>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;max-width:240px;word-break:break-word;">
                <strong>${k}</strong> — ${v}
              </code>
            </div>
          `,
        )
        .join("")}
    </div>
  `,
};
```

- [ ] **Step 5: Create `packages/tokens/src/stories/Transitions.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { colors, transitions } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Transitions",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const All: Story = {
  render: () => `
    <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      <p style="margin:0 0 24px;font-size:14px;color:#555;">
        Hover any box to demo its transition.
      </p>
      <style>
        .eg-transition-demo {
          width: 80px;
          height: 80px;
          background: ${colors.primary.light};
          border-radius: 6px;
          transform: translateX(0);
        }
        .eg-transition-demo:hover {
          transform: translateX(120px);
          background: ${colors.primary.dark};
        }
      </style>
      <div style="display:flex;flex-direction:column;gap:24px;">
        ${Object.entries(transitions)
          .map(
            ([k, v]) => `
              <div style="display:flex;align-items:center;gap:24px;">
                <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;width:220px;">
                  <strong>${k}</strong> — ${v}
                </code>
                <div class="eg-transition-demo" style="transition:transform ${v}, background ${v};"></div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `,
};
```

- [ ] **Step 6: Verify all stories build**

Run:

```bash
pnpm --filter @epignosis-ui/tokens build-storybook
```

Expected: exits 0. Five new stories appear in the build output.

- [ ] **Step 7: Commit**

```bash
git status
```

Expected: 5 new files under `packages/tokens/src/stories/`. Nothing else.

```bash
git add packages/tokens/src/stories/Typography.stories.ts \
        packages/tokens/src/stories/Spacing.stories.ts \
        packages/tokens/src/stories/BorderRadius.stories.ts \
        packages/tokens/src/stories/Shadows.stories.ts \
        packages/tokens/src/stories/Transitions.stories.ts
git commit -m "$(cat <<'EOF'
Add Typography, Spacing, BorderRadius, Shadows, Transitions stories

Five visual token stories under Tokens/* in the @epignosis-ui/tokens
Storybook. Each iterates the corresponding tokens.ts export so the
showcase auto-updates when tokens change.

Spec: docs/superpowers/specs/2026-05-03-tokens-storybook-design.md
EOF
)"
```

---

## Task 3: Reference table stories (Breakpoints, ZIndex)

**Files:**
- Create: `packages/tokens/src/stories/Breakpoints.stories.ts`
- Create: `packages/tokens/src/stories/ZIndex.stories.ts`

- [ ] **Step 1: Create `packages/tokens/src/stories/Breakpoints.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { breakpoints, mediaQueries } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Breakpoints",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Reference: Story = {
  render: () => `
    <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      <table style="border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="text-align:left;border-bottom:2px solid #ddd;">
            <th style="padding:8px 16px;">Key</th>
            <th style="padding:8px 16px;">Width (px)</th>
            <th style="padding:8px 16px;">Media query</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(breakpoints)
            .map(
              ([k, px]) => `
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:8px 16px;font-weight:600;">${k}</td>
                  <td style="padding:8px 16px;">${px}</td>
                  <td style="padding:8px 16px;font-family:ui-monospace,monospace;font-size:12px;color:#555;">
                    ${mediaQueries[k as keyof typeof mediaQueries]}
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `,
};
```

- [ ] **Step 2: Create `packages/tokens/src/stories/ZIndex.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/html-vite";
import { zIndex } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/ZIndex",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Reference: Story = {
  render: () => `
    <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      <table style="border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="text-align:left;border-bottom:2px solid #ddd;">
            <th style="padding:8px 16px;">Key</th>
            <th style="padding:8px 16px;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(zIndex)
            .map(
              ([k, v]) => `
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:8px 16px;font-weight:600;">${k}</td>
                  <td style="padding:8px 16px;font-family:ui-monospace,monospace;">${v}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `,
};
```

- [ ] **Step 3: Verify all stories build**

Run:

```bash
pnpm --filter @epignosis-ui/tokens build-storybook
```

Expected: exits 0. All eight Tokens/* stories present in the build output (Colors + Typography + Spacing + BorderRadius + Shadows + Transitions + Breakpoints + ZIndex).

- [ ] **Step 4: Commit**

```bash
git status
```

Expected: 2 new files. Nothing else.

```bash
git add packages/tokens/src/stories/Breakpoints.stories.ts \
        packages/tokens/src/stories/ZIndex.stories.ts
git commit -m "$(cat <<'EOF'
Add Breakpoints and ZIndex reference stories

Two table-format stories completing the @epignosis-ui/tokens Storybook.
Breakpoints joins breakpoints + mediaQueries into a single table; ZIndex
shows the named layer values.

Spec: docs/superpowers/specs/2026-05-03-tokens-storybook-design.md
EOF
)"
```

---

## Done criteria

- [ ] `pnpm --filter @epignosis-ui/tokens build-storybook` exits 0 with all 8 categories present.
- [ ] `pnpm --filter @epignosis-ui/tokens storybook` opens on `http://localhost:6007` (no port conflict with React's 6006).
- [ ] Sidebar shows a `Tokens` group containing: Colors (with Base + 5 palette stories), Typography (3 stories), Spacing, BorderRadius, Shadows, Transitions, Breakpoints, ZIndex.
- [ ] Three commits on top of the spec commit, scoped exactly as described.
