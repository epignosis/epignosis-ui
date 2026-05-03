import type { Meta, StoryObj } from "@storybook/html-vite";
import { zIndex } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/ZIndex",
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
    <div style="background:#fff;border-radius:10px;padding:24px 28px;box-shadow:0 1px 2px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);">
      ${body}
    </div>
  </div>
`;

export const Reference: Story = {
  render: () => {
    const entries = Object.entries(zIndex).sort(([, a], [, b]) => a - b);
    return wrap(
      "Z-Index",
      "stacking-order tokens",
      `
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <thead>
            <tr>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #e5e7ea;">Key</th>
              <th style="padding:12px;text-align:left;font-weight:700;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #e5e7ea;">Value</th>
            </tr>
          </thead>
          <tbody>
            ${entries
              .map(
                ([k, v]) => `
                  <tr style="border-bottom:1px solid #f0f1f3;">
                    <td style="padding:14px 12px;font-weight:700;font-size:13px;text-transform:capitalize;">${k}</td>
                    <td style="padding:14px 12px;font-family:ui-monospace,monospace;font-size:13px;color:#444;">${v}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      `,
    );
  },
};
