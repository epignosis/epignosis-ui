---
"@epignosis_llc/ui-react": patch
---

Add Vitest test infrastructure and ESLint/Prettier setup.

`pnpm --filter @epignosis_llc/ui-react test:run` runs the full suite (38 tests across Alert, Avatar, Badge, Breadcrumbs, Button, Chip, Loader). Tests are co-located with each component as `<Component>.test.tsx` and modeled directly on the equivalent gnosis tests. ESLint flat config and Prettier live at the workspace root and apply to every package; rules mirror the gnosis convention (eslint-plugin-react, react-hooks, import/order, prettier integration). No public API change.
