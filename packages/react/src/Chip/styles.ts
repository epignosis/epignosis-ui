import { css, type SerializedStyles, type Theme } from "@emotion/react";
import { borderRadius, typography } from "@epignosis_llc/ui-tokens";
import type { ChipSize } from "./Chip";

const heights: Record<ChipSize, string> = {
  md: "2.5rem",
  lg: "3rem",
};

// gnosis maps `lg` chips to typeScale.lg (1.125rem) and `md` to typeScale.sm
// (0.875rem). Both have direct equivalents in our token scale.
const fontSizes: Record<ChipSize, string> = {
  md: typography.fontSize.sm,
  lg: typography.fontSize.lg,
};

export const chip = (
  { chip }: Theme,
  {
    size,
    isFilterOn,
    maxWidth,
  }: { size: ChipSize; isFilterOn: boolean; maxWidth: string },
): SerializedStyles => css`
  display: inline-flex;
  align-items: center;
  font-size: ${fontSizes[size]};
  height: ${heights[size]};
  padding: 0 0.75rem;
  border-radius: ${borderRadius.sm};
  color: ${chip.color};
  background-color: ${chip.backgroundColor};

  /* Filter chips (icon present) swap icon ↔ close icon on hover. */
  &:hover .eg-chip__close {
    display: ${isFilterOn ? "flex" : "flex"};
  }
  &:hover .eg-chip__icon {
    display: ${isFilterOn ? "none" : "flex"};
  }

  .eg-chip__button {
    display: inline-flex;
    align-items: center;
    color: inherit;
    background: transparent;
    border: none;
    padding: 0;
    margin-inline-end: 0.5rem;
    cursor: pointer;
    ${isFilterOn ? "min-width: 1rem;" : ""}
  }

  .eg-chip__icon {
    display: ${isFilterOn ? "flex" : "none"};
    fill: currentColor;
  }

  .eg-chip__close {
    display: ${isFilterOn ? "none" : "flex"};
  }

  .eg-chip__label {
    word-break: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: ${maxWidth};
  }
`;
