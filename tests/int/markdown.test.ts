/**
 * Parser-level coverage, run with the Node test runner and no bundler:
 *
 *   node --import tsx --test tests/int/markdown.test.ts
 *
 * It asserts the two things T1/T2 add to `src/lib/markdown.ts` through its public interface:
 * the heading ids the section index links to, and the admonition callouts (tone, numbering,
 * plain blockquotes unchanged, fences inside a callout still rendered).
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  parseMarkdown,
  type MarkdownBlock,
  type MarkdownCalloutBlock,
} from '../../src/lib/markdown'

/** Narrow a block to a callout, failing loudly when it is something else. */
function calloutOf(block: MarkdownBlock | undefined): MarkdownCalloutBlock {
  assert.equal(block?.kind, 'callout', `expected a callout block, got ${block?.kind ?? 'nothing'}`)
  return block as MarkdownCalloutBlock
}

/** The HTML of the prose blocks, optionally only the ones containing `needle`. */
function proseHtml(blocks: MarkdownBlock[], needle?: string): string {
  return blocks
    .filter((block): block is { kind: 'prose'; html: string } => block.kind === 'prose')
    .map((block) => block.html)
    .filter((html) => needle === undefined || html.includes(needle))
    .join('\n')
}

describe('parseMarkdown admonitions', () => {
  it('renders a NOTE callout as a neutral, unnumbered box', () => {
    const { blocks } = parseMarkdown(
      ['> [!NOTE] Aviso de lectura', '> El cuerpo de la nota.', '', 'Después.'].join('\n'),
    )

    const note = calloutOf(blocks[0])
    assert.equal(note.tone, 'note')
    assert.equal(note.title, 'Aviso de lectura')
    assert.equal(note.index, null)
    assert.match(proseHtml(note.blocks), /El cuerpo de la nota\./)
    // The paragraph after the quote is not swallowed by the callout.
    assert.match(proseHtml(blocks, 'Después.'), /Después\./)
  })

  it('numbers DECISION boxes 01 and 02 in document order', () => {
    const { blocks } = parseMarkdown(
      [
        '> [!DECISION] Primera',
        '> Uno.',
        '',
        '> [!NOTE] En medio',
        '> No cuenta.',
        '',
        '> [!DECISION] Segunda',
        '> Dos.',
      ].join('\n'),
    )

    const [first, note, second] = blocks
    assert.equal(calloutOf(first).index, '01')
    assert.equal(calloutOf(first).title, 'Primera')
    // NOTE does not consume a number: the two DECISION boxes are 01 and 02.
    assert.equal(calloutOf(note).index, null)
    assert.equal(calloutOf(second).index, '02')
    assert.equal(calloutOf(second).title, 'Segunda')
    assert.match(proseHtml(calloutOf(second).blocks), /Dos\./)
  })

  it('keeps numbering continuous across the whole document', () => {
    const { blocks } = parseMarkdown(
      [
        '## Uno',
        '',
        '> [!DECISION] A',
        '> a',
        '',
        '## Dos',
        '',
        '> [!DECISION] B',
        '> b',
        '',
        '> [!DECISION] C',
        '> c',
      ].join('\n'),
    )

    const indexes = blocks.filter((block) => block.kind === 'callout').map((block) => block.index)
    assert.deepEqual(indexes, ['01', '02', '03'])
  })

  it('renders a WARNING callout with the warning tone', () => {
    const { blocks } = parseMarkdown(['> [!WARNING] Cuidado', '> Esto rompe.'].join('\n'))

    const warning = calloutOf(blocks[0])
    assert.equal(warning.tone, 'warning')
    assert.equal(warning.title, 'Cuidado')
    assert.equal(warning.index, null)
    assert.match(proseHtml(warning.blocks), /Esto rompe\./)
  })

  it('matches the marker case-insensitively', () => {
    const { blocks } = parseMarkdown('> [!note] minúsculas')

    assert.equal(calloutOf(blocks[0]).tone, 'note')
  })

  it('leaves a plain blockquote as a blockquote', () => {
    const { blocks } = parseMarkdown(['> Una cita normal.', '> Con dos líneas.'].join('\n'))

    assert.ok(blocks.every((block) => block.kind === 'prose'))
    assert.match(proseHtml(blocks), /<blockquote>/)
    assert.match(proseHtml(blocks), /Una cita normal\./)
  })

  it('leaves an unknown marker as a blockquote', () => {
    const { blocks } = parseMarkdown('> [!TIP] No es un callout')

    assert.ok(blocks.every((block) => block.kind === 'prose'))
    assert.match(proseHtml(blocks), /<blockquote>/)
    assert.match(proseHtml(blocks), /\[!TIP\]/)
  })

  it('renders a fence inside an admonition body', () => {
    const { blocks } = parseMarkdown(
      [
        '> [!NOTE] Con código',
        '> Antes.',
        '>',
        '> ```js',
        '> const a = 1',
        '> ```',
        '>',
        '> Después.',
      ].join('\n'),
    )

    const note = calloutOf(blocks[0])
    assert.match(proseHtml(note.blocks), /<pre><code class="language-js">/)
    assert.match(proseHtml(note.blocks), /const a = 1/)
    assert.match(proseHtml(note.blocks), /Después\./)
  })

  it('renders a mermaid fence inside an admonition body as a diagram', () => {
    const { blocks } = parseMarkdown(
      [
        '> [!NOTE] Con diagrama',
        '> ```mermaid',
        '> flowchart LR',
        '>   A --> B',
        '> ```',
        '',
        'Fuera.',
      ].join('\n'),
    )

    const note = calloutOf(blocks[0])
    assert.equal(note.blocks.length, 1)
    assert.deepEqual(note.blocks[0], { kind: 'mermaid', source: 'flowchart LR\n  A --> B' })
    assert.match(proseHtml(blocks, 'Fuera.'), /Fuera\./)
  })

  it('keeps a top-level fence out of the callout scan', () => {
    const { blocks } = parseMarkdown(['```md', '> [!NOTE] dentro de un fence', '```'].join('\n'))

    assert.equal(blocks.length, 1)
    assert.equal(blocks[0].kind, 'prose')
    assert.match(proseHtml(blocks), /\[!NOTE\] dentro de un fence/)
  })
})

describe('parseMarkdown headings', () => {
  it('collects ## headings in document order with the id the anchor uses', () => {
    const { blocks, headings } = parseMarkdown(
      ['## Resumen', 'Texto.', '', '## Decisiones de ingeniería', 'Texto.', '', '### Detalle'].join(
        '\n',
      ),
    )

    assert.deepEqual(headings, [
      { id: 'resumen', text: 'Resumen', depth: 2 },
      { id: 'decisiones-de-ingenieria', text: 'Decisiones de ingeniería', depth: 2 },
      { id: 'detalle', text: 'Detalle', depth: 3 },
    ])
    // The id the index links to is the id the heading carries.
    const html = proseHtml(blocks)
    assert.match(html, /<h2 id="resumen">Resumen<\/h2>/)
    assert.match(html, /<h2 id="decisiones-de-ingenieria">Decisiones de ingeniería<\/h2>/)
  })

  it('keeps duplicate headings apart so every anchor resolves', () => {
    const { blocks, headings } = parseMarkdown(['## Stack', '', '## Stack'].join('\n'))

    assert.deepEqual(
      headings.map((heading) => heading.id),
      ['stack', 'stack-2'],
    )
    assert.match(proseHtml(blocks), /id="stack-2"/)
  })

  it('reports no headings for a body without ##', () => {
    const { headings } = parseMarkdown(['Solo texto.', '', '- una lista'].join('\n'))

    assert.deepEqual(headings, [])
  })
})
