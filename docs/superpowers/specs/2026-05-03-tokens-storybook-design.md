# Tokens Package Storybook

**Date:** 2026-05-03
**Status:** Design approved, pending implementation
**Scope:** `packages/tokens/`

## Goal

Add a standalone Storybook to the `@epignosis-ui/tokens` package that visually showcases every token category (colors, typography, spacing, border radii, shadows, transitions, breakpoints, z-index). Stories iterate the existing `tokens.ts` exports so the showcase stays in sync as tokens evolve.

## Non-goals

- Reusing the React package's Storybook. The user explicitly chose a separate Storybook so the tokens package has its own, independent of any framework.
- Adding React or any framework runtime to the tokens package. Stories use the `@storybook/html-vite` framework — HTML strings, no JSX.
- Modifying the tokens package's public API. No new exports, no build step changes (it still ships raw `.ts` and `.css`).
- MDX docs pages. Plain HTML stories are simpler and sufficient.
- A shared `_helpers.ts` module. Each story file does its own simple HTML rendering. Refactor only if duplication appears.
- Visual regression / snapshot tests.

## Architecture

- New standalone Storybook lives inside `packages/tokens/`.
- Framework: `@storybook/html-vite`.
- Stories return HTML strings.
- All values pulled live from existing `tokens.ts` exports — adding a new color shade or spacing key appears in the showcase automatically.
- `preview.ts` imports `../src/theme/tokens.css` so demos that use `var(--…)` resolve correctly.
- `preview-head.html` includes a Google Fonts link for `Mulish` so typography specimens render in the brand font (offline ⇒ Arial fallback, no error).
- Storybook runs on port `6007` (React's is `6006`) so both can run concurrently.

## File structure

11 new files, 1 modified.

| File                                                  | Purpose                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------- |
| `packages/tokens/.storybook/main.ts`                  | Storybook config (html-vite framework, story glob `../src/**/*.stories.ts`) |
| `packages/tokens/.storybook/preview.ts`               | Imports `../src/theme/tokens.css`                                           |
| `packages/tokens/.storybook/preview-head.html`        | `<link>` to Google Fonts Mulish                                             |
| `packages/tokens/src/stories/Colors.stories.ts`       | Per-palette swatch grids                                                    |
| `packages/tokens/src/stories/Typography.stories.ts`   | Font family / scale / weight specimens                                      |
| `packages/tokens/src/stories/Spacing.stories.ts`      | Labeled scale bars                                                          |
| `packages/tokens/src/stories/BorderRadius.stories.ts` | Labeled boxes                                                               |
| `packages/tokens/src/stories/Shadows.stories.ts`      | Labeled shadow boxes                                                        |
| `packages/tokens/src/stories/Transitions.stories.ts`  | Hover-to-demo boxes                                                         |
| `packages/tokens/src/stories/Breakpoints.stories.ts`  | Reference table (breakpoints + mediaQueries)                                |
| `packages/tokens/src/stories/ZIndex.stories.ts`       | Reference table                                                             |
| `packages/tokens/package.json` _(modified)_           | Add `storybook` / `build-storybook` scripts + devDeps                       |

## Per-story rendering

Each story file exports a `Meta` (default) plus one or more named `StoryObj` exports. `meta.title` uses the prefix `Tokens/<Category>` so they collapse under a single sidebar group. Render functions return HTML strings.

### Colors.stories.ts

- Iterates `Object.entries(colors)` to generate one named story per palette family (`Primary`, `Secondary`, `Green`, `Orange`, `Red`, `Black`, `White`, `Blue`).
- Each story renders a row of swatches — one per shade key in that palette (`lightest25`, `lightest50`, `lightest`, `lighter`, `light`, `base`, `dark`, `darker50`, `darker`, `darkest`).
- Each swatch: a 96×96 colored box, shade name beneath, hex/rgba value below that.
- Plus a top-level `Base` story rendering the 8 `colorBase` values as flat swatches.

### Typography.stories.ts

Three named stories.

- `FontFamily`: a paragraph rendered in `typography.fontFamily.body`, plus the resolved string label.
- `Scale`: one row per `fontSize` key. Sample sentence at that size; label shows `key + rem + computed px`.
- `Weights`: one row per `fontWeight` key. Sample sentence at that weight; label shows `key + numeric value`.

### Spacing.stories.ts

One story `Scale`. Iterates `Object.entries(spacing)`. Each row: a horizontal bar with `width: <value>; height: 16px; background: colors.primary.light`. Label shows `key + rem + computed px`.

### BorderRadius.stories.ts

One story `Scale`. Iterates `Object.entries(borderRadius)`. Grid of 96×96 boxes (filled with `colors.primary.light`), each with one of the radius values applied. Label below shows `key + value`.

### Shadows.stories.ts

One story `All`. Iterates `Object.entries(shadows)`. Grid of 120×80 white boxes with the shadow applied. Label shows `key + the shadow value`.

### Transitions.stories.ts

One story `All`. Iterates `Object.entries(transitions)`. Grid of boxes, each demonstrating one transition value. Boxes start at `transform: translateX(0)` and on `:hover` translate to `translateX(40px)` using `transition: transform <value>`. Label shows `key + value`. Header text: "Hover any box to demo."

### Breakpoints.stories.ts

One story `Reference`. HTML `<table>` with three columns: `key | px | media query string`. Iterates `breakpoints` and joins each row with the matching value from `mediaQueries`.

### ZIndex.stories.ts

One story `Reference`. HTML `<table>` with two columns: `key | numeric value`. Iterates `Object.entries(zIndex)`. No visual stacking demo — the table is sufficient.

### `remToPx` utility

Several stories show "rem → computed px" (e.g., `1rem (16px)`). Inline a 3-line `remToPx(value)` function at the top of each file that needs it. Don't extract until 3+ files duplicate it.

## Tooling additions

In `packages/tokens/package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6007",
    "build-storybook": "storybook build"
  },
  "devDependencies": {
    "@storybook/html-vite": "^10.2.0",
    "storybook": "^10.2.0",
    "vite": "^8.0.0",
    "typescript": "^6.0.0",
    "@types/node": "^20.0.0"
  }
}
```

Versions match `@epignosis-ui/react`'s existing devDependencies for consistency. (If the locked versions differ at install time, follow the React package's resolved versions.)

## Verification

- `pnpm --filter @epignosis-ui/tokens build-storybook` exits 0 (means stories compile cleanly).
- `pnpm --filter @epignosis-ui/tokens storybook` opens on `http://localhost:6007`. All 8 categories present in the sidebar under a `Tokens` group. Each story renders as described.
- Run `pnpm --filter @epignosis-ui/react storybook` simultaneously to confirm no port conflict (6006 vs 6007).

## Risks

- **Mulish font not loading** when offline → typography stories fall back to Arial. Acceptable, but flag in a comment in `preview-head.html`.
- **Storybook 10 + html-vite version drift** vs the React package's `@storybook/react-vite`. Keep both at the same major.minor.
- **`@types/node`** is added because Storybook config files reference Node types (`process.cwd`, etc.). Minor footprint.
- **`vite` in devDependencies** — `@storybook/html-vite` declares it as a peer dep. Listing it explicitly avoids version mismatch warnings.
