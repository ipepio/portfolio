import type { Meta, StoryObj } from '@storybook/nextjs'
import { ArrowUpRight, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="icon" aria-label="Add">
        <Plus />
      </Button>
      <Button {...args} size="icon-sm" aria-label="Add">
        <Plus />
      </Button>
      <Button {...args} size="icon-lg" aria-label="Add">
        <Plus />
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        Open project
        <ArrowUpRight data-icon="inline-end" />
      </Button>
      <Button {...args} variant="outline">
        <Plus data-icon="inline-start" />
        Add item
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Default</Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
    </div>
  ),
}
