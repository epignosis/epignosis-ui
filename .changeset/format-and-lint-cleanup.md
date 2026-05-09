---
"@epignosis_llc/ui-react": patch
---

Apply Prettier formatting across the workspace and resolve ESLint issues so the new lint/format gates can pass cleanly. No public API change. Notable code-level fixes: switched `clsx` imports to the named form (`import { clsx } from "clsx"`) across all components, and wrapped the SSR-safe direction probe in `Breadcrumbs` with an `eslint-disable-next-line react-hooks/set-state-in-effect`.
