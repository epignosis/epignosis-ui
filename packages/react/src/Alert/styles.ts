import { css, type SerializedStyles, type Theme } from "@emotion/react";
import { borderRadius, mediaQueries } from "@epignosis_llc/ui-tokens";
import type { AlertType } from "./Alert";

export const container = ({ alert }: Theme, { type }: { type: AlertType }): SerializedStyles => css`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${alert[type].background};
  color: ${alert[type].color};
  border-radius: ${borderRadius.sm};
  padding-block: 2rem;
  padding-inline: 1.75rem 3.5rem;

  .eg-alert__icon {
    display: none;
    margin-inline-end: 1.5rem;
    flex-shrink: 0;

    ${mediaQueries.md} {
      display: block;
    }
  }

  .eg-alert__body {
    flex: 1;
  }

  .eg-alert__close {
    position: absolute;
    height: 100%;
    inset-inline-end: 0.5rem;
    cursor: pointer;
    color: ${alert.closeBtnColor};
    background: transparent;
    padding: 0;
    border: 0;
    display: flex;
    align-items: center;

    ${mediaQueries.xl} {
      inset-inline-end: 1.5rem;
    }
  }
`;
