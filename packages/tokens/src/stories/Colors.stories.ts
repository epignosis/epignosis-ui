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

const COLUMN_WIDTH = 260;

const cell = (label: string, value: string, height: number): string => {
  const text = contrastingText(value);
  const inner = `
    width:100%;height:${height}px;box-sizing:border-box;
    color:${text};
    display:flex;align-items:center;justify-content:space-between;
    padding:0 16px;
    font-family:Mulish,Arial,sans-serif;
  `;
  const labelHtml = `<span style="font-weight:700;font-size:12px;text-transform:capitalize;letter-spacing:0.02em;">${label}</span>`;
  const valueHtml = `<code style="font-family:ui-monospace,monospace;font-size:11px;opacity:0.9;">${value}</code>`;
  if (isTransparent(value)) {
    return `
      <div style="width:100%;height:${height}px;${CHECKERBOARD}">
        <div style="${inner}background:${value};">${labelHtml}${valueHtml}</div>
      </div>
    `;
  }
  return `<div style="${inner}background:${value};">${labelHtml}${valueHtml}</div>`;
};

const stack = (entries: [string, string][], cellHeight: number): string => `
  <div style="
    display:flex;flex-direction:column;width:100%;
    border-radius:10px;overflow:hidden;
    box-shadow:0 1px 2px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);
  ">
    ${entries.map(([k, v]) => cell(k, v, cellHeight)).join("")}
  </div>
`;

const columnHeader = (heading: string, sub: string): string => `
  <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px;">
    <h3 style="margin:0;font-size:16px;font-weight:700;text-transform:capitalize;">${heading}</h3>
    <code style="font-family:ui-monospace,monospace;font-size:11px;color:#666;">${sub}</code>
  </div>
`;

const transparencyAppendix = (entries: [string, string][]): string =>
  entries.length === 0
    ? ""
    : `
      <div style="margin-top:14px;">
        <div style="font-family:Mulish,Arial,sans-serif;font-size:10px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">
          Transparency variants
        </div>
        ${stack(entries, 50)}
      </div>
    `;

type PaletteName = "primary" | "secondary" | "green" | "orange" | "red";
const PALETTE_ORDER: PaletteName[] = ["primary", "secondary", "green", "orange", "red"];

const paletteColumn = (name: PaletteName): string => {
  const entries = Object.entries(colors[name]) as [string, string][];
  const solid = entries.filter(([, v]) => !isTransparent(v));
  const transparent = entries.filter(([, v]) => isTransparent(v));
  const baseEntry = solid.find(([k]) => k === "base") ?? solid[0];
  const baseShade = baseEntry[1];
  return `
    <div style="font-family:Mulish,Arial,sans-serif;color:#222;width:${COLUMN_WIDTH}px;flex-shrink:0;">
      ${columnHeader(name, baseShade)}
      ${stack(solid, 60)}
      ${transparencyAppendix(transparent)}
    </div>
  `;
};

const baseColumn = (): string => `
  <div style="font-family:Mulish,Arial,sans-serif;color:#222;width:${COLUMN_WIDTH}px;flex-shrink:0;">
    ${columnHeader("Base", "single-value tokens")}
    ${stack(Object.entries(colorBase), 60)}
  </div>
`;

const wrap = (children: string): string => `
  <div style="padding:32px;background:#eef0f2;min-height:100vh;box-sizing:border-box;">
    ${children}
  </div>
`;

export const All: Story = {
  render: () =>
    wrap(`
      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;">
        ${[baseColumn(), ...PALETTE_ORDER.map(paletteColumn)].join("")}
      </div>
    `),
};

export const Base: Story = {
  render: () => wrap(baseColumn()),
};

export const Primary: Story = {
  render: () => wrap(paletteColumn("primary")),
};

export const Secondary: Story = {
  render: () => wrap(paletteColumn("secondary")),
};

export const Green: Story = {
  render: () => wrap(paletteColumn("green")),
};

export const Orange: Story = {
  render: () => wrap(paletteColumn("orange")),
};

export const Red: Story = {
  render: () => wrap(paletteColumn("red")),
};
