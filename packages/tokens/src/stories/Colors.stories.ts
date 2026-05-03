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

const isTransparent = (value: string): boolean => value.startsWith("rgba");

const CHECKERBOARD = `
  background-image:
    linear-gradient(45deg, #d4d8dc 25%, transparent 25%),
    linear-gradient(-45deg, #d4d8dc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d4d8dc 75%),
    linear-gradient(-45deg, transparent 75%, #d4d8dc 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
  background-color: #ffffff;
`;

const chip = (label: string, value: string, height: number): string => {
  const text = contrastingText(value);
  const transparent = isTransparent(value);
  const innerStyle = `
    flex:1;min-width:0;height:${height}px;box-sizing:border-box;
    color:${text};
    display:flex;flex-direction:column;justify-content:space-between;
    padding:12px;
    font-family:Mulish,Arial,sans-serif;
  `;
  if (transparent) {
    return `
      <div style="flex:1;min-width:0;height:${height}px;${CHECKERBOARD}">
        <div style="${innerStyle}background:${value};">
          <div style="font-weight:700;font-size:12px;text-transform:capitalize;letter-spacing:0.02em;">${label}</div>
          <code style="font-family:ui-monospace,monospace;font-size:11px;opacity:0.9;">${value}</code>
        </div>
      </div>
    `;
  }
  return `
    <div style="${innerStyle}background:${value};">
      <div style="font-weight:700;font-size:12px;text-transform:capitalize;letter-spacing:0.02em;">${label}</div>
      <code style="font-family:ui-monospace,monospace;font-size:11px;opacity:0.9;">${value}</code>
    </div>
  `;
};

const stripRow = (entries: [string, string][], height: number): string => `
  <div style="
    display:flex;width:100%;
    border-radius:10px;overflow:hidden;
    box-shadow:0 1px 2px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);
  ">
    ${entries.map(([k, v]) => chip(k, v, height)).join("")}
  </div>
`;

const strip = (heading: string, sub: string, entries: [string, string][]): string => {
  const solid = entries.filter(([, v]) => !isTransparent(v));
  const transparent = entries.filter(([, v]) => isTransparent(v));
  const appendix = transparent.length
    ? `
      <div style="margin-top:14px;">
        <div style="font-family:Mulish,Arial,sans-serif;font-size:12px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">
          Transparency variants
        </div>
        ${stripRow(transparent, 80)}
      </div>
    `
    : "";
  return `
    <div style="margin-bottom:32px;font-family:Mulish,Arial,sans-serif;color:#222;">
      <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:10px;">
        <h3 style="margin:0;font-size:18px;font-weight:700;text-transform:capitalize;">${heading}</h3>
        <code style="font-family:ui-monospace,monospace;font-size:12px;color:#666;">${sub}</code>
      </div>
      ${stripRow(solid, 140)}
      ${appendix}
    </div>
  `;
};

const wrap = (children: string): string => `
  <div style="padding:32px;background:#eef0f2;min-height:100vh;box-sizing:border-box;">
    ${children}
  </div>
`;

type PaletteName = "primary" | "secondary" | "green" | "orange" | "red";
const PALETTE_ORDER: PaletteName[] = ["primary", "secondary", "green", "orange", "red"];

const paletteStrip = (name: PaletteName): string => {
  const entries = Object.entries(colors[name]) as [string, string][];
  const baseEntry = entries.find(([k]) => k === "base");
  const baseShade = baseEntry ? baseEntry[1] : entries[0][1];
  return strip(name, baseShade, entries);
};

const palette = (name: PaletteName): Story => ({
  render: () => wrap(paletteStrip(name)),
});

export const All: Story = {
  render: () =>
    wrap(
      [
        strip("Base", "single-value tokens", Object.entries(colorBase)),
        ...PALETTE_ORDER.map(paletteStrip),
      ].join(""),
    ),
};

export const Base: Story = {
  render: () =>
    wrap(strip("Base", "single-value tokens", Object.entries(colorBase))),
};

export const Primary: Story = palette("primary");
export const Secondary: Story = palette("secondary");
export const Green: Story = palette("green");
export const Orange: Story = palette("orange");
export const Red: Story = palette("red");
