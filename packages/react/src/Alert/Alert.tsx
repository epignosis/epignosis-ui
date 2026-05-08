import type { HTMLAttributes, ReactNode } from "react";
import type { Theme } from "@emotion/react";
import clsx from "clsx";
import type { IconType } from "../Button/constants";
import { container } from "./styles";
import { CloseIcon, DangerIcon, InfoIcon, SuccessIcon, WarningIcon } from "./icons";

export type AlertType = "info" | "danger" | "success" | "warning";

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  type: AlertType;
  /** Optional override for the leading icon. Defaults to a built-in icon per `type`. */
  icon?: IconType;
  /** When provided, renders a trailing close button that invokes this on click. */
  onClose?: () => void;
  children: ReactNode;
};

const DEFAULT_ICONS: Record<AlertType, IconType> = {
  info: InfoIcon,
  danger: DangerIcon,
  success: SuccessIcon,
  warning: WarningIcon,
};

const BLOCK = "eg-alert";

export default function Alert({
  type,
  icon,
  onClose,
  children,
  className,
  ...rest
}: AlertProps) {
  const Icon = icon ?? DEFAULT_ICONS[type];

  return (
    <div
      css={(theme: Theme) => container(theme, { type })}
      className={clsx(BLOCK, `${BLOCK}--${type}`, className)}
      {...rest}
    >
      <Icon height={56} className={`${BLOCK}__icon`} data-testid="icon" />
      <article className={`${BLOCK}__body`}>{children}</article>
      {onClose && (
        <button
          type="button"
          aria-label="Close alert"
          onClick={onClose}
          className={`${BLOCK}__close`}
        >
          <CloseIcon height={32} />
        </button>
      )}
    </div>
  );
}
