import type { Metadata } from 'next'
import type React from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'IPEPIO — Journal',
  description: 'Notas sobre agentes, infraestructura y producto. Field notes on agents, infrastructure and product.',
}

/**
 * The blog's only root layout. The visible design lands in T3/T4; for now it just hosts the
 * locale routes and a readable reset.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
