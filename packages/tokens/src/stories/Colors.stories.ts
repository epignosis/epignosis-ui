import type { Meta, StoryObj } from "@storybook/html-vite";
import { colorBase, colors } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Colors",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const contrastingText = (value: string): string => {
  if (value.startsWith("rgba")) return "#111";
  const hex = value.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#111" : "#fff";
};

const chip = (label: string, value: string): string => {
  const text = contrastingText(value);
  return `
    <div style="
      flex:1;min-width:0;height:140px;
      background:${value};color:${text};
      display:flex;flex-direction:column;justify-content:space-between;
      padding:12px;
      font-family:Mulish,Arial,sans-serif;
    ">
      <div style="font-weight:700;font-size:12px;text-transform:capitalize;letter-spacing:0.02em;">${label}</div>
      <code style="font-family:ui-monospace,monospace;font-size:11px;opacity:0.9;">${value}</code>
    </div>
  `;
};

const strip = (heading: string, sub: string, entries: [string, string][]): string => `
  <div style="margin-bottom:32px;font-family:Mulish,Arial,sans-serif;color:#222;">
    <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:10px;">
      <h3 style="margin:0;font-size:18px;font-weight:700;text-transform:capitalize;">${heading}</h3>
      <code style="font-family:ui-monospace,monospace;font-size:12px;color:#666;">${sub}</code>
    </div>
    <div style="
      display:flex;width:100%;
      border-radius:10px;overflow:hidden;
      box-shadow:0 1px 2px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);
    ">
      ${entries.map(([k, v]) => chip(k, v)).join("")}
    </div>
  </div>
`;

const wrap = (children: string): string => `
  <div style="padding:32px;background:#eef0f2;min-height:100vh;box-sizing:border-box;">
    ${children}
  </div>
`;

const palette = (name: "primary" | "secondary" | "green" | "orange" | "red"): Story => ({
  render: () => {
    const entries = Object.entries(colors[name]) as [string, string][];
    const baseEntry = entries.find(([k]) => k === "base");
    const baseShade = baseEntry ? baseEntry[1] : entries[0][1];
    return wrap(strip(name, baseShade, entries));
  },
});

export const Base: Story = {
  render: () =>
    wrap(strip("Base", "single-value tokens", Object.entries(colorBase))),
};

export const Primary: Story = palette("primary");
export const Secondary: Story = palette("secondary");
export const Green: Story = palette("green");
export const Orange: Story = palette("orange");
export const Red: Story = palette("red");
