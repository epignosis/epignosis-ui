import type { Meta, StoryObj } from "@storybook/html-vite";
import { zIndex } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/ZIndex",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Reference: Story = {
  render: () => `
    <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      <table style="border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="text-align:left;border-bottom:2px solid #ddd;">
            <th style="padding:8px 16px;">Key</th>
            <th style="padding:8px 16px;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(zIndex)
            .map(
              ([k, v]) => `
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:8px 16px;font-weight:600;">${k}</td>
                  <td style="padding:8px 16px;font-family:ui-monospace,monospace;">${v}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `,
};
