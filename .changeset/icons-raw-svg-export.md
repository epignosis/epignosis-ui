---
"@epignosis_llc/ui-icons": minor
---

Export raw SVG files for non-React consumers via `@epignosis_llc/ui-icons/svg/<ComponentName>.svg`.

Each icon is now also published as a raw `.svg` URL import alongside the existing React component export. Filenames mirror the React component names (`CertificateSVG.svg`, `UnitAnsweredSVG.svg`, etc.) so the mental model stays 1:1 across both entry points. The same `currentColor` rewrite applied by `vite-plugin-svgr` is applied to the raw files, so consumers can recolor via CSS `color`.

```ts
import url from "@epignosis_llc/ui-icons/svg/CertificateSVG.svg";
```
