import type { Preview } from "@storybook/vue3-vite";
import ThemeProvider from "../src/theme/ThemeProvider.vue";
import "@epignosis_llc/ui-tokens/tokens.css";

const preview: Preview = {
  decorators: [
    () => ({
      components: { ThemeProvider },
      template: "<ThemeProvider><story /></ThemeProvider>",
    }),
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
