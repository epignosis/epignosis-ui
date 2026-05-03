import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h } from "vue";
import Button from "./Button.vue";

// Sample SVG icon mirroring @epignosis_llc/gnosis's calendar icon
// (legacy/calendar.svg — 32×32 viewBox, ~14×16 visible content).
const CalendarIcon = defineComponent({
  name: "CalendarIcon",
  props: {
    height: { type: Number, default: 30 },
  },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          height: props.height,
          viewBox: "0 0 32 32",
          "aria-hidden": "true",
        },
        [
          h("path", {
            fill: "currentColor",
            d: "M13.75,10h4.5v-1.25c0-.41,.33-.75,.75-.75s.75,.34,.75,.75v1.25h1.25c1.1,0,2,.9,2,2v10c0,1.1-.9,2-2,2H11c-1.1,0-2-.9-2-2V12c0-1.1,.9-2,2-2h1.25v-1.25c0-.41,.33-.75,.75-.75s.75,.34,.75,.75v1.25Zm-3.25,5.75h2.5v-1.75h-2.5v1.75Zm0,1.5v2h2.5v-2h-2.5Zm4,0v2h3v-2h-3Zm4.5,0v2h2.5v-2h-2.5Zm2.5-3.25h-2.5v1.75h2.5v-1.75Zm0,6.75h-2.5v1.75h2c.27,0,.5-.23,.5-.5v-1.25Zm-4,0h-3v1.75h3v-1.75Zm-4.5,0h-2.5v1.25c0,.27,.22,.5,.5,.5h2v-1.75Zm4.5-6.75h-3v1.75h3v-1.75Z",
          }),
        ],
      );
  },
});

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "danger",
        "success",
        "primaryLight",
        "primaryDarker",
        "white",
        "orange",
      ],
    },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    block: { control: "boolean" },
    noGutters: { control: "boolean" },
    rounded: { control: "boolean" },
    underlined: { control: "boolean" },
    active: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: {
    disabled: false,
    isLoading: false,
    block: false,
    noGutters: false,
    rounded: false,
    underlined: false,
    active: false,
    as: "button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type StoryArgs = Record<string, unknown> & { text?: string; style?: Record<string, string> };
type Story = StoryObj<typeof meta>;

// 3 rows (sm / md / lg) × 4 columns (solid / outline / ghost / link).
// Mirrors gnosis's Storybook arrangement.
const renderTemplate = (args: StoryArgs) => ({
  components: { Button },
  setup: () => {
    const { text, style, ...buttonArgs } = args;
    return { args: buttonArgs, text: text ?? "", containerStyle: style ?? {} };
  },
  template: `
    <div :style="containerStyle">
      <div style="margin-bottom: 16px">
        <Button v-bind="args" size="sm">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="sm" variant="outline">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="sm" variant="ghost">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="sm" variant="link">{{ text }}</Button>
      </div>
      <div style="margin-bottom: 16px">
        <Button v-bind="args">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" variant="outline">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" variant="ghost">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" variant="link">{{ text }}</Button>
      </div>
      <div style="margin-bottom: 16px">
        <Button v-bind="args" size="lg">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="lg" variant="outline">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="lg" variant="ghost">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="lg" variant="link">{{ text }}</Button>
      </div>
    </div>
  `,
});

// White needs the dark backdrop only behind the solid (left-most) buttons,
// since the other variants have transparent backgrounds.
const renderWhiteTemplate = (args: StoryArgs) => ({
  components: { Button },
  setup: () => {
    const { text, style, ...buttonArgs } = args;
    return { args: buttonArgs, text: text ?? "", containerStyle: style ?? {} };
  },
  template: `
    <div>
      <div style="margin-bottom: 16px">
        <div :style="containerStyle">
          <Button v-bind="args" size="sm">{{ text }}</Button>
        </div>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="sm" variant="outline">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="sm" variant="ghost">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="sm" variant="link">{{ text }}</Button>
      </div>
      <div style="margin-bottom: 16px">
        <div :style="containerStyle">
          <Button v-bind="args">{{ text }}</Button>
        </div>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" variant="outline">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" variant="ghost">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" variant="link">{{ text }}</Button>
      </div>
      <div style="margin-bottom: 16px">
        <div :style="containerStyle">
          <Button v-bind="args" size="lg">{{ text }}</Button>
        </div>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="lg" variant="outline">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="lg" variant="ghost">{{ text }}</Button>
        <span style="margin-right: 16px"></span>
        <Button v-bind="args" size="lg" variant="link">{{ text }}</Button>
      </div>
    </div>
  `,
});

export const Primary: Story = {
  render: renderTemplate,
  args: { color: "primary", text: "Primary" } as StoryArgs,
};

export const Secondary: Story = {
  render: renderTemplate,
  args: { color: "secondary", text: "Secondary" } as StoryArgs,
};

export const Danger: Story = {
  render: renderTemplate,
  args: { color: "danger", text: "Danger" } as StoryArgs,
};

export const Success: Story = {
  render: renderTemplate,
  args: { color: "success", text: "Success" } as StoryArgs,
};

export const PrimaryLight: Story = {
  render: renderTemplate,
  args: {
    color: "primaryLight",
    text: "Primary light",
    style: {
      background: "var(--color-primary-darker)",
      padding: "1.25rem 1.25rem 0.25rem",
    },
  } as StoryArgs,
};

export const PrimaryDarker: Story = {
  render: renderTemplate,
  args: { color: "primaryDarker", text: "Primary darker" } as StoryArgs,
};

export const Orange: Story = {
  render: renderTemplate,
  args: { color: "orange", text: "Orange" } as StoryArgs,
};

export const White: Story = {
  render: renderWhiteTemplate,
  args: {
    color: "white",
    text: "White",
    style: {
      background: "var(--color-primary-darker)",
      padding: "0.75rem",
      display: "inline-block",
    },
  } as StoryArgs,
};

export const WithIconBefore: Story = {
  render: renderTemplate,
  args: {
    color: "primary",
    text: "Icon prefix",
    iconBefore: CalendarIcon,
  } as StoryArgs,
};

export const WithIconAfter: Story = {
  render: renderTemplate,
  args: {
    color: "primary",
    text: "Icon suffix",
    iconAfter: CalendarIcon,
  } as StoryArgs,
};
