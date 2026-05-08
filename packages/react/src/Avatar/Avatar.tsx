import type { HTMLAttributes, ReactNode } from "react";
import { colors } from "@epignosis_llc/ui-tokens";
import clsx from "clsx";
import { avatar } from "./styles";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarBaseProps = HTMLAttributes<HTMLElement> & {
  size?: AvatarSize;
  className?: string;
};

type ImageProps = {
  src: string;
  alt?: string;
  children?: never;
  bgColor?: never;
};

type ContentProps = {
  src?: never;
  alt?: never;
  children: ReactNode;
  /** Background of the fallback container. Defaults to `colors.orange.base`. */
  bgColor?: string;
};

export type AvatarProps = AvatarBaseProps & (ImageProps | ContentProps);

const BLOCK = "eg-avatar";

export default function Avatar({
  src,
  alt,
  size = "sm",
  bgColor = colors.orange.base,
  children,
  className,
  ...rest
}: AvatarProps) {
  return (
    <figure
      css={() => avatar({ size, bgColor })}
      className={clsx(BLOCK, `${BLOCK}--${size}`, className)}
      {...rest}
    >
      {Boolean(src) && <img className={`${BLOCK}__image`} src={src} alt={alt} />}
      {children !== undefined && (
        <span className={`${BLOCK}__fallback`} data-testid="avatar-children-container">
          {children}
        </span>
      )}
    </figure>
  );
}
