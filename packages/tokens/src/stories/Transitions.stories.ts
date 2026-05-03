import type { Meta, StoryObj } from "@storybook/html-vite";
import { colors, transitions } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Transitions",
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
    <div style="background:#fff;border-radius:10px;padding:28px;box-shadow:0 1px 2px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);">
      ${body}
    </div>
  </div>
`;

export const All: Story = {
  render: () =>
    wrap(
      "Transitions",
      "duration & easing tokens",
      `
        <p style="margin:0 0 24px;font-size:13px;color:#666;">
          Hover any box to demo its transition.
        </p>
        <style>
          .eg-transition-demo {
            width: 80px;
            height: 80px;
            background: ${colors.primary.base};
            border-radius: 8px;
            transform: translateX(0);
          }
          .eg-transition-demo:hover {
            transform: translateX(160px);
            background: ${colors.primary.dark};
          }
        </style>
        <div style="display:flex;flex-direction:column;gap:24px;">
          ${Object.entries(transitions)
            .map(
              ([k, v]) => `
                <div style="display:flex;align-items:center;gap:24px;">
                  <div style="flex:0 0 220px;">
                    <div style="font-weight:700;font-size:13px;text-transform:capitalize;">${k}</div>
                    <code style="font-family:ui-monospace,monospace;font-size:12px;color:#666;">${v}</code>
                  </div>
                  <div class="eg-transition-demo" style="transition:transform ${v}, background ${v};"></div>
                </div>
              `,
            )
            .join("")}
        </div>
      `,
    ),
};
