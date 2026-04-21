# epignosis-ui

Shared Epignosis UI package — design tokens (and React components to follow). Intended to be consumed **directly from the repo** by other React apps rather than via npm.

## Install

Add it to a consuming app's `package.json` using a git URL, e.g.:

```json
{
  "dependencies": {
    "epignosis-ui": "github:epignosis/epignosis-ui"
  }
}
```

Or via npm CLI:

```bash
npm install epignosis/epignosis-ui
```

Because the package exports source files directly (TypeScript + CSS), the consuming app's bundler (Vite, Webpack, Rollup, esbuild, etc.) compiles them. No build step is required in this repo.

## Usage

### Design tokens (JS/TS)

```ts
import {
  colors,
  colorBase,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  mediaQueries,
  zIndex,
  transitions,
} from "epignosis-ui/tokens";
```

### Design tokens (CSS variables)

```ts
import "epignosis-ui/tokens.css";
```

Then reference the variables anywhere in CSS:

```css
.my-button {
  background-color: var(--color-primary-base);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs) var(--spacing-md);
}
```

See [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) for the full token reference.
