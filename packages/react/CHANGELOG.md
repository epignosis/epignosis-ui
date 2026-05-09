# @epignosis_llc/ui-react

## 1.8.0

### Minor Changes

- [`6f60622`](https://github.com/epignosis/epignosis-ui/commit/6f60622b277667b282c035d991ee584dc6422bf4) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Add Chip component (compact label with optional close button and filter mode).

  Two sizes (`md`/`lg`). Pass `onClose` to render a leading dismiss button. Pass an `icon` to make it a filter chip — the icon shows by default and swaps to the close icon on hover. Use `maxWidth` to cap the label width with ellipsis truncation; truncated string children fall back to a native browser tooltip.

  Backed by a new `theme.chip` config (background sourced from `colors.primary.lightest25`, the same alpha-modulated token used by `Button`'s `primaryLight` variant).

### Patch Changes

- Updated dependencies [[`8067759`](https://github.com/epignosis/epignosis-ui/commit/8067759b5764c717a666f3ebdf13587e9fd4fda3)]:
  - @epignosis_llc/ui-icons@0.2.0

## 1.7.0

### Minor Changes

- [`2fd4ced`](https://github.com/epignosis/epignosis-ui/commit/2fd4cedca1c7c68c57d9e925227a92fc99212698) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - add docs

## 1.6.0

### Minor Changes

- [`b67a0db`](https://github.com/epignosis/epignosis-ui/commit/b67a0db1e17a3d5631f3c3a21e4ab8cdec6ddd14) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Add three components ported from gnosis: Badge, Breadcrumbs, and Loader.

  - **Badge** — dot or labeled indicator overlaid on a child element. Sizes `md`/`lg`, optional `withPulse` halo, configurable `offset`, `badgeContent` for counts/labels.
  - **Breadcrumbs** — accessible nav with chevron separators (RTL-aware via `document.dir` on the client). `highlightActivePage` styles the last item as the current page.
  - **Loader** — pulse and clip variants in two sizes, with `fullScreen` option for whole-page loading states. Defaults to `theme.loader.color`; accepts a `color` override.

  Also replaces the inline 3-dot pulse animation in Button's loading state with `<Loader type="pulse" size="md" color="currentColor" />`. Visual behavior is unchanged (currentColor still tracks button text color); the animation timing is now sourced from `react-spinners` rather than a hand-rolled emotion keyframe.

  Adds `react-spinners` as a runtime dependency.

### Patch Changes

- [`cbe458e`](https://github.com/epignosis/epignosis-ui/commit/cbe458e04550063f129c22b156024636a3fb2b46) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - breadcrumbs

## 1.5.4

### Patch Changes

- Updated dependencies [[`4d0befd`](https://github.com/epignosis/epignosis-ui/commit/4d0befd258e28a24f833acf160424223213f5f18)]:
  - @epignosis_llc/ui-icons@0.1.10

## 1.5.3

### Patch Changes

- [`dcfce35`](https://github.com/epignosis/epignosis-ui/commit/dcfce35f70e8b6553b0e75c22913809800f8aca0) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - changes

- Updated dependencies [[`dcfce35`](https://github.com/epignosis/epignosis-ui/commit/dcfce35f70e8b6553b0e75c22913809800f8aca0)]:
  - @epignosis_llc/ui-icons@0.1.9

## 1.5.2

### Patch Changes

- Merge pull request [#13](https://github.com/epignosis/epignosis-ui/issues/13) from epignosis/changeset-release/main

- Updated dependencies []:
  - @epignosis_llc/ui-icons@0.1.8

## 1.5.1

### Patch Changes

- Merge pull request [#12](https://github.com/epignosis/epignosis-ui/issues/12) from epignosis/changeset-release/main

- Updated dependencies []:
  - @epignosis_llc/ui-icons@0.1.7

## 1.5.0

### Minor Changes

- [`855f3de`](https://github.com/epignosis/epignosis-ui/commit/855f3de3aa92f1f607ccc14c961574bed349f08a) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Source Alert default icons from `@epignosis_llc/ui-icons` instead of inline SVG paths. The icons now match gnosis (`InfoSVG`, `DangerSVG`, `SuccessSVG`, `WarningSVG`, `CloseCircledSVG`).

  `@epignosis_llc/ui-icons` is now a runtime dependency of `@epignosis_llc/ui-react`. Tree-shaking still ships only the icons actually used.

  The icons package now generates a flat `dist/index.d.ts` with explicit `SVGComponent` typings for every export, replacing the previous re-export chain that resolved to `string` in consumer projects.

### Patch Changes

- Updated dependencies [[`855f3de`](https://github.com/epignosis/epignosis-ui/commit/855f3de3aa92f1f607ccc14c961574bed349f08a)]:
  - @epignosis_llc/ui-icons@0.1.6

## 1.4.0

### Minor Changes

- [`18c57db`](https://github.com/epignosis/epignosis-ui/commit/18c57db3c54ca421ced30bdf5f9703d2e1e22e42) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Add Alert component (info/danger/success/warning, optional close button, default icons per type).

## 1.3.1

### Patch Changes

- Merge pull request [#4](https://github.com/epignosis/epignosis-ui/issues/4) from epignosis/changeset-release/main

## 1.3.0

### Minor Changes

- [`eb2f336`](https://github.com/epignosis/epignosis-ui/commit/eb2f336eec7ccc635cbf89e88d643ba666218c29) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Add Avatar component (image, icon, or text fallback).

## 1.2.0

### Minor Changes

- [`5979cd0`](https://github.com/epignosis/epignosis-ui/commit/5979cd071cf16a98b72198dfe002c9d16fe85dd2) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - minor

### Patch Changes

- Updated dependencies [[`5979cd0`](https://github.com/epignosis/epignosis-ui/commit/5979cd071cf16a98b72198dfe002c9d16fe85dd2)]:
  - @epignosis_llc/ui-tokens@1.1.0

## 1.1.0

### Minor Changes

- [`e60ee6e`](https://github.com/epignosis/epignosis-ui/commit/e60ee6e6e4d40df310aa72007c78ae5da5bb0b6a) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Minor changes

## 1.0.0

### Major Changes

- [`6518f0b`](https://github.com/epignosis/epignosis-ui/commit/6518f0b74432a9b46088272b9949483f8da8d7be) Thanks [@xanderantoniadis](https://github.com/xanderantoniadis)! - Init

### Patch Changes

- Updated dependencies [[`6518f0b`](https://github.com/epignosis/epignosis-ui/commit/6518f0b74432a9b46088272b9949483f8da8d7be)]:
  - @epignosis_llc/ui-tokens@1.0.0
