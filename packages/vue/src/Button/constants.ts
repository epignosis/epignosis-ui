import type { Component } from "vue";

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
 * (number from `iconSizes[size]`) and `class` (always `"eg-button__icon"`)
 * from the Button. Use any Vue component that accepts these props.
 */
export type IconType = Component;
