import type { ElementType, ReactNode } from "react";
import type { Theme } from "@emotion/react";
import type { PolymorphicComponentProps } from "../types/polymorphic";
import { btnContainer } from "./styles";
import { iconSizes, type IconType } from "./constants";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "primaryLight"
  | "primaryDarker"
  | "white"
  | "orange";

export type ButtonVariant = "solid" | "outline" | "ghost" | "link";

export type ButtonSize = "sm" | "md" | "lg";

export type { IconType };

type Props = {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** When true, button is disabled and a spinner replaces the leading position. */
  isLoading?: boolean;
  /** Stretches the button to fill its container's width. */
  block?: boolean;
  /** Tightens horizontal padding (`0 0.25rem`) and shrinks icon spacing. */
  noGutters?: boolean;
  /** Renders the button as a circle. Pairs with `size` for the diameter. */
  rounded?: boolean;
  /** Underlines the inner text. */
  underlined?: boolean;
  /** Forces the active visual state (mirrors `:active`). */
  active?: boolean;
  iconBefore?: IconType;
  iconAfter?: IconType;
  className?: string;
  children: ReactNode;
};

export type ButtonProps<C extends ElementType = "button"> = PolymorphicComponentProps<C, Props>;

const BLOCK = "eg-button";

export default function Button<C extends ElementType = "button">({
  as,
  color = "primary",
  variant = "solid",
  size = "md",
  disabled,
  isLoading = false,
  block = false,
  noGutters = false,
  rounded = false,
  underlined = false,
  active = false,
  iconBefore: PrefixIcon,
  iconAfter: SuffixIcon,
  className,
  children,
  ...rest
}: ButtonProps<C>) {
  const Component = (as ?? "button") as ElementType;
  const isNativeButton = as === undefined || as === "button";
  const isDisabled = Boolean(disabled) || isLoading;

  const composedClassName = [
    BLOCK,
    `${BLOCK}--${variant}`,
    `${BLOCK}--${color}`,
    `${BLOCK}--${size}`,
    isDisabled && `${BLOCK}--disabled`,
    isLoading && `${BLOCK}--loading`,
    block && `${BLOCK}--block`,
    noGutters && `${BLOCK}--no-gutters`,
    rounded && `${BLOCK}--rounded`,
    underlined && `${BLOCK}--underlined`,
    active && `${BLOCK}--active`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      css={(theme: Theme) =>
        btnContainer(theme, {
          color,
          variant,
          size,
          hasIconBefore: Boolean(PrefixIcon),
          hasIconAfter: Boolean(SuffixIcon),
          block,
          noGutters,
          rounded,
          underlined,
          isLoading,
        })
      }
      className={composedClassName}
      {...(isNativeButton && { type: "button", disabled: isDisabled })}
      {...rest}
    >
      {isLoading && <span className={`${BLOCK}__spinner`} aria-hidden="true" />}
      {PrefixIcon && (
        <PrefixIcon
          height={iconSizes[size]}
          className={`${BLOCK}__icon`}
          data-testid="prefix-icon"
        />
      )}
      <span className={`${BLOCK}__text`}>{children}</span>
      {SuffixIcon && (
        <SuffixIcon
          height={iconSizes[size]}
          className={`${BLOCK}__icon`}
          data-testid="suffix-icon"
        />
      )}
    </Component>
  );
}
