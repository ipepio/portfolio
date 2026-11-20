/**
 * The project detail's raw markdown (T2: S1, S2).
 *
 * `projects.longDescription` is a textarea: the owner writes markdown and this module turns
 * it into the two kinds of block the page paints — prose HTML, and the source of a mermaid
 * diagram. It is deliberately plain TypeScript with no React and no DOM so that the very
 * same parse runs on the server (the page's first render) and on the client (every
 * live-preview message the admin sends while the editor types), which is what keeps a
 * freshly typed mermaid fence from needing a reload.
 *
 * The split is line based instead of token based: a fenced ```mermaid block is cut out
 * before marked ever sees it, while every other fence stays in the prose and marked renders
 * it as a `<pre><code>` block. Fence tracking means a ```mermaid line that only appears
 * *inside* another code block is left alone.
 */
import { marked } from 'marked'

/** One piece of a parsed description, in document order. */
export type MarkdownBlock = { kind: 'prose'; html: string } | { kind: 'mermaid'; source: string }

/** An opening or closing fence: up to three spaces, three or more backticks or tildes. */
const FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*([^\s`]*)/

/** A fence that closes: the same run, alone on its line. */
const CLOSING_FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/

/**
 * How the generated prose is styled: the same reading design the lexical renderer had
 * (sizing, leading, colour, headings, lists, links), extended to the elements marked emits
 * that the lexical block never produced — inline code, `pre` blocks, ordered lists, quotes.
 */
export const MARKDOWN_PROSE_CLASS = [
  'flex max-w-[68ch] flex-col gap-4 text-base leading-[1.75] text-muted-foreground',
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4',
  '[&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5',
  '[&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-foreground',
  '[&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground',
  '[&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground',
  '[&_li]:my-1',
  '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
  '[&_p]:m-0',
  '[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border',
  '[&_pre]:border-border [&_pre]:bg-secondary [&_pre]:p-4',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[13px]',
  '[&_strong]:text-foreground',
  '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
].join(' ')

/**
 * Parses a stored `longDescription` into ordered blocks.
 *
 * `gfm: true` keeps tables, strikethrough and autolinks working the way the owner expects
 * from any markdown editor, and `async: false` makes marked return the HTML synchronously:
 * `marked.parse` is typed to return a string only for the synchronous form, and both the
 * server render and the live re-render need the string now, in the same tick.
 *
 * XSS: the returned HTML is inserted with `dangerouslySetInnerHTML`-equivalent trust. The
 * source is a field only an authenticated admin user writes, so it is owner content, not
 * visitor input; nothing else on the detail page interpolates markdown. See
 * `components/site/markdown-body.tsx` for the sink itself.
 */
export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []

  let prose: string[] = []
  let mermaid: string[] | null = null
  /** An ordinary fence currently open: its mermaid-looking lines are code, not fences. */
  let fence: { char: string; length: number } | null = null

  const flushProse = () => {
    const text = prose.join('\n').trim()
    prose = []
    if (text.length === 0) return
    blocks.push({ kind: 'prose', html: marked.parse(text, { async: false, gfm: true }) as string })
  }

  for (const line of lines) {
    if (mermaid !== null) {
      const closing = CLOSING_FENCE.exec(line)
      if (closing !== null) {
        blocks.push({ kind: 'mermaid', source: mermaid.join('\n').trim() })
        mermaid = null
        continue
      }
      mermaid.push(line)
      continue
    }

    if (fence !== null) {
      const closing = CLOSING_FENCE.exec(line)
      if (closing !== null && closing[1][0] === fence.char && closing[1].length >= fence.length) {
        fence = null
      }
      prose.push(line)
      continue
    }

    const opening = FENCE.exec(line)
    if (opening !== null) {
      const [, run, info] = opening
      if (info.trim().toLowerCase() === 'mermaid') {
        flushProse()
        mermaid = []
        continue
      }
      fence = { char: run[0], length: run.length }
    }

    prose.push(line)
  }

  // An unterminated mermaid fence is still a diagram attempt: hand it to the client, whose
  // error state falls back to showing the source instead of dropping it.
  if (mermaid !== null) {
    blocks.push({ kind: 'mermaid', source: mermaid.join('\n').trim() })
  }
  flushProse()

  return blocks
}
