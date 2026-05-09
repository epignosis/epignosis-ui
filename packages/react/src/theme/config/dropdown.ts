import { colors } from "@epignosis_llc/ui-tokens";

const dropdown = {
  boxShadowColor: colors.secondary.light,
  backgroundColor: colors.white,
  emptyStateColor: colors.secondary.base,
  hoverBackgroundColor: colors.secondary.lighter,
  borderBottomColor: colors.secondary.lighter,
  textColor: colors.black,
  disabledColor: colors.secondary.light,
} as const;

export default dropdown;
