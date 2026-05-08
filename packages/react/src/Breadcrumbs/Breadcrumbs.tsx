import { useEffect, useState } from "react";
import type { Theme } from "@emotion/react";
import { ArrowLeftChevronSVG, ArrowRightChevronSVG } from "@epignosis_llc/ui-icons";
import clsx from "clsx";
import { breadcrumbs as breadcrumbsStyles } from "./styles";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** When true, the last item renders as the current page (non-interactive, distinct color). */
  highlightActivePage?: boolean;
  navAriaLabel?: string;
  linkAriaLabel?: (label: string) => string;
};

const BLOCK = "eg-breadcrumbs";

export default function Breadcrumbs({
  items,
  highlightActivePage = false,
  navAriaLabel = "Breadcrumb navigation",
  linkAriaLabel = (label) => `Breadcrumb link to ${label}`,
}: BreadcrumbsProps) {
  // SSR-safe direction detection. `document` is browser-only; on the server
  // we render with the LTR chevron, then reconcile on the client if needed.
  const [isRtl, setIsRtl] = useState(false);
  useEffect(() => {
    setIsRtl(document.dir === "rtl");
  }, []);

  const SeparatorIcon = isRtl ? ArrowLeftChevronSVG : ArrowRightChevronSVG;

  return (
    <nav aria-label={navAriaLabel} className={BLOCK}>
      <ul
        data-testid="breadcrumbs"
        className={`${BLOCK}__list`}
        css={(theme: Theme) => breadcrumbsStyles(theme)}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = highlightActivePage && isLast;

          return (
            <li
              key={item.label}
              data-testid="breadcrumb-item"
              className={clsx(`${BLOCK}__item`, {
                [`${BLOCK}__item--current`]: isCurrent,
              })}
            >
              <a
                aria-label={linkAriaLabel(item.label)}
                aria-current={isCurrent ? "page" : undefined}
                href={item.href}
                onClick={item.onClick}
                className={clsx(`${BLOCK}__link`, {
                  [`${BLOCK}__link--current`]: isCurrent,
                  [`${BLOCK}__link--empty`]: !item.href,
                })}
              >
                {item.label}
              </a>

              {!isLast && (
                <span aria-hidden="true" className={`${BLOCK}__separator`}>
                  <SeparatorIcon height={32} data-testid="arrow-icon" />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
