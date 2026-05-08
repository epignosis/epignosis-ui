---
"@epignosis_llc/ui-react": minor
"@epignosis_llc/ui-icons": patch
---

Source Alert default icons from `@epignosis_llc/ui-icons` instead of inline SVG paths. The icons now match gnosis (`InfoSVG`, `DangerSVG`, `SuccessSVG`, `WarningSVG`, `CloseCircledSVG`).

`@epignosis_llc/ui-icons` is now a runtime dependency of `@epignosis_llc/ui-react`. Tree-shaking still ships only the icons actually used.

The icons package now generates a flat `dist/index.d.ts` with explicit `SVGComponent` typings for every export, replacing the previous re-export chain that resolved to `string` in consumer projects.
