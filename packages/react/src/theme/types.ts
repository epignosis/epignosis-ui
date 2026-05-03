import "@emotion/react";
import type { epignosisTheme } from "./theme";

export type EpignosisTheme = typeof epignosisTheme;

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends EpignosisTheme {}
}
