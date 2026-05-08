---
"@epignosis_llc/ui-react": minor
---

Add three components ported from gnosis: Badge, Breadcrumbs, and Loader.

- **Badge** — dot or labeled indicator overlaid on a child element. Sizes `md`/`lg`, optional `withPulse` halo, configurable `offset`, `badgeContent` for counts/labels.
- **Breadcrumbs** — accessible nav with chevron separators (RTL-aware via `document.dir` on the client). `highlightActivePage` styles the last item as the current page.
- **Loader** — pulse and clip variants in two sizes, with `fullScreen` option for whole-page loading states. Defaults to `theme.loader.color`; accepts a `color` override.

Also replaces the inline 3-dot pulse animation in Button's loading state with `<Loader type="pulse" size="md" color="currentColor" />`. Visual behavior is unchanged (currentColor still tracks button text color); the animation timing is now sourced from `react-spinners` rather than a hand-rolled emotion keyframe.

Adds `react-spinners` as a runtime dependency.
