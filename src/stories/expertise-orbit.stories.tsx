import type { Meta, StoryObj } from '@storybook/nextjs'

import { ExpertiseOrbit } from '@/components/site/expertise-orbit'

const meta = {
  title: 'Site/ExpertiseOrbit',
  component: ExpertiseOrbit,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExpertiseOrbit>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The whole widget: seven equidistant nodes on three rings, the animated scene of the
 * selected area in the centre (Enterprise on load, as in the reference) and the detail
 * block underneath. It owns its copy, so there is nothing to pass in.
 */
export const Default: Story = {
  args: {},
}
