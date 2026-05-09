import type { ReactNode } from "react";
import Tippy, { type TippyProps } from "@tippyjs/react/headless";
import { tooltipContainer } from "./styles";

export type TooltipProps = TippyProps & {
  as?:
    | "div"
    | "span"
    | "li"
    | "section"
    | "article"
    | "header"
    | "footer"
    | "nav"
    | "aside"
    | "main"
    | "ul"
    | "ol"
    | "table"
    | "tbody"
    | "thead"
    | "tfoot"
    | "tr"
    | "td"
    | "th"
    | "figure"
    | "figcaption"
    | "form"
    | "fieldset";
  parentProps?: object;
  content: TippyProps["content"];
  maxWidth?: number;
  showArrow?: boolean;
  borderColor?: string;
};

export default function Tooltip({
  parentProps,
  children,
  content,
  as: Tag = "div",
  placement = "top",
  maxWidth = 350,
  interactive = true,
  showArrow = true,
  borderColor,
  ...rest
}: TooltipProps) {
  const tagProps = { role: "tooltip" as const, ...parentProps };

  return (
    <Tippy
      placement={placement}
      interactive={interactive}
      appendTo={document.body}
      touch={["hold", 300]}
      render={(attrs): ReactNode => (
        <div
          className="eg-tooltip"
          role="alert"
          css={(theme) => tooltipContainer(maxWidth, theme, borderColor)}
          {...attrs}
        >
          {content}
          {showArrow && (
            <div className="eg-tooltip__arrow" data-testid="tooltip-arrow" data-popper-arrow />
          )}
        </div>
      )}
      {...rest}
    >
      <Tag {...tagProps}>{children}</Tag>
    </Tippy>
  );
}
