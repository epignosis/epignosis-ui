import type { Meta, StoryObj } from "@storybook/react-vite";
import Badge, { type BadgeProps } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    size: { control: "select", options: ["md", "lg"] },
    withPulse: { control: "boolean" },
    badgeContent: { control: "text" },
  },
  args: {
    size: "md",
    withPulse: false,
    children: (
      <span style={{ padding: "0.5rem 0.75rem", border: "1px solid #ccc", borderRadius: 6 }}>
        Inbox
      </span>
    ),
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<BadgeProps>;

export const Dot: Story = { args: {} };
export const DotLarge: Story = { args: { size: "lg" } };
export const Numbered: Story = { args: { badgeContent: "3" } };
export const Overflow: Story = { args: { badgeContent: "99+" } };
export const Pulsing: Story = { args: { withPulse: true } };
