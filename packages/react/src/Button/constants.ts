import type { ComponentType, SVGProps } from "react";

export const iconSizes = {
  sm: 28,
  md: 30,
  lg: 32,
} as const;

// Square dimensions used when the `rounded` prop is set. Matches gnosis.
export const roundDimensions = {
  sm: "3rem",
  md: "3.5rem",
  lg: "5rem",
} as const;

/**
 * Component-shaped icon (typically an SVG-as-component). Receives `height`
 * (number from `iconSizes[size]`), `className` (always `"icon"`), and
 * `data-testid` from the Button. Any additional SVG props are passed through.
 */
export type IconType = ComponentType<
  {
    height?: number;
    className?: string;
    "data-testid"?: string;
  } & Omit<SVGProps<SVGSVGElement>, "height" | "className" | "ref">
>;
