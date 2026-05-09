import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "../Button/Button";
import Tooltip, { type TooltipProps } from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Floating tooltip built on @tippyjs/react (headless). Wraps any element and shows a styled panel on hover. Supports all Tippy placement options, optional arrow, custom max-width, and custom border color.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ marginTop: 150, display: "flex", justifyContent: "center" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    as: {
      control: "select",
      options: ["div", "span"],
    },
  },
  args: {
    placement: "top",
    content: "This is a tooltip",
    as: "div",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<TooltipProps>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const WithMaxWidth: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
  args: {
    maxWidth: 650,
    content:
      "Once upon a midnight dreary, as I pondered, weak and weary, over many a quaint and curious volume of forgotten lore—while I nodded, nearly napping, suddenly there came a tapping, as of someone gently rapping, rapping at my chamber door.",
  },
};

export const WithNoArrow: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
  args: {
    content: "Tooltip without arrow",
    showArrow: false,
  },
};

export const WithBorderColor: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
  args: {
    content: "Tooltip with custom border",
    borderColor: "red",
  },
};
