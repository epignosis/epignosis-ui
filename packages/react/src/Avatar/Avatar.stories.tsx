import type { Meta, StoryObj } from "@storybook/react-vite";
import { colors } from "@epignosis_llc/ui-tokens";
import Avatar, { type AvatarProps } from "./Avatar";

// Sample inline icon used by the IconAvatar story.
const CertificateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
    <path
      fill="currentColor"
      d="M16,2C8.27,2,2,8.27,2,16s6.27,14,14,14,14-6.27,14-14S23.73,2,16,2Zm0,4c2.21,0,4,1.79,4,4s-1.79,4-4,4-4-1.79-4-4,1.79-4,4-4Zm0,20c-3.31,0-6.27-1.6-8.12-4.07,1.93-1.7,4.95-2.93,8.12-2.93s6.19,1.23,8.12,2.93c-1.85,2.47-4.81,4.07-8.12,4.07Z"
    />
  </svg>
);

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
  args: {
    size: "sm",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<AvatarProps>;

export const Image: Story = {
  args: {
    alt: "John Doe",
    src: "https://talentlms-prod-frontend-static.s3.amazonaws.com/images/default_user_avatar.png",
  },
  argTypes: {
    children: { control: false },
    bgColor: { control: false },
  },
};

export const Icon: Story = {
  args: {
    children: <CertificateIcon />,
    bgColor: colors.primary.base,
  },
  argTypes: {
    src: { control: false },
    alt: { control: false },
  },
};

export const Initials: Story = {
  args: {
    children: "JT",
  },
  argTypes: {
    src: { control: false },
    alt: { control: false },
  },
};
