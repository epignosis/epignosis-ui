# Button Pulse Loader

**Date:** 2026-05-03
**Status:** Design approved, pending implementation
**Scope:** `packages/react/src/Button/`

## Goal

Replace the rotating-ring spinner shown when `<Button isLoading>` with a 3-dot pulse animation that matches the behaviour of gnosis's `PulseLoader` (from `react-spinners`). Inline change only — no new component, no new dependency.

## Non-goals

- Standalone `Loader` component in `@epignosis-ui/react`. Already deferred by the 2026-04-27 and 2026-04-28 specs to "when a second consumer appears."
- Adding `react-spinners` as a dependency. Reproducing the animation in Emotion is ~10 lines.
- Mount/unmount fade transition (gnosis wraps its loader in Framer Motion `AnimatePresence`). Current epignosis button toggles instantly; preserving that.

## Reference behaviour (gnosis)

The `react-spinners` `PulseLoader` renders three circular dots with this animation:

- **Keyframes:** `0% { scale(1) opacity:1 } 45% { scale(0.1) opacity:0.7 } 80% { scale(1) opacity:1 }`
- **Duration:** 0.75s, infinite
- **Easing:** `cubic-bezier(0.2, 0.68, 0.18, 1.08)`
- **Stagger:** dots 1/2/3 start at 0.12s / 0.24s / 0.36s

Gnosis uses it inside Button at `size="md"` → `0.375rem` dots, `0.0625rem` margin, theme primary color.

## Design

### Markup change — `Button.tsx`

Current (line ~109):

```tsx
{
  isLoading && <span className={`${BLOCK}__spinner`} aria-hidden="true" />;
}
```

New:

```tsx
{
  isLoading && (
    <span className={`${BLOCK}__spinner`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}
```

The wrapper keeps the existing `${BLOCK}__spinner` class so the layout slot (margin, flex behaviour) stays intact. Three child spans become the dots.

### Style change — `styles.ts`

Replace the existing `spin` keyframes and `loadingButton` block with:

```ts
const pulse = keyframes`
  0%   { transform: scale(1);   opacity: 1;   }
  45%  { transform: scale(0.1); opacity: 0.7; }
  80%  { transform: scale(1);   opacity: 1;   }
`;

const loadingButton = (): SerializedStyles => css`
  .eg-button__spinner {
    display: inline-flex;
    align-items: center;
    margin-inline-end: 0.5rem;
    flex-shrink: 0;

    > span {
      width: 0.375em;
      height: 0.375em;
      margin: 0 0.0625em;
      border-radius: 50%;
      background-color: currentColor;
      display: inline-block;
      animation: ${pulse} 0.75s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
      animation-fill-mode: both;
    }
    > span:nth-of-type(1) {
      animation-delay: 0.12s;
    }
    > span:nth-of-type(2) {
      animation-delay: 0.24s;
    }
    > span:nth-of-type(3) {
      animation-delay: 0.36s;
    }
  }
`;
```

## Decisions

| Property     | Gnosis                                     | This design    | Reason                                                                                                   |
| ------------ | ------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------- |
| Color        | `theme.loader.color` (primary blue, fixed) | `currentColor` | Matches existing epignosis spinner; works on every variant (white on solid primary, blue on ghost, etc.) |
| Sizing unit  | `rem` (fixed across button sizes)          | `em`           | Matches existing epignosis spinner (`1em` ring); scales with button size sm/md/lg                        |
| Dot diameter | `0.375rem` (md)                            | `0.375em`      | Same proportion at 16px root; scales naturally                                                           |
| Animation    | identical                                  | identical      | The actual "behaviour" the user asked to replicate                                                       |

## Risks

- **Footprint shift:** ring was ~`1em × 1em`; the dot row is wider (~`1.3em`) but shorter (`0.375em`). Visual verification in Storybook on all three sizes (`sm`/`md`/`lg`) and all variants (`solid`/`outline`/`ghost`/`link`).
- **`em` sizing on `rounded` (circle) buttons:** the rounded variant constrains button dimensions; the dot row still fits at `~1.3em` wide but worth eyeballing.

## Verification

- Storybook stories already include `isLoading` controls in `Button.stories.tsx` — no story changes needed.
- Manual check: confirm dots pulse with the gnosis cadence by opening both Storybooks side-by-side (or comparing against a gnosis screenshot).
- No new tests; the existing component has none.
