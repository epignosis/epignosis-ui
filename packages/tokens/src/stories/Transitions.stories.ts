import type { Meta, StoryObj } from "@storybook/html-vite";
import { colors, transitions } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Transitions",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const All: Story = {
  render: () => `
    <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
      <p style="margin:0 0 24px;font-size:14px;color:#555;">
        Hover any box to demo its transition.
      </p>
      <style>
        .eg-transition-demo {
          width: 80px;
          height: 80px;
          background: ${colors.primary.light};
          border-radius: 6px;
          transform: translateX(0);
        }
        .eg-transition-demo:hover {
          transform: translateX(120px);
          background: ${colors.primary.dark};
        }
      </style>
      <div style="display:flex;flex-direction:column;gap:24px;">
        ${Object.entries(transitions)
          .map(
            ([k, v]) => `
              <div style="display:flex;align-items:center;gap:24px;">
                <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;width:220px;">
                  <strong>${k}</strong> — ${v}
                </code>
                <div class="eg-transition-demo" style="transition:transform ${v}, background ${v};"></div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `,
};
