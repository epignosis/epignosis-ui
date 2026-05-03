import type { Meta, StoryObj } from "@storybook/html-vite";
import { colorBase, colors } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Colors",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const swatch = (label: string, value: string): string => `
  <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start;">
    <div style="width:96px;height:96px;border-radius:6px;background:${value};border:1px solid #e5e5e5;"></div>
    <div style="font-family:Mulish,Arial,sans-serif;font-size:14px;font-weight:600;">${label}</div>
    <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">${value}</code>
  </div>
`;

const grid = (children: string): string => `
  <div style="display:flex;flex-wrap:wrap;gap:24px;padding:24px;font-family:Mulish,Arial,sans-serif;">
    ${children}
  </div>
`;

const palette = (name: "primary" | "secondary" | "green" | "orange" | "red"): Story => ({
  render: () =>
    grid(
      Object.entries(colors[name])
        .map(([k, v]) => swatch(k, v))
        .join(""),
    ),
});

export const Base: Story = {
  render: () =>
    grid(
      Object.entries(colorBase)
        .map(([k, v]) => swatch(k, v))
        .join(""),
    ),
};

export const Primary: Story = palette("primary");
export const Secondary: Story = palette("secondary");
export const Green: Story = palette("green");
export const Orange: Story = palette("orange");
export const Red: Story = palette("red");
