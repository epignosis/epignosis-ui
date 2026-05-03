import type { Meta, StoryObj } from "@storybook/html-vite";
import { borderRadius, colors } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/BorderRadius",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => `
    <div style="display:flex;flex-wrap:wrap;gap:24px;padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      ${Object.entries(borderRadius)
        .map(
          ([k, v]) => `
            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start;">
              <div style="width:96px;height:96px;background:${colors.primary.light};border-radius:${v};"></div>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
                ${k} — ${v}
              </code>
            </div>
          `,
        )
        .join("")}
    </div>
  `,
};
