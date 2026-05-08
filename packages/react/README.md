# @epignosis_llc/ui-react

React 19 component library for the Epignosis design system. Ships compiled ESM + CJS + `.d.ts` and a CSS bundle.

Built on top of [`@epignosis_llc/ui-tokens`](https://www.npmjs.com/package/@epignosis_llc/ui-tokens). For background on the design system, see the [main repository](https://github.com/epignosis/epignosis-ui).

## Install

```bash
pnpm add @epignosis_llc/ui-react @epignosis_llc/ui-tokens
```

Peer dependencies: `react >=19`, `react-dom >=19`, `@emotion/react ^11`.

## Usage

```tsx
import { Button } from "@epignosis_llc/ui-react";
import "@epignosis_llc/ui-tokens/tokens.css";

export function App() {
  return <Button>Hello</Button>;
}
```
