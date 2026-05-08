import { css, keyframes, type SerializedStyles, type Theme } from "@emotion/react";
import type { BadgeOffset, BadgeSize } from "./Badge";

const sizes: Record<BadgeSize, string> = {
  md: "0.5rem",
  lg: "0.75rem",
};

const grow = keyframes`
  0%   { transform: scale(0.1); }
  100% { transform: scale(1); }
`;

const active = keyframes`
  0%   { transform: scale(0.1); opacity: 1; }
  70%  { transform: scale(2.5); opacity: 0; }
  100% { opacity: 0; }
`;

export const container = (
  { badge }: Theme,
  { size, offset }: { size: BadgeSize; offset: BadgeOffset },
): SerializedStyles => css`
  display: inline-block;
  position: relative;

  &.eg-badge--has-content {
    .eg-badge__indicator {
      min-width: 1.25rem;
      height: 1.25rem;
      border: 2px solid ${badge.border};
    }
  }

  &.eg-badge--big-content {
    .eg-badge__indicator {
      min-width: 2rem;
      border-radius: 20px;
    }
  }

  .eg-badge__indicator {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    position: absolute;
    min-width: ${sizes[size]};
    height: ${sizes[size]};
    background: ${badge.background};
    color: ${badge.color};
    border-radius: 50%;
    inset-block-start: ${offset.top};
    inset-inline-end: ${offset.right};
    z-index: 1;

    &.eg-badge__indicator--pulse {
      animation: ${grow} 0.4s 1 linear;
      overflow: visible;

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 0 2px 2px ${badge.background};
        animation: ${active} 2s infinite linear;
        z-index: -1;
      }
    }
  }
`;
