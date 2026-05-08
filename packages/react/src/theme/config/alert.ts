import { colors } from "@epignosis_llc/ui-tokens";

const alert = {
  closeBtnColor: colors.white,
  info: {
    background: colors.primary.lighter,
    borderColor: colors.primary.lighter,
    color: colors.white,
  },
  danger: {
    background: colors.red.base,
    borderColor: colors.red.base,
    color: colors.white,
  },
  success: {
    background: colors.green.base,
    borderColor: colors.green.base,
    color: colors.white,
  },
  warning: {
    background: colors.orange.base,
    borderColor: colors.orange.base,
    color: colors.white,
  },
} as const;

export default alert;
