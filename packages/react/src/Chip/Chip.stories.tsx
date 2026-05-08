import type { Meta, StoryObj } from "@storybook/react-vite";
import { BranchesFilterSVG } from "@epignosis_llc/ui-icons";
import Chip, { type ChipProps } from "./Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compact, removable label used for tags, filters, and selected items. Two sizes (`md`/`lg`). Pass `onClose` to render a leading dismiss button. Pass an `icon` to make it a filter chip — the icon shows by default and swaps to the close icon on hover. Use `maxWidth` to cap the label width with ellipsis truncation; truncated string children get a native browser tooltip.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["md", "lg"] },
    onClose: { action: "closed" },
  },
  args: {
    size: "md",
    children: "Active filter",
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<ChipProps>;

export const Default: Story = { args: { size: "md", children: "Tag" } };

export const Removable: Story = {
  args: {
    size: "md",
    children: "Removable tag",
    onClose: () => {},
  },
};

export const FilterChip: Story = {
  args: {
    size: "md",
    children: "Filter",
    icon: BranchesFilterSVG,
    maxWidth: 100,
    closeButtonAriaLabel: "Remove filter",
    onClose: () => {},
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large chip",
    onClose: () => {},
  },
};

export const Truncated: Story = {
  args: {
    size: "md",
    children: "A very long label that should truncate with an ellipsis",
    maxWidth: 160,
    onClose: () => {},
  },
};
