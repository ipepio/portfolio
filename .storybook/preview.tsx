import React, { useEffect } from 'react'
import type { Decorator, Preview } from '@storybook/nextjs'

import '../src/app/(frontend)/globals.css'

type Theme = 'dark' | 'light'

const THEME_ATTRIBUTE = 'data-theme'

/**
 * Dark is the default theme of the design system; light is opt-in through
 * `data-theme="light"` on <html> — exactly what the storefront does.
 */
function ThemeCanvas({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
  }, [theme])

  return <div className="bg-background text-foreground min-h-dvh p-6">{children}</div>
}

const withTheme: Decorator = (Story, context) => (
  <ThemeCanvas theme={context.globals.theme === 'light' ? 'light' : 'dark'}>
    <Story />
  </ThemeCanvas>
)

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: { theme: 'dark' },
  globalTypes: {
    theme: {
      description: 'ipepio color theme (sets data-theme on <html>)',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Dark (default)', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'fullscreen',
  },
}

export default preview
