# CLAUDE.md

Instructions for Claude when working in this repo. Keep edits aligned with these — don't re-derive conventions from scratch.

## When creating or porting a component

### 1. Tokens — JS, not CSS vars

Always import design values from `@epignosis_llc/ui-tokens`:

```ts
import { colors, typography, borderRadius, spacing, transitions } from "@epignosis_llc/ui-tokens";
```

Never use `var(--token-name)` in component styles. Tokens.css is for consumers who want CSS-variable access at runtime; components themselves must not depend on it being loaded.

If a value gnosis uses (e.g. `typeScale.4xl`) has no equivalent in our tokens, fall back to the literal rem value with a comment explaining why. Don't substitute the closest token if it visually drifts.

### 2. Externalize the tokens package in builds

The vite configs (`packages/react/vite.config.ts`, `packages/vue/vite.config.ts`) externalize `@epignosis_llc/ui-tokens` via a regex. Don't bundle it.

### 3. Class names — BEM with `eg-` prefix

Pattern: `eg-<component>` block, `eg-<component>--<modifier>` for variants/states, `eg-<component>__<element>` for parts.

Examples:

- Button: `eg-button`, `eg-button--solid`, `eg-button--disabled`, `eg-button__text`, `eg-button__icon`
- Avatar: `eg-avatar`, `eg-avatar--sm`, `eg-avatar__image`, `eg-avatar__fallback`

Compose with `clsx`. Always allow consumer `className` to merge in last.

### 4. Stories

Use Storybook 10 + react-vite types. Follow the Button stories pattern:

```ts
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/<Name>",
  component: <Name>,
  argTypes: { /* controls */ },
  args: { /* defaults */ },
} satisfies Meta<typeof <Name>>;

export default meta;
type Story = StoryObj<<Name>Props>;

export const Default: Story = { args: { /* ... */ } };
```

Cover at minimum: the default render, each meaningful variant/mode, edge cases (loading, disabled, with/without children).

### 5. After writing

- Run `pnpm --filter @epignosis_llc/ui-react build` (or vue) — typecheck + bundle must pass.
- For a new component, check `packages/react/dist/<Name>/` exists with `.d.ts` files.
- Confirm runtime export: `node -e "console.log(require('./packages/react/dist/index.cjs').<Name>)"`
- Don't start Storybook in subagent contexts (it doesn't exit cleanly).

## Storybook

Each package has its own Storybook. A composition hub at `packages/hub` surfaces them all under one UI.

### Dev (all at once)

```bash
pnpm storybook:all   # starts react(6006) vue(6007) icons(6008) tokens(6009) hub(6010)
```

Open the hub at <http://localhost:6010>. Each package's stories appear in the left sidebar under its own section.

### Dev (hub only, sub-Storybooks already running)

```bash
pnpm storybook:hub
```

### Static build for deployment

```bash
STORYBOOK_STATIC=true pnpm build-storybook:hub
```

Outputs a self-contained directory at `packages/hub/storybook-static/` with each package's static bundle assembled into subdirectories (`react/`, `vue/`, `icons/`, `tokens/`). Serve the directory from any static host.

## Releases & changesets

- **New component or new public API** → minor bump. Run `pnpm changeset`, select the package, pick `minor`. Commit the `.changeset/*.md` alongside the code.
- **Bugfix or internal refactor** → patch bump. Either run `pnpm changeset` and pick `patch`, or just commit and push — the release workflow auto-generates a patch changeset when none is present.
- **Breaking change** → major bump. Manual `pnpm changeset`, pick `major`.
- Don't push code changes without thinking about which bump type they warrant.

## Commit hygiene

Each commit should have a single focused purpose. Stage files explicitly (`git add <paths>`); never `git add -A` or `git add .`. If `git status` shows untracked files unrelated to the task, leave them out of the commit.

## What to avoid

- CSS variables inside component styles. (See §3.)
- Bundling `@epignosis_llc/ui-tokens` into ui-react/ui-vue output. (See §4.)
- Adding `prepublishOnly` to publishable packages — the release workflow already builds. (Reintroducing it caused publish-time failures.)
- Element selectors (`img`, `span`) inside component styles when a BEM class would be clearer.
- Boolean prop flags that should be a discriminated union.
- Silently dropping gnosis features during a port. If you intentionally simplify, note it in the commit message.
