import type { Metadata } from 'next'
import type React from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'IPEPIO — Journal',
  description: 'Notas sobre agentes, infraestructura y producto. Field notes on agents, infrastructure and product.',
}

/**
 * The blog's only root layout: it hosts the locale routes and loads the design system.
 *
 * Known gap: `<html lang>` is fixed to Spanish because this root layout sits above the
 * `[locale]` segment. Giving each locale its own `lang` means moving the root layout to
 * `app/[locale]/layout.tsx` (the pattern in Next's internationalization guide) and dropping
 * this file; that is a separate change, not part of the index.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
