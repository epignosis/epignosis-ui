<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";
import { useTheme } from "../theme/useTheme";
import { iconSizes, roundDimensions, type IconType } from "./constants";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "primaryLight"
  | "primaryDarker"
  | "white"
  | "orange";

export type ButtonVariant = "solid" | "outline" | "ghost" | "link";

export type ButtonSize = "sm" | "md" | "lg";

export type { IconType };

export interface ButtonProps {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** When true, button is disabled and a spinner replaces the leading position. */
  isLoading?: boolean;
  /** Stretches the button to fill its container's width. */
  block?: boolean;
  /** Tightens horizontal padding and shrinks icon spacing. */
  noGutters?: boolean;
  /** Renders the button as a circle (square dimensions per size). */
  rounded?: boolean;
  /** Underlines the inner text. */
  underlined?: boolean;
  /** Forces the active visual state (mirrors `:active`). */
  active?: boolean;
  iconBefore?: IconType;
  iconAfter?: IconType;
  /** HTML tag name or Vue component. Defaults to "button". */
  as?: string | Component;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  color: "primary",
  variant: "solid",
  size: "md",
  disabled: false,
  isLoading: false,
  block: false,
  noGutters: false,
  rounded: false,
  underlined: false,
  active: false,
  as: "button",
});

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const theme = useTheme();

const isNativeButton = computed(() => props.as === "button");
const isDisabled = computed(() => props.disabled || props.isLoading);
const roundDim = computed(() => roundDimensions[props.size]);

// Inline CSS custom properties bridge JS theme values into the scoped
// stylesheet so state pseudo-classes (hover/focus/active) can use them.
const cssVars = computed(() => {
  const c = theme.button[props.color];
  const d = theme.button.disabled;
  return {
    "--btn-bg": c.default.background,
    "--btn-color": c.default.color,
    "--btn-border": c.default.borderColor,
    "--btn-hover-bg": c.hover.background,
    "--btn-hover-color": c.hover.color,
    "--btn-hover-border": c.hover.borderColor,
    "--btn-active-bg": c.active.background,
    "--btn-active-color": c.active.color,
    "--btn-active-border": c.active.borderColor,
    "--btn-outline-color": c.outline.color,
    "--btn-outline-border": c.outline.borderColor,
    "--btn-ghost-color": c.ghost.color,
    "--btn-ghost-bg": c.ghost.background,
    "--btn-ghost-hover-color": c.ghost.hoverColor,
    "--btn-link-color": c.link.color,
    "--btn-link-hover-color": c.link.hoverColor,
    "--btn-disabled-bg": d.background,
    "--btn-disabled-color": d.color,
    "--btn-disabled-border": d.borderColor,
    "--btn-round-dim": roundDim.value,
  };
});

const classes = computed(() => [
  "eg-button",
  `eg-button--${props.variant}`,
  `eg-button--${props.color}`,
  `eg-button--${props.size}`,
  props.iconBefore ? "eg-button--icon-before" : null,
  props.iconAfter ? "eg-button--icon-after" : null,
  isDisabled.value ? "eg-button--disabled" : null,
  props.isLoading ? "eg-button--loading" : null,
  props.block ? "eg-button--block" : null,
  props.noGutters ? "eg-button--no-gutters" : null,
  props.rounded ? "eg-button--rounded" : null,
  props.underlined ? "eg-button--underlined" : null,
  props.active ? "eg-button--active" : null,
]);
</script>

<template>
  <component
    :is="props.as"
    :class="classes"
    :style="cssVars"
    :type="isNativeButton ? 'button' : undefined"
    :disabled="isNativeButton ? isDisabled : undefined"
    @click="$emit('click', $event)"
  >
    <span v-if="props.isLoading" class="eg-button__spinner" aria-hidden="true" />
    <component
      v-if="props.iconBefore"
      :is="props.iconBefore"
      :height="iconSizes[props.size]"
      class="eg-button__icon"
      data-testid="prefix-icon"
    />
    <span class="eg-button__text"><slot /></span>
    <component
      v-if="props.iconAfter"
      :is="props.iconAfter"
      :height="iconSizes[props.size]"
      class="eg-button__icon"
      data-testid="suffix-icon"
    />
  </component>
</template>

<style scoped>
@keyframes eg-button-spin {
  to {
    transform: rotate(360deg);
  }
}

.eg-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--border-radius-sm);
  line-height: 1.125rem;
  cursor: pointer;
  transition:
    background-color var(--transition-fast) ease-in,
    color var(--transition-fast) ease-in,
    border-color var(--transition-fast) ease-in;
}

.eg-button__text {
  display: inline-flex;
}

.eg-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: eg-button-spin 0.8s linear infinite;
  margin-inline-end: 0.5rem;
  flex-shrink: 0;
}

/* Sizes */
.eg-button--sm {
  font-size: var(--font-size-sm);
  height: 2rem;
  min-width: 2rem;
  padding: 0 1rem;
}
.eg-button--md {
  font-size: var(--font-size-sm);
  height: 2.5rem;
  min-width: 2.5rem;
  padding: 0 1.75rem;
}
.eg-button--lg {
  font-size: var(--font-size-lg);
  height: 3rem;
  min-width: 3rem;
  padding: 0 3rem;
}

/* Variant: solid */
.eg-button--solid {
  background-color: var(--btn-bg);
  color: var(--btn-color);
  border: 1px solid var(--btn-border);
}
.eg-button--solid:hover:not(:disabled):not(.eg-button--disabled),
.eg-button--solid:focus-visible:not(:disabled):not(.eg-button--disabled) {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-color);
  border-color: var(--btn-hover-border);
}
.eg-button--solid:active:not(:disabled):not(.eg-button--disabled),
.eg-button--solid.eg-button--active:not(:disabled):not(.eg-button--disabled) {
  background-color: var(--btn-active-bg);
  color: var(--btn-active-color);
  border-color: var(--btn-active-border);
}

/* Variant: outline */
.eg-button--outline {
  background-color: transparent;
  color: var(--btn-outline-color);
  border: 1px solid var(--btn-outline-border);
}
.eg-button--outline:hover:not(:disabled):not(.eg-button--disabled),
.eg-button--outline:focus-visible:not(:disabled):not(.eg-button--disabled) {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-color);
  border-color: var(--btn-hover-border);
}
.eg-button--outline:active:not(:disabled):not(.eg-button--disabled),
.eg-button--outline.eg-button--active:not(:disabled):not(.eg-button--disabled) {
  background-color: var(--btn-active-bg);
  color: var(--btn-active-color);
  border-color: var(--btn-active-border);
}

/* Variant: ghost */
.eg-button--ghost {
  background-color: transparent;
  border: none;
  color: var(--btn-ghost-color);
}
.eg-button--ghost:hover:not(:disabled):not(.eg-button--disabled),
.eg-button--ghost:active:not(:disabled):not(.eg-button--disabled),
.eg-button--ghost.eg-button--active:not(:disabled):not(.eg-button--disabled) {
  background-color: var(--btn-ghost-bg);
  color: var(--btn-ghost-hover-color);
}

/* Variant: link */
.eg-button--link {
  background-color: transparent;
  border: none;
  color: var(--btn-link-color);
}
.eg-button--link:hover:not(:disabled):not(.eg-button--disabled),
.eg-button--link:active:not(:disabled):not(.eg-button--disabled),
.eg-button--link.eg-button--active:not(:disabled):not(.eg-button--disabled) {
  color: var(--btn-link-hover-color);
}

/* Disabled */
.eg-button:disabled,
.eg-button.eg-button--disabled,
.eg-button:disabled:hover,
.eg-button.eg-button--disabled:hover,
.eg-button:disabled:focus,
.eg-button.eg-button--disabled:focus,
.eg-button:disabled:active,
.eg-button.eg-button--disabled:active {
  background-color: var(--btn-disabled-bg);
  color: var(--btn-disabled-color);
  border-color: var(--btn-disabled-border);
  cursor: not-allowed;
}

/* Icon spacing — sm keeps base padding; md/lg shrink icon-side. */
.eg-button--icon-before {
  padding-block: 0;
}
.eg-button--icon-before.eg-button--md {
  padding-inline: 1.25rem 1.75rem;
}
.eg-button--icon-before.eg-button--lg {
  padding-inline: 1.875rem 3rem;
}
.eg-button--icon-before .eg-button__icon {
  margin-inline-end: 0.5rem;
}

.eg-button--icon-after {
  padding-block: 0;
}
.eg-button--icon-after.eg-button--md {
  padding-inline: 1.75rem 1.25rem;
}
.eg-button--icon-after.eg-button--lg {
  padding-inline: 3rem 1.875rem;
}
.eg-button--icon-after .eg-button__icon {
  margin-inline-start: 0.5rem;
}

/* block — full width */
.eg-button--block {
  width: 100%;
}

/* noGutters — tighter padding (overrides standard size padding) */
.eg-button--no-gutters:not(.eg-button--rounded):not(.eg-button--icon-before):not(
    .eg-button--icon-after
  ) {
  padding: 0 0.25rem;
}
.eg-button--no-gutters.eg-button--icon-before {
  padding-inline: 0.25rem 0.75rem;
}
.eg-button--no-gutters.eg-button--icon-before .eg-button__icon {
  margin-inline-end: 0.25rem;
}
.eg-button--no-gutters.eg-button--icon-after {
  padding-inline: 0.75rem 0.25rem;
}
.eg-button--no-gutters.eg-button--icon-after .eg-button__icon {
  margin-inline-start: 0.25rem;
}

/* rounded — circle, square dimensions per size */
.eg-button--rounded {
  width: var(--btn-round-dim);
  height: var(--btn-round-dim);
  min-width: var(--btn-round-dim);
  padding: 0;
  border-radius: 50%;
}

/* underlined — text decoration */
.eg-button--underlined .eg-button__text {
  text-decoration: underline;
}
</style>
