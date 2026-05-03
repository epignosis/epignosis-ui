import type { Meta, StoryObj } from "@storybook/html-vite";
import { shadows } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Shadows",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const All: Story = {
  render: () => `
    <div style="display:flex;flex-wrap:wrap;gap:32px;padding:32px;font-family:Mulish,Arial,sans-serif;color:#222;background:#FAFAFA;">
      ${Object.entries(shadows)
        .map(
          ([k, v]) => `
            <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
              <div style="width:120px;height:80px;background:#FFFFFF;border-radius:6px;box-shadow:${v};"></div>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;max-width:240px;word-break:break-word;">
                <strong>${k}</strong> — ${v}
              </code>
            </div>
          `,
        )
        .join("")}
    </div>
  `,
};
