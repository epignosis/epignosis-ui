import type { Meta, StoryObj } from "@storybook/react-vite";
import IconsList from "../.storybook/IconsList";
import * as actions from "./actions";
import * as arrows from "./arrows";
import * as carets from "./carets";
import * as chevrons from "./chevrons";
import * as client from "./client";
import * as currencies from "./currencies";
import * as feature from "./feature";
import * as legacy from "./legacy";
import * as logos from "./logos";
import * as social from "./social";

const meta = {
  title: "Icons",
  component: IconsList,
  parameters: { layout: "padded" },
  argTypes: {
    defaultSize: { control: { type: "number", min: 12, max: 96, step: 4 } },
  },
  args: {
    defaultSize: 32,
  },
} satisfies Meta<typeof IconsList>;

export default meta;

type Story = StoryObj<typeof IconsList>;

export const All: Story = {
  args: {
    icons: {
      ...actions,
      ...arrows,
      ...carets,
      ...chevrons,
      ...client,
      ...currencies,
      ...feature,
      ...legacy,
      ...logos,
      ...social,
    },
  },
};

export const Actions: Story = { args: { icons: actions } };
export const Arrows: Story = { args: { icons: arrows } };
export const Carets: Story = { args: { icons: carets } };
export const Chevrons: Story = { args: { icons: chevrons } };
export const Client: Story = { args: { icons: client } };
export const Currencies: Story = { args: { icons: currencies } };
export const Feature: Story = { args: { icons: feature } };
export const Legacy: Story = { args: { icons: legacy } };
export const Logos: Story = { args: { icons: logos } };
export const Social: Story = { args: { icons: social } };
