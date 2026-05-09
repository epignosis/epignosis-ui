import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarSVG } from "@epignosis_llc/ui-icons";
import Button, { type ButtonProps } from "./Button";

type StoryArgs = ButtonProps<"button"> & { style?: CSSProperties };

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A polymorphic action element with eight color tokens, four variants (`solid`, `outline`, `ghost`, `link`), three sizes, optional leading/trailing icons, loading and rounded modes. Default-exports as a `<button>`; use the `as` prop to render any other element while keeping all styling and a11y semantics.",
      },
    },
  },
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
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<StoryArgs>;

// 3 rows (sm / md / lg) × 4 columns (solid / outline / ghost / link).
// Mirrors gnosis's Template — same arrangement, same spacing.
const Template = ({ style, ...args }: StoryArgs) => (
  <div style={style}>
    <div style={{ marginBottom: 16 }}>
      <Button size="sm" {...args} />
      <span style={{ marginRight: 16 }} />
      <Button size="sm" {...args} variant="outline" />
      <span style={{ marginRight: 16 }} />
      <Button size="sm" {...args} variant="ghost" />
      <span style={{ marginRight: 16 }} />
      <Button size="sm" {...args} variant="link" />
    </div>
    <div style={{ marginBottom: 16 }}>
      <Button {...args} />
      <span style={{ marginRight: 16 }} />
      <Button {...args} variant="outline" />
      <span style={{ marginRight: 16 }} />
      <Button {...args} variant="ghost" />
      <span style={{ marginRight: 16 }} />
      <Button {...args} variant="link" />
    </div>
    <div style={{ marginBottom: 16 }}>
      <Button size="lg" {...args} />
      <span style={{ marginRight: 16 }} />
      <Button size="lg" {...args} variant="outline" />
      <span style={{ marginRight: 16 }} />
      <Button size="lg" {...args} variant="ghost" />
      <span style={{ marginRight: 16 }} />
      <Button size="lg" {...args} variant="link" />
    </div>
  </div>
);

export const Primary: Story = {
  render: (args) => <Template {...args} />,
  args: {
    color: "primary",
    children: "Primary",
    disabled: false,
    variant: "solid",
  },
};

export const Secondary: Story = {
  render: (args) => <Template {...args} />,
  args: { color: "secondary", children: "Secondary" },
};

export const Danger: Story = {
  render: (args) => <Template {...args} />,
  args: { color: "danger", children: "Danger" },
};

export const Success: Story = {
  render: (args) => <Template {...args} />,
  args: { color: "success", children: "Success" },
};

export const PrimaryLight: Story = {
  render: (args) => <Template {...args} />,
  args: {
    color: "primaryLight",
    children: "Primary light",
    style: {
      background: "var(--color-primary-darker)",
      padding: "1.25rem 1.25rem 0.25rem",
    },
  },
};

export const PrimaryDarker: Story = {
  render: (args) => <Template {...args} />,
  args: { color: "primaryDarker", children: "Primary darker" },
};

export const Orange: Story = {
  render: (args) => <Template {...args} />,
  args: { color: "orange", children: "Orange" },
};

// White needs the dark backdrop only behind the solid (left-most) buttons,
// since the other variants have transparent backgrounds and would disappear.
// Mirrors gnosis's WhiteTemplate.
const WhiteTemplate = ({ style, ...args }: StoryArgs) => (
  <>
    <div style={{ marginBottom: 16 }}>
      <div style={style}>
        <Button size="sm" {...args} />
      </div>
      <span style={{ marginRight: 16 }} />
      <Button size="sm" {...args} variant="outline" />
      <span style={{ marginRight: 16 }} />
      <Button size="sm" {...args} variant="ghost" />
      <span style={{ marginRight: 16 }} />
      <Button size="sm" {...args} variant="link" />
    </div>
    <div style={{ marginBottom: 16 }}>
      <div style={style}>
        <Button {...args} />
      </div>
      <span style={{ marginRight: 16 }} />
      <Button {...args} variant="outline" />
      <span style={{ marginRight: 16 }} />
      <Button {...args} variant="ghost" />
      <span style={{ marginRight: 16 }} />
      <Button {...args} variant="link" />
    </div>
    <div style={{ marginBottom: 16 }}>
      <div style={style}>
        <Button size="lg" {...args} />
      </div>
      <span style={{ marginRight: 16 }} />
      <Button size="lg" {...args} variant="outline" />
      <span style={{ marginRight: 16 }} />
      <Button size="lg" {...args} variant="ghost" />
      <span style={{ marginRight: 16 }} />
      <Button size="lg" {...args} variant="link" />
    </div>
  </>
);

export const White: Story = {
  render: (args) => <WhiteTemplate {...args} />,
  args: {
    color: "white",
    children: "White",
    style: {
      background: "var(--color-primary-darker)",
      padding: "0.75rem",
      display: "inline-block",
    },
  },
};

export const WithIconBefore: Story = {
  render: (args) => <Template {...args} />,
  args: {
    color: "primary",
    children: "Icon prefix",
    iconBefore: CalendarSVG,
  },
};

export const WithIconAfter: Story = {
  render: (args) => <Template {...args} />,
  args: {
    color: "primary",
    children: "Icon suffix",
    iconAfter: CalendarSVG,
  },
};
