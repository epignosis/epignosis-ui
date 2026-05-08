import { css, keyframes, type SerializedStyles, type Theme } from "@emotion/react";
import { borderRadius, transitions, typography } from "@epignosis_llc/ui-tokens";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./Button";
import { roundDimensions } from "./constants";

const fontSizes = {
  sm: typography.fontSize.sm,
  md: typography.fontSize.sm,
  lg: typography.fontSize.lg,
};
const heights = { sm: "2rem", md: "2.5rem", lg: "3rem" };
const minWidths = { sm: "2rem", md: "2.5rem", lg: "3rem" };
const paddings = { sm: "0 1rem", md: "0 1.75rem", lg: "0 3rem" };

const baseButton = (size: ButtonSize): SerializedStyles => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily.body};
  font-weight: ${typography.fontWeight.semibold};
  border-radius: ${borderRadius.sm};
  line-height: 1.125rem;
  cursor: pointer;
  font-size: ${fontSizes[size]};
  height: ${heights[size]};
  min-width: ${minWidths[size]};
  padding: ${paddings[size]};
  transition:
    background-color ${transitions.fast} ease-in,
    color ${transitions.fast} ease-in,
    border-color ${transitions.fast} ease-in,
    box-shadow ${transitions.fast} ease;

  .eg-button__text {
    display: inline-flex;
  }
`;

const solidButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  color: ${button[color].default.color};
  background-color: ${button[color].default.background};
  border: 1px solid ${button[color].default.borderColor};

  &:hover:not(:disabled):not(.eg-button--disabled),
  &:focus-visible:not(:disabled):not(.eg-button--disabled) {
    color: ${button[color].hover.color};
    background-color: ${button[color].hover.background};
    border-color: ${button[color].hover.borderColor};
  }

  &:active:not(:disabled):not(.eg-button--disabled),
  &.eg-button--active:not(:disabled):not(.eg-button--disabled) {
    color: ${button[color].active.color};
    background-color: ${button[color].active.background};
    border-color: ${button[color].active.borderColor};
  }
`;

const outlineButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  color: ${button[color].outline.color};
  background-color: transparent;
  border: 1px solid ${button[color].outline.borderColor};

  &:hover:not(:disabled):not(.eg-button--disabled),
  &:focus-visible:not(:disabled):not(.eg-button--disabled) {
    color: ${button[color].hover.color};
    background-color: ${button[color].hover.background};
    border-color: ${button[color].hover.borderColor};
  }

  &:active:not(:disabled):not(.eg-button--disabled),
  &.eg-button--active:not(:disabled):not(.eg-button--disabled) {
    color: ${button[color].active.color};
    background-color: ${button[color].active.background};
    border-color: ${button[color].active.borderColor};
  }
`;

const ghostButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  background-color: transparent;
  border: none;
  color: ${button[color].ghost.color};

  &:hover:not(:disabled):not(.eg-button--disabled),
  &:active:not(:disabled):not(.eg-button--disabled),
  &.eg-button--active:not(:disabled):not(.eg-button--disabled) {
    color: ${button[color].ghost.hoverColor};
    background-color: ${button[color].ghost.background};
  }
`;

const linkButton = (button: Theme["button"], color: ButtonColor): SerializedStyles => css`
  color: ${button[color].link.color};
  background-color: transparent;
  border: none;

  &:hover:not(:disabled):not(.eg-button--disabled),
  &:active:not(:disabled):not(.eg-button--disabled),
  &.eg-button--active:not(:disabled):not(.eg-button--disabled) {
    color: ${button[color].link.hoverColor};
  }
`;

const disabledButton = (button: Theme["button"]): SerializedStyles => css`
  &:disabled,
  &.eg-button--disabled {
    &,
    &:hover,
    &:focus,
    &:active {
      color: ${button.disabled.color};
      background-color: ${button.disabled.background};
      border-color: ${button.disabled.borderColor};
      cursor: not-allowed;
    }
  }
`;

const iconBeforePadding: Record<ButtonSize, string | undefined> = {
  sm: undefined,
  md: "1.25rem 1.75rem",
  lg: "1.875rem 3rem",
};
const iconAfterPadding: Record<ButtonSize, string | undefined> = {
  sm: undefined,
  md: "1.75rem 1.25rem",
  lg: "3rem 1.875rem",
};

const iconBeforeButton = (size: ButtonSize, noGutters: boolean): SerializedStyles => {
  const override = iconBeforePadding[size];
  const inline = noGutters ? "0.25rem 0.75rem" : override;
  return css`
    padding-block: 0;
    ${inline ? `padding-inline: ${inline};` : ""}
    .eg-button__icon {
      margin-inline-end: ${noGutters ? "0.25rem" : "0.5rem"};
    }
  `;
};

const iconAfterButton = (size: ButtonSize, noGutters: boolean): SerializedStyles => {
  const override = iconAfterPadding[size];
  const inline = noGutters ? "0.75rem 0.25rem" : override;
  return css`
    padding-block: 0;
    ${inline ? `padding-inline: ${inline};` : ""}
    .eg-button__icon {
      margin-inline-start: ${noGutters ? "0.25rem" : "0.5rem"};
    }
  `;
};

const blockButton = (): SerializedStyles => css`
  width: 100%;
`;

const noGuttersButton = (): SerializedStyles => css`
  padding: 0 0.25rem;
`;

const roundedButton = (size: ButtonSize): SerializedStyles => css`
  width: ${roundDimensions[size]};
  height: ${roundDimensions[size]};
  min-width: ${roundDimensions[size]};
  padding: 0;
  border-radius: 50%;
`;

const underlinedButton = (): SerializedStyles => css`
  .eg-button__text {
    text-decoration: underline;
  }
`;

const pulse = keyframes`
  0%   { transform: scale(1);   opacity: 1; }
  45%  { transform: scale(0.1); opacity: 0.7; }
  80%  { transform: scale(1);   opacity: 1; }
`;

const loadingButton = (): SerializedStyles => css`
  .eg-button__spinner {
    display: inline-flex;
    align-items: center;
    margin-inline-end: 0.5rem;
    flex-shrink: 0;

    > span {
      width: 0.375rem;
      height: 0.375rem;
      margin: 0 0.0625rem;
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

const variantStyles = (
  button: Theme["button"],
  variant: ButtonVariant,
  color: ButtonColor,
): SerializedStyles => {
  switch (variant) {
    case "solid":
      return solidButton(button, color);
    case "outline":
      return outlineButton(button, color);
    case "ghost":
      return ghostButton(button, color);
    case "link":
      return linkButton(button, color);
  }
};

export type BtnContainerProps = {
  color: ButtonColor;
  variant: ButtonVariant;
  size: ButtonSize;
  hasIconBefore?: boolean;
  hasIconAfter?: boolean;
  block?: boolean;
  noGutters?: boolean;
  rounded?: boolean;
  underlined?: boolean;
  isLoading?: boolean;
};

export const btnContainer = (
  theme: Theme,
  {
    color,
    variant,
    size,
    hasIconBefore,
    hasIconAfter,
    block,
    noGutters,
    rounded,
    underlined,
    isLoading,
  }: BtnContainerProps,
): SerializedStyles => css`
  ${baseButton(size)};
  ${variantStyles(theme.button, variant, color)};
  ${hasIconBefore ? iconBeforeButton(size, !!noGutters) : ""};
  ${hasIconAfter ? iconAfterButton(size, !!noGutters) : ""};
  ${block ? blockButton() : ""};
  ${noGutters && !rounded && !hasIconBefore && !hasIconAfter ? noGuttersButton() : ""};
  ${rounded ? roundedButton(size) : ""};
  ${underlined ? underlinedButton() : ""};
  ${isLoading ? loadingButton() : ""};
  ${disabledButton(theme.button)};
`;
