'use client'

import { useEffect, useId, useRef, useState } from 'react'

/**
 * Mermaid, loaded the first time a diagram actually mounts (T2: S2).
 *
 * The library never runs on the server and is never part of a page's initial chunks: this
 * module is reached through `next/dynamic` from `MermaidDiagram`, so a project whose
 * description carries no ```mermaid fence downloads none of it.
 *
 * Rendering is done to a string and then adopted into an empty host `<div>`: the SVG is read
 * by the XML parser, which never runs scripts, and the resulting node is imported into this
 * document. Mermaid sanitises its own output (`securityLevel: 'strict'` runs it through
 * DOMPurify) and the source is the owner's markdown, so this boundary is the same trust
 * boundary as the prose beside it: see `lib/markdown.ts`.
 */

/** Diagrams rendered so far in this page load; mermaid needs a fresh id for each render. */
let sequence = 0

/** A flag lives outside the component: configuring mermaid is process-wide, not per diagram. */
let initialised = false

/** Reads a design token from the document, so the diagram follows the active site theme. */
function token(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = styles.getPropertyValue(name).trim()
  return value.length > 0 ? value : fallback
}

export default function MermaidCanvas({ source }: { source: string }) {
  const baseId = useId()
  const host = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true

    const draw = async () => {
      try {
        const mermaid = (await import('mermaid')).default

        if (!initialised) {
          const styles = getComputedStyle(document.documentElement)
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            fontFamily: token(styles, '--font-sans', 'Inter, sans-serif'),
            themeVariables: {
              background: token(styles, '--background', '#0b0d0d'),
              primaryColor: token(styles, '--secondary', '#171c1b'),
              primaryTextColor: token(styles, '--foreground', '#f0f3ed'),
              primaryBorderColor: token(styles, '--border', '#2a3230'),
              secondaryColor: token(styles, '--card', '#131717'),
              tertiaryColor: token(styles, '--background-elevated', '#111515'),
              lineColor: token(styles, '--muted-foreground', '#758079'),
              edgeLabelBackground: token(styles, '--background', '#0b0d0d'),
              clusterBkg: token(styles, '--background-elevated', '#111515'),
              clusterBorder: token(styles, '--border', '#2a3230'),
              titleColor: token(styles, '--foreground', '#f0f3ed'),
            },
          })
          initialised = true
        }

        // A fresh id per render: mermaid names the `<svg>` after it, and reusing an id that
        // is already in the document (the previous live-preview render) makes it throw.
        const id = `mermaid-${baseId.replace(/[^a-zA-Z0-9_-]/g, '')}-${(sequence += 1)}`
        const { svg } = await mermaid.render(id, source)

        if (!active || host.current === null) return
        const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml')
        if (parsed.querySelector('parsererror') !== null) throw new Error('mermaid: invalid svg')
        host.current.replaceChildren(document.importNode(parsed.documentElement, true))
        setFailed(false)
        setReady(true)
      } catch {
        if (active) setFailed(true)
      }
    }

    void draw()

    return () => {
      active = false
    }
  }, [baseId, source])

  // A diagram mermaid cannot parse is shown as its source instead of vanishing: the owner
  // typed something, so the page keeps it visible (and a live edit that fixes it re-renders).
  if (failed) {
    return (
      <pre
        data-mermaid-error
        className="max-w-full overflow-x-auto rounded-xl border border-border bg-secondary p-4 text-[13px] text-muted-foreground"
      >
        <code className="font-mono">{source}</code>
      </pre>
    )
  }

  return (
    <>
      {ready ? null : (
        <div data-mermaid-loading aria-hidden className="h-40 w-full animate-pulse rounded-xl" />
      )}
      <div
        ref={host}
        data-mermaid-svg
        className="flex w-full justify-center [&_svg]:h-auto [&_svg]:max-w-full"
      />
    </>
  )
}
