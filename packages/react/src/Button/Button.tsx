import type { ElementType, ReactNode, SVGProps } from "react";
import type { Theme } from "@emotion/react";
import { clsx } from "clsx";
import Loader from "../Loader/Loader";
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
  /** Extra SVG props to forward to the leading icon. `height` and `className` merge with defaults; `data-testid` is fixed. */
  iconBeforeProps?: SVGProps<SVGSVGElement>;
  iconAfter?: IconType;
  /** Extra SVG props to forward to the trailing icon. Same merge rules as `iconBeforeProps`. */
  iconAfterProps?: SVGProps<SVGSVGElement>;
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
  iconBeforeProps,
  iconAfter: SuffixIcon,
  iconAfterProps,
  className,
  children,
  ...rest
}: ButtonProps<C>) {
  const Component = (as ?? "button") as ElementType;
  const isNativeButton = as === undefined || as === "button";
  const isDisabled = Boolean(disabled) || isLoading;

  const composedClassName = clsx(
    BLOCK,
    `${BLOCK}--${variant}`,
    `${BLOCK}--${color}`,
    `${BLOCK}--${size}`,
    {
      [`${BLOCK}--disabled`]: isDisabled,
      [`${BLOCK}--loading`]: isLoading,
      [`${BLOCK}--block`]: block,
      [`${BLOCK}--no-gutters`]: noGutters,
      [`${BLOCK}--rounded`]: rounded,
      [`${BLOCK}--underlined`]: underlined,
      [`${BLOCK}--active`]: active,
    },
    className,
  );

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
      {isLoading && (
        <span className={`${BLOCK}__spinner`} aria-hidden="true">
          <Loader type="pulse" size="md" color="currentColor" />
        </span>
      )}
      {PrefixIcon && (
        <PrefixIcon
          {...iconBeforeProps}
          height={iconBeforeProps?.height ?? iconSizes[size]}
          className={clsx(`${BLOCK}__icon`, iconBeforeProps?.className)}
          data-testid="prefix-icon"
        />
      )}
      <span className={`${BLOCK}__text`}>{children}</span>
      {SuffixIcon && (
        <SuffixIcon
          {...iconAfterProps}
          height={iconAfterProps?.height ?? iconSizes[size]}
          className={clsx(`${BLOCK}__icon`, iconAfterProps?.className)}
          data-testid="suffix-icon"
        />
      )}
    </Component>
  );
}
