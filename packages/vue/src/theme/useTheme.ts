import { inject } from "vue";
import { themeKey } from "./themeKey";
import { epignosisTheme } from "./theme";
import type { EpignosisTheme } from "./types";

/**
 * Returns the current theme. Falls back to the default `epignosisTheme` when
 * a `<ThemeProvider>` ancestor is not present, so components remain usable in
 * isolation (e.g. snapshot tests, ad-hoc usage).
 */
export function useTheme(): EpignosisTheme {
  return inject(themeKey, epignosisTheme);
}
