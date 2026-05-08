---
"@epignosis_llc/ui-react": minor
---

Add Chip component (compact label with optional close button and filter mode).

Two sizes (`md`/`lg`). Pass `onClose` to render a leading dismiss button. Pass an `icon` to make it a filter chip — the icon shows by default and swaps to the close icon on hover. Use `maxWidth` to cap the label width with ellipsis truncation; truncated string children fall back to a native browser tooltip.

Backed by a new `theme.chip` config (background sourced from `colors.primary.lightest25`, the same alpha-modulated token used by `Button`'s `primaryLight` variant).
