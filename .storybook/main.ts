import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)', '../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
}

export default config
