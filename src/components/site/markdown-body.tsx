import { MermaidDiagram } from '@/components/site/mermaid-diagram'
import {
  MARKDOWN_CALLOUT_PROSE_CLASS,
  MARKDOWN_PROSE_CLASS,
  parseMarkdown,
  type MarkdownBlock,
  type MarkdownCalloutBlock,
  type MarkdownCalloutTone,
} from '@/lib/markdown'

export type MarkdownBodyProps = {
  /** Raw markdown, as the owner typed it in `projects.longDescription`. */
  source: string
  /** Extra layout classes, appended to the reading styles. */
  className?: string
}

export type MarkdownBlocksProps = {
  /** Blocks already parsed by `parseMarkdown`, so a caller that needs the headings parses once. */
  blocks: MarkdownBlock[]
  /**
   * Inside a callout the reference sets a smaller type size than the reading column, so the
   * nested body uses its own measure and leading instead of the reading one.
   */
  compact?: boolean
}

/**
 * The reference's `case-decision` box, in the three tones the owner can write.
 *
 * `DECISION` is the numbered one (`01`, `02`, … in document order); `NOTE` is neutral and
 * `WARNING` keeps the same shape in the destructive tone. A plain `>` quote never reaches
 * this component: it stays inside the prose and keeps the quieter blockquote styling.
 */
const CALLOUT_CLASSNAMES: Record<MarkdownCalloutTone, { box: string; title: string }> = {
  note: {
    box: 'rounded-xl border border-border bg-secondary/40 p-5',
    title: 'text-foreground',
  },
  decision: {
    box: 'grid grid-cols-[33px_minmax(0,1fr)] gap-3.5 rounded-xl border border-border bg-card p-5',
    title: 'text-foreground',
  },
  warning: {
    box: 'rounded-xl border border-destructive/50 bg-destructive/10 p-5',
    title: 'text-destructive',
  },
}

/** The body of one admonition, laid out like the reference's `case-decision`. */
function Callout({ block }: { block: MarkdownCalloutBlock }) {
  const tone = CALLOUT_CLASSNAMES[block.tone]
  const index = block.index

  const body = (
    <div className="flex min-w-0 flex-col gap-2">
      {block.title ? (
        <h3
          className={`font-heading text-base font-semibold leading-snug tracking-[-0.025em] ${tone.title}`}
        >
          {block.title}
        </h3>
      ) : null}
      {block.blocks.length > 0 ? <MarkdownBlocks blocks={block.blocks} compact /> : null}
    </div>
  )

  if (index === null) {
    return <div className={tone.box}>{body}</div>
  }

  return (
    <div className={tone.box}>
      <span aria-hidden className="mono text-xs font-bold leading-[1.8] text-primary">
        {index}
      </span>
      {body}
    </div>
  )
}

/** The block list as React nodes, in document order. */
function blockNodes(blocks: MarkdownBlock[]) {
  return blocks.map((block, index) => {
    if (block.kind === 'mermaid') {
      return <MermaidDiagram key={`mermaid-${index}`} source={block.source} />
    }

    if (block.kind === 'callout') {
      return <Callout key={`callout-${index}`} block={block} />
    }

    return (
      <div
        key={`prose-${index}`}
        // `contents` keeps the wrapper out of the flex column, so the generated headings,
        // paragraphs and lists lay out exactly as the lexical block did.
        className="contents"
        // pi-lens-ignore: dangerously-set-inner-html
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    )
  })
}

/** Prose HTML, mermaid diagrams and callouts, in document order. */
export function MarkdownBlocks({ blocks, compact = false }: MarkdownBlocksProps) {
  return (
    <div className={compact ? MARKDOWN_CALLOUT_PROSE_CLASS : MARKDOWN_PROSE_CLASS}>
      {blockNodes(blocks)}
    </div>
  )
}

/**
 * The rendered body of a project's raw markdown (T1/T2: S1, S2): prose HTML, one
 * `MermaidDiagram` per ```mermaid fence, and the admonition callouts, in document order.
 *
 * It is a plain component on purpose — no `'use client'` — so the detail page can render it
 * in the server pass and its live half can render the very same thing from the editor's
 * document, with no second markdown implementation to keep in sync. A caller that also needs
 * the body's headings parses once and renders `MarkdownBlocks` instead of this wrapper.
 *
 * XSS: the prose is marked's own HTML for a field only an authenticated admin user writes.
 * There is no visitor-supplied markdown on the page, so this is the owner's content — its
 * trust boundary is the admin session, not the reader — and sanitising it would break the
 * markdown the owner is allowed to type (raw HTML included). Mermaid diagrams are sanitised
 * by mermaid itself, and the mermaid canvas adopts its SVG through the XML parser. A callout
 * title is rendered as text by React, never as HTML.
 */
export function MarkdownBody({ source, className }: MarkdownBodyProps) {
  const { blocks } = parseMarkdown(source)

  return (
    <div
      className={
        className === undefined ? MARKDOWN_PROSE_CLASS : `${MARKDOWN_PROSE_CLASS} ${className}`
      }
    >
      {blockNodes(blocks)}
    </div>
  )
}
