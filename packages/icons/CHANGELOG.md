# @epignosis_llc/ui-icons

## 0.2.1

### Patch Changes

- [`cc32acd`](https://github.com/epignosis/epignosis-ui/commit/cc32acddc3d8fb4602c6a6ba3220bb16d78647be) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - readme update

## 0.2.0

### Minor Changes

- [`8067759`](https://github.com/epignosis/epignosis-ui/commit/8067759b5764c717a666f3ebdf13587e9fd4fda3) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Export raw SVG files for non-React consumers via `@epignosis_llc/ui-icons/svg/<ComponentName>.svg`.

  Each icon is now also published as a raw `.svg` URL import alongside the existing React component export. Filenames mirror the React component names (`CertificateSVG.svg`, `UnitAnsweredSVG.svg`, etc.) so the mental model stays 1:1 across both entry points. The same `currentColor` rewrite applied by `vite-plugin-svgr` is applied to the raw files, so consumers can recolor via CSS `color`.

  ```ts
  import url from "@epignosis_llc/ui-icons/svg/CertificateSVG.svg";
  ```

## 0.1.10

### Patch Changes

- [`4d0befd`](https://github.com/epignosis/epignosis-ui/commit/4d0befd258e28a24f833acf160424223213f5f18) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - readme

## 0.1.9

### Patch Changes

- [`dcfce35`](https://github.com/epignosis/epignosis-ui/commit/dcfce35f70e8b6553b0e75c22913809800f8aca0) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - changes

## 0.1.8

### Patch Changes

- Merge pull request [#13](https://github.com/epignosis/epignosis-ui/issues/13) from epignosis/changeset-release/main

## 0.1.7

### Patch Changes

- Merge pull request [#12](https://github.com/epignosis/epignosis-ui/issues/12) from epignosis/changeset-release/main

## 0.1.6

### Patch Changes

- [`855f3de`](https://github.com/epignosis/epignosis-ui/commit/855f3de3aa92f1f607ccc14c961574bed349f08a) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Source Alert default icons from `@epignosis_llc/ui-icons` instead of inline SVG paths. The icons now match gnosis (`InfoSVG`, `DangerSVG`, `SuccessSVG`, `WarningSVG`, `CloseCircledSVG`).

  `@epignosis_llc/ui-icons` is now a runtime dependency of `@epignosis_llc/ui-react`. Tree-shaking still ships only the icons actually used.

  The icons package now generates a flat `dist/index.d.ts` with explicit `SVGComponent` typings for every export, replacing the previous re-export chain that resolved to `string` in consumer projects.

## 0.1.5

### Patch Changes

- Merge pull request [#10](https://github.com/epignosis/epignosis-ui/issues/10) from epignosis/changeset-release/main

## 0.1.4

### Patch Changes

- Merge pull request [#9](https://github.com/epignosis/epignosis-ui/issues/9) from epignosis/changeset-release/main

## 0.1.3

### Patch Changes

- Merge pull request [#8](https://github.com/epignosis/epignosis-ui/issues/8) from epignosis/changeset-release/main

## 0.1.2

### Patch Changes

- Merge pull request [#7](https://github.com/epignosis/epignosis-ui/issues/7) from epignosis/changeset-release/main

## 0.1.1

### Patch Changes

- [`b8065dd`](https://github.com/epignosis/epignosis-ui/commit/b8065ddee669ca3858dfa69e8c26e31b1625de62) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Add readme and storybook
