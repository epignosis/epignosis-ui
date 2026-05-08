import type { HTMLAttributes } from "react";
import { useTheme, type Theme } from "@emotion/react";
import { ClipLoader, PulseLoader } from "react-spinners";
import clsx from "clsx";
import { container } from "./styles";

export type LoaderSize = "md" | "lg";
export type LoaderType = "pulse" | "clip";

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Stretch the wrapper to viewport height for full-screen loading states. */
  fullScreen?: boolean;
  size?: LoaderSize;
  type?: LoaderType;
  /** Override the spinner color. Defaults to `theme.loader.color`. */
  color?: string;
};

const SPINNER_SIZE: Record<LoaderType, Record<LoaderSize, string>> = {
  pulse: { md: "0.375rem", lg: "0.75rem" },
  clip: { md: "1.5rem", lg: "2rem" },
};

const SPINNER_MARGIN: Record<LoaderType, Record<LoaderSize, string>> = {
  pulse: { md: "0.0625rem", lg: "0.625rem" },
  clip: { md: "0.5rem", lg: "0.5rem" },
};

const BLOCK = "eg-loader";

export default function Loader({
  fullScreen = false,
  size = "lg",
  type = "pulse",
  color,
  className,
  ...rest
}: LoaderProps) {
  const theme = useTheme() as Theme;
  const Spinner = type === "pulse" ? PulseLoader : ClipLoader;
  const resolvedColor = color ?? theme.loader.color;

  return (
    <div
      css={() => container({ fullScreen })}
      data-testid="loader"
      className={clsx(BLOCK, `${BLOCK}--${type}`, `${BLOCK}--${size}`, className)}
      {...rest}
    >
      <Spinner
        color={resolvedColor}
        size={SPINNER_SIZE[type][size]}
        margin={SPINNER_MARGIN[type][size]}
        className={`${BLOCK}__spinner`}
      />
    </div>
  );
}
