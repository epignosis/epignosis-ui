import type { Meta, StoryObj } from "@storybook/react-vite";
import Alert, { type AlertProps } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline status banner with four severity levels (`info`, `danger`, `success`, `warning`). Each `type` ships with a default leading icon from `@epignosis_llc/ui-icons` — override via the `icon` prop. When `onClose` is provided, a trailing close button is rendered; without it the alert is permanent. The leading icon hides below the `md` breakpoint to keep mobile layouts compact.",
      },
    },
  },
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
