# @epignosis_llc/ui-react

React 19 component library for the Epignosis design system. Ships compiled ESM + CJS + `.d.ts`.

Tokens and icons live in sibling packages — see [`@epignosis_llc/ui-tokens`](https://www.npmjs.com/package/@epignosis_llc/ui-tokens) and [`@epignosis_llc/ui-icons`](https://www.npmjs.com/package/@epignosis_llc/ui-icons). For background on the design system, see the [main repository](https://github.com/epignosis/epignosis-ui).

## Install

```bash
pnpm add @epignosis_llc/ui-react
```

Peer dependencies: `react >=19`, `react-dom >=19`, `@emotion/react ^11`.

`@epignosis_llc/ui-tokens` and `@epignosis_llc/ui-icons` are runtime dependencies — pnpm/npm will install them automatically.

## Usage

```tsx
import { Button } from "@epignosis_llc/ui-react";

export function App() {
  return <Button>Hello</Button>;
}
```

Components style themselves from the tokens package's compiled JS (`colors`, `typography`, `borderRadius`, `transitions`, etc.). **You do not need to import `tokens.css` for components to render correctly.**

### Optional: CSS variables in your own styles

If your app uses CSS custom properties from the token set (e.g. `var(--color-primary-base)` in your own stylesheets), import the stylesheet once at the entry of your app:

```ts
import "@epignosis_llc/ui-tokens/tokens.css";
```

The components themselves don't read these — this is purely for your own consumption.
