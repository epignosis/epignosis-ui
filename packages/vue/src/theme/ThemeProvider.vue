<script setup lang="ts">
import { provide } from "vue";
import { themeKey } from "./themeKey";
import { epignosisTheme } from "./theme";
import type { EpignosisTheme } from "./types";

const props = withDefaults(
  defineProps<{
    theme?: EpignosisTheme;
  }>(),
  {
    theme: () => epignosisTheme as EpignosisTheme,
  },
);

provide(themeKey, props.theme);
</script>

<template>
  <slot />
</template>
