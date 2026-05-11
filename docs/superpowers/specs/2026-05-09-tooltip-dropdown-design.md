# Tooltip + Dropdown Port — Design Spec

## Goal

Port `Tooltip` and `Dropdown` from gnosis into `@epignosis_llc/ui-react`, preserving the full public API of each component so consumers can migrate without changes.

---

## Dependencies

Add to `packages/react/package.json`:

```json
"@tippyjs/react": "^4.2.6",
"tippy.js": "^6.3.7"
```

Both are runtime dependencies (not dev-only) because they ship with the component bundle.

---

## Tooltip

### File layout

```
src/Tooltip/
  Tooltip.tsx
  styles.ts
  Tooltip.test.tsx
  Tooltip.stories.tsx
```

### Props

`TooltipProps` extends `TippyProps` from `@tippyjs/react` and adds:

| Prop          | Type                          | Default     | Notes                                |
| ------------- | ----------------------------- | ----------- | ------------------------------------ |
| `content`     | `TippyProps["content"]`       | required    | The tooltip panel content            |
| `as`          | element tag union (see below) | `"div"`     | Wrapper tag around children          |
| `parentProps` | `object`                      | `undefined` | Props spread onto the wrapper tag    |
| `maxWidth`    | `number`                      | `350`       | Max width of the tooltip panel in px |
| `showArrow`   | `boolean`                     | `true`      | Whether to render the arrow          |
| `borderColor` | `string`                      | `undefined` | Overrides `theme.tooltip.border`     |

`as` accepts: `"div" | "span" | "li" | "section" | "article" | "header" | "footer" | "nav" | "aside" | "main" | "ul" | "ol" | "table" | "tbody" | "thead" | "tfoot" | "tr" | "td" | "th" | "figure" | "figcaption" | "form" | "fieldset"`.

All remaining `TippyProps` pass through via `...rest`. Hardcoded Tippy options (matching gnosis): `interactive={true}`, `appendTo={document.body}`, `touch={["hold", 300]}`.

### Rendering

```tsx
<Tippy
  placement={placement}
  interactive={interactive}
  appendTo={document.body}
  touch={["hold", 300]}
  render={(attrs) => (
    <div className="eg-tooltip" role="alert" css={...} {...attrs}>
      {content}
      {showArrow && <div id="eg-tooltip__arrow" data-testid="tooltip-arrow" data-popper-arrow />}
    </div>
  )}
  {...rest}
>
  <Tag role="tooltip" {...parentProps}>{children}</Tag>
</Tippy>
```

### BEM class names

- `eg-tooltip` — the floating panel
- `eg-tooltip__arrow` — the arrow div (`data-popper-arrow`)

### Theme slice

Added to `packages/react/src/theme/config/tooltip.ts`:

```ts
import { colors } from "@epignosis_llc/ui-tokens";

const tooltip = {
  background: colors.white,
  color: colors.black,
  border: colors.black,
} as const;

export default tooltip;
```

Added to `theme.ts` and `EpignosisTheme` type.

### Styles

`tooltipContainer(maxWidth, theme, borderColor?)` — Emotion `css` function. Handles `max-width`, background, border, border-radius (`5px`), color, padding (`0.5rem`), font-size (`0.625rem` — gnosis `typeScaleSizes["2xs"]`; no equivalent token exists, use literal). Arrow CSS uses `data-placement` attribute selectors for directional offset.

---

## Dropdown

### File layout

```
src/Dropdown/
  Dropdown.tsx
  types.ts
  helpers.ts
  styles.ts
  Dropdown.test.tsx
  Dropdown.stories.tsx
  components/
    DropdownListItem.tsx
    DropdownListItemTitle.tsx
    styles.ts
src/hooks/
  useClickAway.ts
```

### Types (`types.ts`)

```ts
import type { TippyProps } from "@tippyjs/react";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

export type DropdownItem = {
  label?: string | JSX.Element;
  originalText?: string;
  value?: string;
  id?: string;
  icon?: JSX.Element | ReactElement;
  className?: string;
  items?: DropdownItem[];
  category?: string;
  isDisabled?: boolean;
  tooltipContent?: TippyProps["content"];
  divider?: boolean;
};

export type PlacementOptions = "bottom-start" | "bottom-end" | "top-start" | "top-end" | "end-top";

export type DropdownProps = HTMLAttributes<HTMLDivElement> & {
  list: DropdownItem[];
  children: ReactNode;
  placement?: PlacementOptions;
  isSearchable?: boolean;
  textSize?: "xs" | "sm" | "md";
  prependContent?: ReactNode;
  hover?: boolean;
  fullWidth?: boolean;
  fixPlacement?: boolean;
  emptyStateText?: string;
  placeholderText?: string;
  remainOpenOnSelect?: boolean;
  onListItemSelect?: (item: DropdownItem) => void;
  onToggleList?: (isListOpen: boolean) => void;
  disabled?: boolean;
  isGroupedList?: boolean;
};
```

### `useClickAway` hook (`src/hooks/useClickAway.ts`)

Replaces `ahooks` `useClickAway`. Attaches a `mousedown` listener on `document`; calls the handler when the click target is outside the provided ref. Cleans up on unmount. Callers must stabilise the handler with `useCallback` to avoid re-subscribing on every render.

```ts
import { useEffect, type RefObject } from "react";

export function useClickAway<T extends HTMLElement>(ref: RefObject<T>, handler: () => void): void {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
```

### Helpers (`helpers.ts`)

Direct port from gnosis — no changes:

- `filterListByKeyword(list, keyword)` — recursive label/originalText filter
- `getScrollableParent(node)` — walks up the DOM for an overflow-scrollable ancestor
- `getInlinePaddingStart(level, isSearchable)` — computes inline padding for nested levels
- `clearDividers(items)` — strips all `divider` flags recursively
- `addDividerToLastItem(items)` — sets `divider: true` on the deepest last item
- `buildGroupedDropdownMenu(list)` — orchestrates divider placement for grouped lists

### Dropdown component (`Dropdown.tsx`)

All props match gnosis exactly. Key adaptations:

- **Click-away:** `useClickAway(wrapperRef, () => setIsListOpen(false))` in place of `ahooks`.
- **Search input:** Plain `<input>` element (no `SearchInput` component). Debounce via `useRef<ReturnType<typeof setTimeout>>` — 300 ms, matching gnosis `delayBeforeSearch`.
- **Text rendering:** `<span>` with Emotion styles instead of gnosis `<Text>`.
- **RTL:** Read from `document.dir` on open (same as gnosis).
- **`fixPlacement`:** Identical viewport/scrollable-parent geometry logic ported verbatim.
- **Hover mode:** `onMouseOver`/`onMouseLeave` with 100 ms debounce, same as gnosis.

### BEM class names

| Class                          | Element                                                  |
| ------------------------------ | -------------------------------------------------------- |
| `eg-dropdown`                  | root wrapper                                             |
| `eg-dropdown__button`          | trigger wrapper (`is-active` modifier when open)         |
| `eg-dropdown__wrapper`         | floating panel (placement modifier: `bottom-start` etc.) |
| `eg-dropdown__list`            | `<ul>`                                                   |
| `eg-dropdown__list-item`       | `<li>` leaf item                                         |
| `eg-dropdown__list-item-title` | `<li>` group heading                                     |
| `eg-dropdown__empty-state`     | empty state `<li>`                                       |
| `eg-dropdown__divider`         | divider `<div>`                                          |
| `eg-dropdown__search`          | search `<input>`                                         |

### Theme slice

Added to `packages/react/src/theme/config/dropdown.ts`:

```ts
import { colors } from "@epignosis_llc/ui-tokens";

const dropdown = {
  boxShadowColor: colors.secondary.light,
  backgroundColor: colors.white,
  emptyStateColor: colors.secondary.base,
  hoverBackgroundColor: colors.secondary.lighter,
  borderBottomColor: colors.secondary.lighter,
  textColor: colors.black,
  disabledColor: colors.secondary.light,
} as const;

export default dropdown;
```

### Styles

- `DropdownContainer(theme, { isSearchable, fullWidth })` — positions wrapper, sets `display: inline-block`, styles `.eg-dropdown__wrapper` with placement variants and box-shadow.
- `DropdownList(theme, { fullWidth, isSearchable })` — scrollable `<ul>`, max-height `21rem`, custom scrollbar, empty state and divider styling.
- `DropdownListItemStyles(theme, { isSearchable, level, isDisabled })` — inline padding via `getInlinePaddingStart`, hover background, disabled color, icon margin.
- `DropdownListItemTitleStyles({ level, isSearchable })` — padding only, no theme dependency.

---

## Exports

Added to `packages/react/src/index.ts`:

```ts
export { default as Tooltip } from "./Tooltip/Tooltip";
export type { TooltipProps } from "./Tooltip/Tooltip";

export { default as Dropdown } from "./Dropdown/Dropdown";
export type { DropdownProps, DropdownItem, PlacementOptions } from "./Dropdown/types";
```

---

## Tests

### Tooltip (`Tooltip.test.tsx`)

- Renders tooltip content and arrow on hover
- Arrow absent when `showArrow={false}`
- Snapshot

### Dropdown (`Dropdown.test.tsx`)

- Opens list on trigger click + snapshot
- `onListItemSelect` called with correct item on click
- Disabled dropdown: `onToggleList` not called
- Disabled item: `onListItemSelect` not called
- Item with `divider: true` renders `.eg-dropdown__divider`
- Grouped list: correct number of dividers between groups
- Grouped list + search: filters items correctly (await 300 ms debounce)
- Snapshot default + all-props

---

## Stories

### `Tooltip.stories.tsx`

- Default (placement: top, content string)
- WithMaxWidth (650 px, long content)
- WithNoArrow
- WithBorderColor

### `Dropdown.stories.tsx`

- Default (searchable, nested list)
- WithHover
- WithGroupedList
- WithPrependContent
- WithJSXLabels (+ `originalText` for search)
- WithIcons
- WithFixPlacement (scrollable container, four placement variants)

---

## Changeset

`minor` bump on `@epignosis_llc/ui-react` — two new public components.
