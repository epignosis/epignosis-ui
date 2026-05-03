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

export const Scale: Story = {
  render: () => `
    <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      ${Object.entries(spacing)
        .map(
          ([k, v]) => `
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;width:200px;">
                ${k} — ${v}${remToPx(v) ? ` (${remToPx(v)})` : ""}
              </code>
              <div style="width:${v};height:16px;background:${colors.primary.light};"></div>
            </div>
          `,
        )
        .join("")}
    </div>
  `,
};
