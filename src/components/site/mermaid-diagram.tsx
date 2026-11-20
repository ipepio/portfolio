'use client'

import dynamic from 'next/dynamic'

/**
 * The mermaid half of a project's description (T2: S2).
 *
 * Only the fence's source is known on the server. The renderer itself is imported lazily —
 * `next/dynamic` with `ssr: false` fetches its chunk when this component first mounts, so a
 * project without a ```mermaid fence (any other project, and this one until its diagram
 * mounts) never downloads mermaid at all. The `<figure>` stays in the server render, which
 * keeps the block in place for the loading skeleton, the live preview and the error state.
 */
const MermaidCanvas = dynamic(() => import('@/components/site/mermaid-canvas'), {
  ssr: false,
  loading: () => (
    <div data-mermaid-loading aria-hidden className="h-40 w-full animate-pulse rounded-xl" />
  ),
})

export function MermaidDiagram({ source }: { source: string }) {
  return (
    <figure
      data-mermaid-diagram
      className="my-2 overflow-x-auto rounded-2xl border border-border bg-secondary/40 p-4 sm:p-6"
    >
      <MermaidCanvas source={source} />
    </figure>
  )
}
