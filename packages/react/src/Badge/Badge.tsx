import type { HTMLAttributes, ReactNode } from "react";
import type { Theme } from "@emotion/react";
import clsx from "clsx";
import { container } from "./styles";

export type BadgeSize = "md" | "lg";
export type BadgeOffset = { top: string; right: string };

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  size?: BadgeSize;
  /** Where the indicator sits relative to its container. Defaults to `{ top: "-8px", right: "-15px" }`. */
  offset?: BadgeOffset;
  /** Optional text rendered inside the indicator (counts, "NEW", etc.). */
  badgeContent?: string;
  /** Attributes forwarded to the wrapping container element. */
  containerAttrs?: HTMLAttributes<HTMLDivElement>;
  /** Adds a pulsing halo animation around the indicator. */
  withPulse?: boolean;
  children?: ReactNode;
};

const BLOCK = "eg-badge";
const DEFAULT_OFFSET: BadgeOffset = { top: "-8px", right: "-15px" };

export default function Badge({
  size = "md",
  offset = DEFAULT_OFFSET,
  badgeContent,
  containerAttrs,
  withPulse = false,
  children,
  className,
  ...rest
}: BadgeProps) {
  const hasContent = Boolean(badgeContent);
  const isBigContent = hasContent && (badgeContent?.length ?? 0) >= 3;

  const containerClassName = clsx(
    BLOCK,
    `${BLOCK}--${size}`,
    {
      [`${BLOCK}--has-content`]: hasContent,
      [`${BLOCK}--big-content`]: isBigContent,
    },
    containerAttrs?.className,
  );

  const indicatorClassName = clsx(
    `${BLOCK}__indicator`,
    {
      [`${BLOCK}__indicator--pulse`]: withPulse,
    },
    className,
  );

  return (
    <div
      css={(theme: Theme) => container(theme, { size, offset })}
      {...containerAttrs}
      className={containerClassName}
    >
      <span className={indicatorClassName} {...rest}>
        {badgeContent}
      </span>
      {children}
    </div>
  );
}
