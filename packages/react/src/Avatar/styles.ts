import { css, type SerializedStyles } from "@emotion/react";
import { typography } from "@epignosis_llc/ui-tokens";
import type { AvatarSize } from "./Avatar";

const sizes: Record<AvatarSize, string> = {
  xs: "1.875rem",
  sm: "2.5rem",
  md: "3.75rem",
  lg: "5rem",
  xl: "7.5rem",
};

const svgSizes: Record<AvatarSize, string> = {
  xs: "1rem",
  sm: "1.25rem",
  md: "1.625rem",
  lg: "2rem",
  xl: "3rem",
};

// Avatar `lg`/`xl` reference gnosis's typeScale `3xl` (1.625rem) and `4xl`
// (1.8125rem). Our tokens use a different scale (`3xl` = 2.125rem, no `4xl`),
// so these two stay literal to preserve the gnosis visual.
const fontSizes: Record<AvatarSize, string> = {
  xs: typography.fontSize.xs,
  sm: typography.fontSize.sm,
  md: typography.fontSize.lg,
  lg: "1.625rem",
  xl: "1.8125rem",
};

export const avatar = ({
  size,
  bgColor,
}: {
  size: AvatarSize;
  bgColor: string;
}): SerializedStyles => css`
  display: block;
  margin: 0;

  .eg-avatar__image {
    display: block;
    border-radius: 50%;
    height: ${sizes[size]};
    width: ${sizes[size]};
  }

  .eg-avatar__fallback {
    height: ${sizes[size]};
    width: ${sizes[size]};
    font-size: ${fontSizes[size]};
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: ${bgColor};
    color: white;
    border-radius: 50%;

    svg {
      height: ${svgSizes[size]};
    }
  }
`;
