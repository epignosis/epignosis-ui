import type { Meta, StoryObj } from "@storybook/html-vite";
import { typography } from "../theme/tokens";

const meta: Meta = {
  title: "Tokens/Typography",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const wrap = (children: string): string => `
  <div style="padding:24px;font-family:Mulish,Arial,sans-serif;color:#222;">
    ${children}
  </div>
`;

const remToPx = (value: string): string => {
  const n = parseFloat(value);
  if (isNaN(n) || !value.endsWith("rem")) return "";
  return `${n * 16}px`;
};

export const FontFamily: Story = {
  render: () =>
    wrap(`
      <p style="font-family:var(--font-family-body);font-size:1rem;line-height:1.5;">
        The quick brown fox jumps over the lazy dog.
      </p>
      <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
        body: ${typography.fontFamily.body}
      </code>
    `),
};

export const Scale: Story = {
  render: () =>
    wrap(
      Object.entries(typography.fontSize)
        .map(
          ([k, v]) => `
            <div style="margin-bottom:20px;">
              <p style="font-family:var(--font-family-body);font-size:${v};line-height:1.3;margin:0 0 4px;">
                The quick brown fox jumps over the lazy dog.
              </p>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
                ${k} — ${v} (${remToPx(v)})
              </code>
            </div>
          `,
        )
        .join(""),
    ),
};

export const Weights: Story = {
  render: () =>
    wrap(
      Object.entries(typography.fontWeight)
        .map(
          ([k, v]) => `
            <div style="margin-bottom:20px;">
              <p style="font-family:var(--font-family-body);font-size:1.125rem;font-weight:${v};margin:0 0 4px;">
                The quick brown fox jumps over the lazy dog.
              </p>
              <code style="font-family:ui-monospace,monospace;font-size:12px;color:#555;">
                ${k} — ${v}
              </code>
            </div>
          `,
        )
        .join(""),
    ),
};
