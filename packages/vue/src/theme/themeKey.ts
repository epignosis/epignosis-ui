import type { InjectionKey } from "vue";
import type { EpignosisTheme } from "./types";

export const themeKey: InjectionKey<EpignosisTheme> = Symbol("epignosis-theme");
