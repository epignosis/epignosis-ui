# packages/react — Claude notes

See the root `CLAUDE.md` for monorepo-wide conventions (tokens, BEM, stories, changesets).

## Unit tests

### Stack

- **Vitest** with `globals: true` — `describe`, `it`, `expect`, `vi` are available without imports (except `vi`, which must be imported explicitly: `import { vi } from "vitest"`).
- **jsdom** environment — DOM APIs available, no real browser.
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

Follow the `import/order` rule: third-party packages first, then workspace packages (`@epignosis_llc/*`), then local paths (`../../test-utils/render`, then `./Component`).

```tsx
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { vi } from "vitest";
import { SomeSVG } from "@epignosis_llc/ui-icons";
import { render, screen } from "../../test-utils/render";
import MyComponent from "./MyComponent";
```

### Mocking

Use `vi.fn()` (not `jest.fn()`). No global mocking — real workspace packages are resolved from their built `dist/`; the CI builds `ui-tokens` and `ui-icons` before running tests.

For icons in tests: real SVG components from `@epignosis_llc/ui-icons` work fine for presence/attribute assertions. When you need to assert on className merging or custom props, use a local inline stub instead:

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
// correct
container.querySelector(".eg-button__spinner")

// wrong — gnosis uses different prefixes
container.querySelector(".egt-button__spinner")
```

### Running tests

```sh
# watch mode (local dev)
pnpm test

# single run (CI / pre-push check)
pnpm test:run
```
