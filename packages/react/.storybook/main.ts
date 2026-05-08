import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  addons: ["@storybook/addon-docs"],
  typescript: {
    // react-docgen-typescript parses every component's TS types at startup
    // and is the most common cause of Storybook slowness on real projects.
    // The lighter JSX-based parser still produces controls for prop types;
    // it just doesn't pull in JSDoc descriptions.
    reactDocgen: "react-docgen",
  },
  async viteFinal(config) {
    // Force pre-bundling of the heavy workspace + third-party deps so they
    // land in a single esbuild pass at startup instead of being transformed
    // on demand. ui-icons especially: its published dist is ~1 MB.
    config.optimizeDeps ??= {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      "@epignosis_llc/ui-icons",
      "@epignosis_llc/ui-tokens",
      "react-spinners",
    ];
    return config;
  },
};

export default config;
