import type { CSSProperties, SVGProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button, { type ButtonProps } from "./Button";

type StoryArgs = ButtonProps<"button"> & { style?: CSSProperties };

// Sample SVG mirroring @epignosis_llc/gnosis's calendar icon (legacy/calendar.svg).
// 32×32 viewBox with the visible shape inset roughly 9–24 — without that inset
// the rendered icon looks too big inside our buttons. Path lifted verbatim from
// gnosis so visual weight matches when consumers use that icon set.
const CalendarIcon = ({ height = 30, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 0 32 32"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M13.75,10h4.5v-1.25c0-.41,.33-.75,.75-.75s.75,.34,.75,.75v1.25h1.25c1.1,0,2,.9,2,2v10c0,1.1-.9,2-2,2H11c-1.1,0-2-.9-2-2V12c0-1.1,.9-2,2-2h1.25v-1.25c0-.41,.33-.75,.75-.75s.75,.34,.75,.75v1.25Zm-3.25,5.75h2.5v-1.75h-2.5v1.75Zm0,1.5v2h2.5v-2h-2.5Zm4,0v2h3v-2h-3Zm4.5,0v2h2.5v-2h-2.5Zm2.5-3.25h-2.5v1.75h2.5v-1.75Zm0,6.75h-2.5v1.75h2c.27,0,.5-.23,.5-.5v-1.25Zm-4,0h-3v1.75h3v-1.75Zm-4.5,0h-2.5v1.25c0,.27,.22,.5,.5,.5h2v-1.75Zm4.5-6.75h-3v1.75h3v-1.75Z"
    />
  </svg>
);

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
    variant: "solid"
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
    iconBefore: CalendarIcon,
  },
};

export const WithIconAfter: Story = {
  render: (args) => <Template {...args} />,
  args: {
    color: "primary",
    children: "Icon suffix",
    iconAfter: CalendarIcon,
  },
};
