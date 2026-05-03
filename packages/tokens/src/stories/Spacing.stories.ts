import type { Meta, StoryObj } from "@storybook/html-vite";
import { colors, spacing } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Spacing",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const remToPx = (value: string): string => {
  const n = parseFloat(value);
  if (isNaN(n) || !value.endsWith("rem")) return "";
  return `${n * 16}px`;
};

const wrap = (heading: string, sub: string, body: string): string => `
  <div style="padding:32px;background:#eef0f2;min-height:100vh;box-sizing:border-box;font-family:Mulish,Arial,sans-serif;color:#222;">
    <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:14px;">
      <h3 style="margin:0;font-size:18px;font-weight:700;text-transform:capitalize;">${heading}</h3>
      <code style="font-family:ui-monospace,monospace;font-size:12px;color:#666;">${sub}</code>
    </div>
    <div style="background:#fff;border-radius:10px;padding:28px;box-shadow:0 1px 2px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);">
      ${body}
    </div>
  </div>
`;

export const Scale: Story = {
  render: () =>
    wrap(
      "Spacing",
      "rem-based scale tokens",
      `
        <div style="display:flex;flex-direction:column;gap:18px;">
          ${Object.entries(spacing)
            .map(
              ([k, v]) => `
                <div style="display:flex;align-items:center;gap:24px;">
                  <div style="flex:0 0 200px;">
                    <div style="font-weight:700;font-size:13px;text-transform:capitalize;">${k}</div>
                    <code style="font-family:ui-monospace,monospace;font-size:12px;color:#666;">${v}${remToPx(v) ? ` (${remToPx(v)})` : ""}</code>
                  </div>
                  <div style="height:24px;background:${colors.primary.base};border-radius:4px;width:${v};"></div>
                </div>
              `,
            )
            .join("")}
        </div>
      `,
    ),
};
