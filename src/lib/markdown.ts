/**
 * The project detail's raw markdown (T1/T2: S1, S2).
 *
 * `projects.longDescription` is a textarea: the owner writes markdown and this module turns
 * it into the blocks the page paints — prose HTML, the source of a mermaid diagram, and the
 * admonition callouts (`> [!NOTE]`, `> [!DECISION]`, `> [!WARNING]`). It is deliberately
 * plain TypeScript with no React and no DOM so that the very same parse runs on the server
 * (the page's first render) and on the client (every live-preview message the admin sends
 * while the editor types), which is what keeps a freshly typed heading, callout or mermaid
 * fence from needing a reload.
 *
 * The parse returns two things from one pass: the blocks, and the body's headings with the
 * `id` each one carries. The detail page's section index is built from that second list, so
 * the index and the anchors cannot drift from the text — and the live panel, which parses the
 * editor's document with this same function, updates both at once.
 *
 * The split is line based instead of token based: a fenced ```mermaid block and an admonition
 * are cut out before marked ever sees them, while every other fence stays in the prose and
 * marked renders it as a `<pre><code>` block. Fence tracking means a ```mermaid line that
 * only appears *inside* another code block is left alone.
 */
import { Marked } from 'marked'

/** A heading of the body, in document order, with the `id` its anchor uses. */
export type MarkdownHeading = {
  id: string
  /** Plain text of the heading, without inline markup. */
  text: string
  /** Markdown depth: `2` for `##`, `3` for `###`. */
  depth: number
}

/** The three callout tones the owner can write (the marker is case-insensitive). */
export type MarkdownCalloutTone = 'note' | 'decision' | 'warning'

/** One admonition box, with its quoted body parsed into blocks of its own. */
export type MarkdownCalloutBlock = {
  kind: 'callout'
  tone: MarkdownCalloutTone
  /** Text after the marker. Plain text: the reference escapes it, so do we. */
  title: string
  /**
   * The reference's two-digit ordinal for a DECISION box (`01`, `02`, … in document order);
   * `null` for NOTE and WARNING, which carry no number.
   */
  index: string | null
  /** The quoted lines, parsed: a callout body can hold a list, a fence or a mermaid diagram. */
  blocks: MarkdownBlock[]
}

/** One piece of a parsed description, in document order. */
export type MarkdownBlock =
  | { kind: 'prose'; html: string }
  | { kind: 'mermaid'; source: string }
  | MarkdownCalloutBlock

/** The whole result of parsing a description. */
export type ParsedMarkdown = {
  blocks: MarkdownBlock[]
  /** Every heading of the body, in document order (the index filters to depth 2). */
  headings: MarkdownHeading[]
}

/** An opening or closing fence: up to three spaces, three or more backticks or tildes. */
const FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*([^\s`]*)/

/** A fence that closes: the same run, alone on its line. */
const CLOSING_FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/

/** `> [!NOTE] Title`, `> [!DECISION] Title`, `> [!WARNING] Title` (any casing). */
const CALLOUT_HEAD = /^ {0,3}>[ \t]?\[!(NOTE|DECISION|WARNING)\][ \t]*(.*)$/i

/** A line that belongs to the quoted block an admonition opened. */
const QUOTED_LINE = /^ {0,3}>/

/** The quote marker itself, which the admonition body drops before it is parsed. */
const QUOTE_MARKER = /^ {0,3}>[ \t]?/

/**
 * Element styling shared by the reading column and by a callout body. Only the measure,
 * size and leading differ between the two (see the two class strings below).
 */
const PROSE_ELEMENTS = [
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4',
  '[&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5',
  '[&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-foreground',
  '[&_h2]:scroll-mt-[123px] [&_h2]:font-heading [&_h2]:text-[clamp(26px,3vw,34px)]',
  '[&_h2]:font-semibold [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.04em] [&_h2]:text-foreground',
  '[&_h3]:scroll-mt-[123px] [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold',
  '[&_h3]:leading-snug [&_h3]:text-foreground',
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
 * How the generated prose is styled: the same reading design the lexical renderer had
 * (sizing, leading, colour, headings, lists, links), extended to the elements marked emits
 * that the lexical block never produced — inline code, `pre` blocks, ordered lists, quotes.
 */
export const MARKDOWN_PROSE_CLASS = [
  'flex max-w-[68ch] flex-col gap-4 text-base leading-[1.75] text-muted-foreground',
  PROSE_ELEMENTS,
].join(' ')

/**
 * The same elements inside a callout, where the reference's `case-decision` sets a smaller
 * type size (`13px`) than the reading column.
 */
export const MARKDOWN_CALLOUT_PROSE_CLASS = [
  'flex min-w-0 flex-col gap-2 text-[13px] leading-[1.8] text-muted-foreground',
  PROSE_ELEMENTS,
].join(' ')

/**
 * The `id` a heading anchors to: lowercased, accents stripped, anything that is not a letter
 * or a digit collapsed into a single dash. Empty headings fall back to `seccion` so that the
 * anchor is always usable.
 */
export function slugifyHeading(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug.length > 0 ? slug : 'seccion'
}

/** State shared by every chunk of one document: headings, used ids and decision numbering. */
type ParseState = {
  /** The marked instance of this document, with the heading renderer that stamps the ids. */
  parser: Marked
  headings: MarkdownHeading[]
  usedIds: Set<string>
  /** How many DECISION boxes have been numbered so far, across the whole document. */
  decisions: number
}

/**
 * Builds the marked instance of one document.
 *
 * GitHub's `heading` rule is overridden so that every heading is emitted with an `id` derived
 * from its own text, and so that the same heading is recorded for the section index. Both
 * come from a single call, which is what keeps the anchor and its link identical.
 */
function createState(): ParseState {
  const headings: MarkdownHeading[] = []
  const usedIds = new Set<string>()

  const parser = new Marked({ gfm: true })
  parser.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens)
        const text = this.parser.parseInline(tokens, this.parser.textRenderer).trim()
        const base = slugifyHeading(text)

        let id = base
        let suffix = 2
        while (usedIds.has(id)) {
          id = `${base}-${suffix}`
          suffix += 1
        }
        usedIds.add(id)

        headings.push({ id, text, depth })
        return `<h${depth} id="${id}">${html}</h${depth}>`
      },
    },
  })

  return { parser, headings, usedIds, decisions: 0 }
}

/** Drops the leading and trailing blank lines of a block's body. */
function trimBlankLines(lines: string[]): string[] {
  let start = 0
  let end = lines.length
  while (start < end && lines[start].trim().length === 0) start += 1
  while (end > start && lines[end - 1].trim().length === 0) end -= 1
  return lines.slice(start, end)
}

/**
 * Turns the lines of one markdown chunk into blocks.
 *
 * Recursive on purpose: an admonition's quoted body is scanned with these same rules, so a
 * fence, a list or a whole mermaid diagram inside a callout renders exactly as it does at the
 * top level, and the document's decision numbering and heading list stay in document order.
 */
function scanLines(lines: string[], state: ParseState): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []

  let prose: string[] = []
  let mermaid: string[] | null = null
  /** An ordinary fence currently open: its mermaid-looking lines are code, not fences. */
  let fence: { char: string; length: number } | null = null

  const flushProse = () => {
    const text = prose.join('\n').trim()
    prose = []
    if (text.length === 0) return
    blocks.push({
      kind: 'prose',
      html: state.parser.parse(text, { async: false, gfm: true }) as string,
    })
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

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

    const callout = CALLOUT_HEAD.exec(line)
    if (callout !== null) {
      flushProse()

      const body: string[] = []
      let cursor = index + 1
      while (cursor < lines.length) {
        const quoted = lines[cursor]
        // Only `>`-prefixed lines belong to the callout: a blank line ends the quoted block,
        // exactly as CommonMark ends a blockquote (a body that needs a blank line writes `>`).
        if (!QUOTED_LINE.test(quoted)) break
        body.push(quoted.replace(QUOTE_MARKER, ''))
        cursor += 1
      }

      const tone = callout[1].toLowerCase() as MarkdownCalloutTone
      if (tone === 'decision') state.decisions += 1

      blocks.push({
        kind: 'callout',
        tone,
        title: callout[2].trim(),
        index: tone === 'decision' ? String(state.decisions).padStart(2, '0') : null,
        blocks: scanLines(trimBlankLines(body), state),
      })
      index = cursor - 1
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

/**
 * Parses a stored `longDescription` into ordered blocks plus the body's headings.
 *
 * `gfm: true` keeps tables, strikethrough and autolinks working the way the owner expects
 * from any markdown editor, and `async: false` makes marked return the HTML synchronously:
 * `parse` is typed to return a string only for the synchronous form, and both the server
 * render and the live re-render need the string now, in the same tick.
 *
 * XSS: the returned HTML is inserted with `dangerouslySetInnerHTML`-equivalent trust. The
 * source is a field only an authenticated admin user writes, so it is owner content, not
 * visitor input; nothing else on the detail page interpolates markdown. See
 * `components/site/markdown-body.tsx` for the sink itself.
 */
export function parseMarkdown(source: string): ParsedMarkdown {
  const state = createState()
  const blocks = scanLines(source.replace(/\r\n?/g, '\n').split('\n'), state)

  return { blocks, headings: state.headings }
}
