import { css, type Theme, type SerializedStyles } from "@emotion/react";

export const tooltipContainer = (
  maxWidth: number,
  { tooltip }: Theme,
  borderColor?: string,
): SerializedStyles => css`
  max-width: ${maxWidth}px;
  background: ${tooltip.background};
  border: 1px solid ${borderColor ?? tooltip.border};
  border-radius: 5px; /* no borderRadius token equivalent in ui-tokens */
  color: ${tooltip.color};
  padding: 0.5rem;
  font-size: 0.625rem;

  &.eg-tooltip[data-placement^="top"] > .eg-tooltip__arrow {
    margin-left: -2px;
    bottom: -1px;
  }

  &.eg-tooltip[data-placement^="bottom"] > .eg-tooltip__arrow {
    top: -1px;
    margin-left: 3px;
  }

  &.eg-tooltip[data-placement^="left"] > .eg-tooltip__arrow {
    right: -4px;
    margin-top: -2px;
  }

  &.eg-tooltip[data-placement^="right"] > .eg-tooltip__arrow {
    left: -4px;
    margin-top: 3px;
  }

  .eg-tooltip__arrow,
  .eg-tooltip__arrow::before {
    position: absolute;
    width: 1rem;
    height: 0.5rem;
    z-index: -1;
  }

  .eg-tooltip__arrow::before {
    content: "";
    transform: rotate(45deg);
    background: ${borderColor ?? tooltip.border};
  }
`;
