import type { StorybookConfig } from "@storybook/html-vite";

const isStatic = process.env.STORYBOOK_STATIC === "true";

const url = (port: number, path: string) =>
  isStatic ? path : `http://localhost:${port}`;

const config: StorybookConfig = {
  stories: [],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  refs: {
    react: {
      title: "React",
      url: url(6006, "./react"),
    },
    vue: {
      title: "Vue",
      url: url(6007, "./vue"),
    },
    icons: {
      title: "Icons",
      url: url(6008, "./icons"),
    },
    tokens: {
      title: "Tokens",
      url: url(6009, "./tokens"),
    },
  },
};

export default config;
