import type { Meta, StoryObj } from "@storybook/react-vite";
import Breadcrumbs, { type BreadcrumbsProps } from "./Breadcrumbs";

// Every item has an href so toggling `highlightActivePage` produces a visible
// change. An item without `href` is automatically rendered black + non-clickable
// (see the `EmptyHrefAutoHighlight` story for that behavior).
const sampleItems = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/catalog" },
  { label: "Course", href: "/catalog/course" },
  { label: "Lesson 1", href: "/catalog/course/lesson-1" },
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

/**
 * Default: every item is a clickable blue link, including the last one.
 */
export const Default: Story = { args: { highlightActivePage: false } };

/**
 * Last item rendered as the current page: black, non-clickable, marked with
 * `aria-current="page"`. Use this when the breadcrumb sits on top of the
 * actual current page.
 */
export const HighlightActive: Story = { args: { highlightActivePage: true } };

/**
 * If you omit `href` on an item, it's automatically rendered as black and
 * non-clickable — there's nowhere to navigate to. This happens regardless of
 * `highlightActivePage`.
 */
export const EmptyHrefAutoHighlight: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Catalog", href: "/catalog" },
      { label: "Lesson 1" },
    ],
    highlightActivePage: false,
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Profile", href: "/profile" },
    ],
    highlightActivePage: false,
  },
};
