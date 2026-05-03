/*
 * Button theme config — port of @epignosis_llc/gnosis's src/theme/default/config/button.ts.
 *
 * Each color/state value is sourced from @epignosis-ui/tokens (the JS objects),
 * NOT CSS custom properties. This keeps the theme self-contained — no dependency
 * on tokens.css being loaded at runtime.
 *
 * Three alpha-modulated values are hardcoded as rgba strings because gnosis
 * computes them at runtime via the `color` library and they aren't in the tokens:
 *   - Color(primary.darker).alpha(0.9)  → rgba(0, 42, 103, 0.9)
 *   - Color(primary.darker).alpha(0.15) → rgba(0, 42, 103, 0.15)
 *   - Color(white).alpha(0.7)           → rgba(255, 255, 255, 0.7)
 */
import { colors, borderRadius } from "@epignosis-ui/tokens";

const button = {
  disabled: {
    background: colors.secondary.lighter,
    color: colors.secondary.base,
    borderColor: colors.secondary.base,
  },
  primary: {
    default: {
      background: colors.primary.base,
      borderColor: colors.primary.base,
      color: colors.white,
      borderRadius: borderRadius.sm,
    },
    hover: {
      background: colors.primary.light,
      borderColor: colors.primary.light,
      color: colors.white,
    },
    active: {
      background: colors.primary.base,
      borderColor: colors.primary.base,
      color: colors.white,
    },
    ghost: {
      color: colors.primary.base,
      background: colors.primary.lightest25,
      hoverColor: colors.primary.base,
    },
    outline: {
      color: colors.primary.base,
      borderColor: colors.primary.base,
    },
    link: {
      color: colors.primary.base,
      hoverColor: colors.primary.light,
    },
  },
  secondary: {
    default: {
      background: colors.secondary.lighter,
      borderColor: colors.secondary.lighter,
      color: colors.black,
    },
    hover: {
      background: colors.secondary.base,
      borderColor: colors.secondary.base,
      color: colors.black,
    },
    active: {
      background: colors.secondary.lighter,
      borderColor: colors.secondary.lighter,
      color: colors.black,
    },
    ghost: {
      color: colors.black,
      background: colors.secondary.light,
      hoverColor: colors.black,
    },
    outline: {
      color: colors.secondary.darker,
      borderColor: colors.secondary.dark,
    },
    link: {
      color: colors.black,
      hoverColor: colors.secondary.base,
    },
  },
  danger: {
    default: {
      background: colors.red.base,
      borderColor: colors.red.base,
      color: colors.white,
    },
    hover: {
      background: colors.red.light,
      borderColor: colors.red.light,
      color: colors.white,
    },
    active: {
      background: colors.red.base,
      borderColor: colors.red.base,
      color: colors.white,
    },
    ghost: {
      color: colors.red.base,
      background: colors.red.light,
      hoverColor: colors.white,
    },
    outline: {
      color: colors.red.base,
      borderColor: colors.red.base,
    },
    link: {
      color: colors.red.base,
      hoverColor: colors.red.lightest,
    },
  },
  success: {
    default: {
      background: colors.green.base,
      borderColor: colors.green.base,
      color: colors.white,
    },
    hover: {
      background: colors.green.light,
      borderColor: colors.green.light,
      color: colors.white,
    },
    active: {
      background: colors.green.base,
      borderColor: colors.green.base,
      color: colors.white,
    },
    ghost: {
      color: colors.green.base,
      background: colors.green.light,
      hoverColor: colors.white,
    },
    outline: {
      color: colors.green.base,
      borderColor: colors.green.base,
    },
    link: {
      color: colors.green.base,
      hoverColor: colors.green.lightest,
    },
  },
  primaryLight: {
    default: {
      background: colors.primary.lightest25,
      borderColor: "transparent",
      color: colors.white,
    },
    hover: {
      background: colors.primary.lightest50,
      borderColor: "transparent",
      color: colors.white,
    },
    active: {
      background: colors.primary.lightest50,
      borderColor: colors.primary.lightest50,
      color: colors.white,
    },
    ghost: {
      color: colors.white,
      background: colors.primary.lightest50,
      hoverColor: colors.white,
    },
    outline: {
      color: colors.white,
      borderColor: colors.primary.lightest25,
    },
    link: {
      color: colors.white,
      hoverColor: "rgba(255, 255, 255, 0.7)",
    },
  },
  primaryDarker: {
    default: {
      background: colors.primary.darker,
      borderColor: colors.primary.darker,
      color: colors.white,
    },
    hover: {
      background: "rgba(0, 42, 103, 0.9)",
      borderColor: "rgba(0, 42, 103, 0.9)",
      color: colors.white,
    },
    active: {
      background: colors.primary.darker,
      borderColor: colors.primary.darker,
      color: colors.white,
    },
    ghost: {
      color: colors.primary.darker,
      background: "rgba(0, 42, 103, 0.15)",
      hoverColor: colors.primary.darker,
    },
    outline: {
      color: colors.primary.darker,
      borderColor: colors.primary.darker,
    },
    link: {
      color: colors.primary.darker,
      hoverColor: colors.primary.base,
    },
  },
  white: {
    default: {
      background: colors.white,
      borderColor: colors.white,
      color: colors.primary.darker,
    },
    hover: {
      background: colors.white,
      borderColor: colors.white,
      color: colors.primary.base,
    },
    active: {
      background: colors.white,
      borderColor: colors.white,
      color: colors.primary.base,
    },
    ghost: {
      color: colors.primary.darker,
      background: colors.white,
      hoverColor: colors.primary.base,
    },
    outline: {
      color: colors.primary.darker,
      borderColor: colors.white,
    },
    link: {
      color: colors.primary.darker,
      hoverColor: colors.primary.base,
    },
  },
  orange: {
    default: {
      background: colors.orange.base,
      borderColor: colors.orange.base,
      color: colors.black,
    },
    hover: {
      background: colors.orange.light,
      borderColor: colors.orange.light,
      color: colors.black,
    },
    active: {
      background: colors.orange.base,
      borderColor: colors.orange.base,
      color: colors.black,
    },
    ghost: {
      color: colors.orange.base,
      background: colors.orange.light,
      hoverColor: colors.black,
    },
    outline: {
      color: colors.black,
      borderColor: colors.orange.light,
    },
    link: {
      color: colors.orange.base,
      hoverColor: colors.primary.base,
    },
  },
} as const;

export default button;
