import type { Meta, StoryObj } from "@storybook/react-vite";
import Breadcrumbs, { type BreadcrumbsProps } from "./Breadcrumbs";

const sampleItems = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Course", href: "/catalog/course" },
  { label: "Lesson 1" },
];

const meta = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  argTypes: {
    highlightActivePage: { control: "boolean" },
    navAriaLabel: { control: "text" },
  },
  args: {
    items: sampleItems,
    highlightActivePage: false,
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<BreadcrumbsProps>;

export const Default: Story = {};
export const HighlightActive: Story = { args: { highlightActivePage: true } };
export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Profile" },
    ],
  },
};
