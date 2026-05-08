import type { Meta, StoryObj } from "@storybook/react-vite";
import Alert, { type AlertProps } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    type: {
      control: "select",
      options: ["info", "danger", "success", "warning"],
    },
    onClose: { action: "closed" },
  },
  args: {
    type: "info",
    children: "This is an alert!",
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<AlertProps>;

export const Info: Story = { args: { type: "info" } };
export const Danger: Story = { args: { type: "danger" } };
export const Success: Story = { args: { type: "success" } };
export const Warning: Story = { args: { type: "warning" } };

export const WithCloseButton: Story = {
  args: {
    type: "info",
    // Explicit onClose so the close button renders; the argTypes action
    // above forwards invocations to the Storybook actions panel.
    onClose: () => {},
  },
};
