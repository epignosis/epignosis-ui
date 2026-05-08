import type { Meta, StoryObj } from "@storybook/react-vite";
import Loader, { type LoaderProps } from "./Loader";

const meta = {
  title: "Components/Loader",
  component: Loader,
  argTypes: {
    type: { control: "select", options: ["pulse", "clip"] },
    size: { control: "select", options: ["md", "lg"] },
    fullScreen: { control: "boolean" },
    color: { control: "color" },
  },
  args: {
    type: "pulse",
    size: "lg",
    fullScreen: false,
  },
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<LoaderProps>;

export const Pulse: Story = { args: { type: "pulse" } };
export const Clip: Story = { args: { type: "clip" } };
export const Small: Story = { args: { type: "pulse", size: "md" } };
export const Custom: Story = { args: { type: "pulse", color: "tomato" } };
