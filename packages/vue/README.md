# @epignosis_llc/ui-vue

Vue 3 component library for the Epignosis design system. Ships compiled ESM + CJS + `.d.ts` and a CSS bundle.

Built on top of [`@epignosis_llc/ui-tokens`](https://www.npmjs.com/package/@epignosis_llc/ui-tokens). For background on the design system, see the [main repository](https://github.com/epignosis/epignosis-ui).

## Install

```bash
pnpm add @epignosis_llc/ui-vue @epignosis_llc/ui-tokens
```

Peer dependency: `vue ^3.5`.

## Usage

```vue
<script setup lang="ts">
import { Button } from "@epignosis_llc/ui-vue";
import "@epignosis_llc/ui-tokens/tokens.css";
</script>

<template>
  <Button>Hello</Button>
</template>
```
