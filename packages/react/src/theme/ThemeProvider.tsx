import { ThemeProvider as EmotionThemeProvider, type Theme } from "@emotion/react";
import type { ReactNode } from "react";
import { epignosisTheme } from "./theme";

export type ThemeProviderProps = {
  theme?: Theme;
  children: ReactNode;
};

export function ThemeProvider({ theme = epignosisTheme as Theme, children }: ThemeProviderProps) {
  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
}
