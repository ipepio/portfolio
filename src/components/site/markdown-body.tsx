import { MermaidDiagram } from '@/components/site/mermaid-diagram'
import { MARKDOWN_PROSE_CLASS, parseMarkdown } from '@/lib/markdown'

export type MarkdownBodyProps = {
  /** Raw markdown, as the owner typed it in `projects.longDescription`. */
  source: string
  /** Extra layout classes, appended to the reading styles. */
  className?: string
}

/**
 * The rendered body of a project's raw markdown (T2: S1, S2): prose HTML plus one
 * `MermaidDiagram` per ```mermaid fence, in document order.
 *
 * It is a plain component on purpose — no `'use client'` — so the detail page can render it
 * in the server pass and its live half can render the very same thing from the editor's
 * document, with no second markdown implementation to keep in sync.
 *
 * XSS: the prose is marked's own HTML for a field only an authenticated admin user writes.
 * There is no visitor-supplied markdown on the page, so this is the owner's content — its
 * trust boundary is the admin session, not the reader — and sanitising it would break the
 * markdown the owner is allowed to type (raw HTML included). Mermaid diagrams are sanitised
 * by mermaid itself, and the mermaid canvas adopts its SVG through the XML parser.
 */
export function MarkdownBody({ source, className }: MarkdownBodyProps) {
  const blocks = parseMarkdown(source)

  return (
    <div
      className={
        className === undefined ? MARKDOWN_PROSE_CLASS : `${MARKDOWN_PROSE_CLASS} ${className}`
      }
    >
      {blocks.map((block, index) =>
        block.kind === 'mermaid' ? (
          <MermaidDiagram key={`mermaid-${index}`} source={block.source} />
        ) : (
          <div
            key={`prose-${index}`}
            // `contents` keeps the wrapper out of the flex column, so the generated
            // headings, paragraphs and lists lay out exactly as the lexical block did.
            className="contents"
            // pi-lens-ignore: dangerously-set-inner-html
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        ),
      )}
    </div>
  )
}
