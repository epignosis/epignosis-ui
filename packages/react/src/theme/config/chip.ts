import { colors } from "@epignosis_llc/ui-tokens";

// gnosis computes the background as Color(primary.lightest).alpha(0.25).string().
// Our tokens already expose that exact value as primary.lightest25.
const chip = {
  backgroundColor: colors.primary.lightest25,
  color: colors.black,
} as const;

export default chip;
