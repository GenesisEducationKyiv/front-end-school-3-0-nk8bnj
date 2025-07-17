import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import CreateTrackButton from '../components/CreateTrackButton';

const meta = {
  title: 'Components/CreateTrackButton',
  component: CreateTrackButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Button text content',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: { 
    onClick: fn(),
  },
} satisfies Meta<typeof CreateTrackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomText: Story = {
  args: {
    children: 'Add New Track',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'w-full',
    children: 'Full Width Button',
  },
};

export const LongText: Story = {
  args: {
    children: 'Create a New Music Track',
  },
}; 