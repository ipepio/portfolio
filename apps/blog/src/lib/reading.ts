/**
 * The article page's two readings of a Lexical body: the section index the sidebar shows
 * and the anchors its links point at.
 *
 * The body arrives from Payload as an editor state, not as HTML, so the page derives both
 * from the same nodes: the index lists the `h2` headings, and the heading converter in
 * `@/components/reading-blocks` gives each of them the id listed here. Deriving the anchor
 * from the heading's own text (instead of from its position) keeps the two independent, so
 * neither needs to know how many times React rendered it.
 */

/** One entry of the section index: the heading's text and the anchor it opens. */
export type ReadingSection = {
  id: string
  title: string
}

/** The slice of a Lexical node this module reads; everything else is opaque to it. */
type LexicalNode = {
  children?: unknown
  root?: unknown
  tag?: unknown
  text?: unknown
  type?: unknown
}

/** Narrow an unknown value to a node without trusting any of its fields. */
function asNode(value: unknown): LexicalNode | null {
  return typeof value === 'object' && value !== null ? (value as LexicalNode) : null
}

/** The plain text of a Lexical node and everything below it. */
export function lexicalText(node: unknown): string {
  const record = asNode(node)

  if (record === null) {
    return ''
  }

  if (typeof record.text === 'string') {
    return record.text
  }

  return Array.isArray(record.children) ? record.children.map(lexicalText).join('') : ''
}

/**
 * A readable anchor for a heading: accents folded, everything that is not a letter or a
 * digit turned into a single dash. Spanish and English headings both survive this, so the
 * same note carries `#el-problema-real` and `#the-real-problem`, each in its own locale.
 */
export function anchorFor(title: string): string {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug.length > 0 ? slug : 'seccion'
}

/**
 * The `h2` headings of a body, in document order: that is what the reference indexes.
 *
 * A repeated heading keeps one entry — both headings then share the first anchor, which is
 * where a reader lands — so the index never links two entries to the same id.
 */
export function readingSections(body: unknown): ReadingSection[] {
  const root = asNode(asNode(body)?.root)
  const nodes = Array.isArray(root?.children) ? root.children : []
  const sections: ReadingSection[] = []
  const titles = new Set<string>()

  for (const node of nodes) {
    const heading = asNode(node)

    if (heading?.type !== 'heading' || heading.tag !== 'h2') {
      continue
    }

    const title = lexicalText(heading).trim()

    if (title.length === 0 || titles.has(title)) {
      continue
    }

    titles.add(title)
    sections.push({ id: anchorFor(title), title })
  }

  return sections
}
