import type { Metadata } from 'next'
import type React from 'react'

import './globals.css'
import { readLocale, readTheme } from '@/lib/server'

export const metadata: Metadata = {
  title: 'IPEPIO — Journal',
  description: 'Notas sobre agentes, infraestructura y producto. Field notes on agents, infrastructure and product.',
}

/**
 * The blog's only root layout: it hosts the locale routes, the exposed 404 and the design
 * system.
 *
 * Both attributes are read on the server so the first paint is already right:
 * `data-theme` comes from the `ipepio-theme` cookie (shared with the portfolio, so the
 * preference does not flip between the apps) and `lang` from the locale segment the proxy
 * forwards. The locale routes also wrap this shell in `app/[locale]/layout.tsx`, which adds
 * the header; the 404 renders its own copy because a `not-found` above the locale segment
 * replaces that layout.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, locale] = await Promise.all([readTheme(), readLocale()])

  return (
    // `data-scroll-behavior="smooth"` declares the global smooth scrolling of `globals.css`,
    // so Next disables it during route transitions instead of fighting it.
    <html lang={locale} data-theme={theme} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
