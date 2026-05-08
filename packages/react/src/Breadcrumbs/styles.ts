import { css, type SerializedStyles, type Theme } from "@emotion/react";
import { typography } from "@epignosis_llc/ui-tokens";

export const breadcrumbs = ({ breadcrumbs }: Theme): SerializedStyles => css`
  display: flex;
  align-items: center;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
  padding: 0;
  margin: 0;
  list-style: none;

  .eg-breadcrumbs__item {
    display: flex;
    align-items: center;
  }

  .eg-breadcrumbs__link {
    text-decoration: none;
    color: ${breadcrumbs.link};

    &.eg-breadcrumbs__link--current,
    &.eg-breadcrumbs__link--empty:not(.eg-breadcrumbs__link--current) {
      color: ${breadcrumbs.black};
      pointer-events: none;
    }
  }

  .eg-breadcrumbs__separator {
    display: flex;
    color: ${breadcrumbs.separator};
  }
`;
