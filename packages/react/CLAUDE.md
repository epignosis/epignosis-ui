# packages/react — Claude notes

For monorepo-wide rules (changesets, commit hygiene) see the root `CLAUDE.md`.

## Creating or porting a component

### Tokens — JS imports, not CSS variables

Import design values from `@epignosis_llc/ui-tokens`:

```ts
import { colors, typography, borderRadius, spacing, transitions } from "@epignosis_llc/ui-tokens";
```

Never use `var(--token-name)` inside component styles. `tokens.css` is for consumers; components must not depend on it being loaded.

If a gnosis value (e.g. `typeScale.4xl`) has no equivalent in our tokens, fall back to the literal rem value with a comment explaining why. Don't substitute the nearest token if it visually drifts.

`@epignosis_llc/ui-tokens` is externalized in `vite.config.ts` — don't bundle it.

### Class names — BEM with `eg-` prefix

Pattern: `eg-<component>` block, `eg-<component>--<modifier>` for variants/states, `eg-<component>__<element>` for parts.

```
eg-button            (block)
eg-button--solid     (modifier)
eg-button--disabled  (modifier)
eg-button__text      (element)
eg-button__icon      (element)
```

Compose with `clsx`. Always let consumer `className` merge in last.

### Stories

Storybook 10 + `@storybook/react-vite`. Follow the Button stories pattern:

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

### After writing a component

- Run `pnpm --filter @epignosis_llc/ui-react build` — typecheck + bundle must pass.
- For a new component, check `dist/<Name>/` exists with `.d.ts` files.
- Confirm runtime export: `node -e "console.log(require('./packages/react/dist/index.cjs').<Name>)"`
- Don't start Storybook in subagent contexts (it doesn't exit cleanly).

### What to avoid

- CSS variables inside component styles.
- Bundling `@epignosis_llc/ui-tokens` into output.
- Adding `prepublishOnly` — the release workflow already builds.
- Element selectors (`img`, `span`) in styles when a BEM class would be clearer.
- Boolean prop flags that should be a discriminated union.
- Silently dropping gnosis features during a port — note intentional simplifications in the commit message.

---

## Unit tests

### Stack

- **Vitest** with `globals: true` — `describe`, `it`, `expect` are available without imports. `vi` must be imported explicitly: `import { vi } from "vitest"`.
- **jsdom** environment.
- **@testing-library/react** + **@testing-library/user-event** for rendering and interaction.
- **@testing-library/jest-dom** matchers (`toBeInTheDocument`, `toBeDisabled`, `toHaveClass`, …).
- **@faker-js/faker** for random test data.

### File location

Place test files next to the component: `src/<Component>/<Component>.test.tsx`.

Vitest picks up `src/**/*.test.{ts,tsx}` automatically.

### Custom render

Always import `render` and `screen` from `../../test-utils/render`, not from `@testing-library/react` directly. The custom render wraps every tree in `ThemeProvider` — components use Emotion's `useTheme()` and will throw without it.

```tsx
import { render, screen } from "../../test-utils/render";
```

### Import order in test files

Third-party packages first, then workspace packages (`@epignosis_llc/*`), then local paths (`../../test-utils/render`, then `./Component`).

```tsx
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import { SomeSVG } from "@epignosis_llc/ui-icons";
import { render, screen } from "../../test-utils/render";
import MyComponent from "./MyComponent";
```

### Mocking

Use `vi.fn()` (not `jest.fn()`). No global mocking — real workspace packages resolve from their built `dist/`; CI builds `ui-tokens` and `ui-icons` before running tests.

For icons: real SVG components from `@epignosis_llc/ui-icons` work fine for presence/attribute assertions. When you need to assert on className merging or custom props, use a local inline stub:

```tsx
const MockSvgIcon = (props: SVGProps<SVGSVGElement>) => <svg {...props} />;
```

### What to cover

Mirror gnosis's test suite for the same component and only deviate where our implementation differs (class names, prop names, missing features). Minimum per component:

- Default render + basic content assertion
- Callback props (`onClick`, `onChange`, …) fire via `userEvent`
- Disabled / loading / locked states block interaction
- BEM class names applied for key variants (`container.querySelector(".eg-<component>__<element>")`)
- Snapshot for default render + snapshot with all significant props

### Class names in assertions

Use `eg-` prefixed BEM names, not gnosis names:

```tsx
container.querySelector(".eg-button__spinner")  // correct
container.querySelector(".egt-button__spinner") // wrong — gnosis prefix
```

### Running tests

```sh
pnpm test        # watch mode (local dev)
pnpm test:run    # single run (CI / pre-push)
```
