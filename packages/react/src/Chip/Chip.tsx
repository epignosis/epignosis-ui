import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import type { Theme } from "@emotion/react";
import { CloseSVG } from "@epignosis_llc/ui-icons";
import clsx from "clsx";
import type { IconType } from "../Button/constants";
import { chip as chipStyles } from "./styles";

export type ChipSize = "md" | "lg";

export type ChipProps = HTMLAttributes<HTMLDivElement> & {
  size?: ChipSize;
  /** When set, the chip behaves as a filter: `icon` shows by default, the
   *  close icon swaps in on hover. */
  icon?: IconType;
  /** Renders a leading button that, when clicked, fires `onClose`. */
  onClose?: (e: MouseEvent) => void;
  /** Aria-label for the close button. Defaults to "Close filter". */
  closeButtonAriaLabel?: string;
  /** Caps the inner label width in pixels; truncates with ellipsis. */
  maxWidth?: number;
  children: ReactNode;
};

const BLOCK = "eg-chip";

export default function Chip({
  size = "md",
  onClose,
  icon: Icon,
  style,
  closeButtonAriaLabel = "Close filter",
  maxWidth,
  className,
  children,
  ...rest
}: ChipProps) {
  const isFilterOn = Boolean(Icon);
  const maxWidthValue = maxWidth != null ? `${maxWidth}px` : "auto";
  // Native browser tooltip when text content overflows. Replaceable with our
  // own Tooltip component once that's ported.
  const nativeTitle = typeof children === "string" ? children : undefined;

  return (
    <div
      css={(theme: Theme) =>
        chipStyles(theme, { size, isFilterOn, maxWidth: maxWidthValue })
      }
      style={style}
      className={clsx(BLOCK, `${BLOCK}--${size}`, isFilterOn && `${BLOCK}--filter`, className)}
      {...rest}
    >
      {onClose && (
        <button
          type="button"
          data-testid="close-filter"
          onClick={onClose}
          aria-label={closeButtonAriaLabel}
          className={`${BLOCK}__button`}
        >
          {Icon && <Icon className={`${BLOCK}__icon`} data-testid="icon" />}
          <span className={`${BLOCK}__close`}>
            <CloseSVG height={16} />
          </span>
        </button>
      )}
      <div className={`${BLOCK}__label`} title={nativeTitle}>
        {children}
      </div>
    </div>
  );
}
