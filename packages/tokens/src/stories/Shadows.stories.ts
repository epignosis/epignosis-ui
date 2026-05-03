import type { Meta, StoryObj } from "@storybook/html-vite";
import { shadows } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Shadows",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const wrap = (heading: string, sub: string, body: string): string => `
  <div style="padding:32px;background:#eef0f2;min-height:100vh;box-sizing:border-box;font-family:Mulish,Arial,sans-serif;color:#222;">
    <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:14px;">
      <h3 style="margin:0;font-size:18px;font-weight:700;text-transform:capitalize;">${heading}</h3>
      <code style="font-family:ui-monospace,monospace;font-size:12px;color:#666;">${sub}</code>
    </div>
    <div style="background:#fff;border-radius:10px;padding:40px;box-shadow:0 1px 2px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);">
      ${body}
    </div>
  </div>
`;

export const All: Story = {
  render: () =>
    wrap(
      "Shadows",
      "elevation tokens",
      `
        <div style="display:flex;flex-wrap:wrap;gap:48px;">
          ${Object.entries(shadows)
            .map(
              ([k, v]) => `
                <div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start;">
                  <div style="width:180px;height:110px;background:#fff;border-radius:8px;box-shadow:${v};border:1px solid rgba(0,0,0,0.04);"></div>
                  <div style="max-width:260px;">
                    <div style="font-weight:700;font-size:13px;text-transform:capitalize;">${k}</div>
                    <code style="font-family:ui-monospace,monospace;font-size:11px;color:#666;word-break:break-word;line-height:1.5;">${v}</code>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      `,
    ),
};
