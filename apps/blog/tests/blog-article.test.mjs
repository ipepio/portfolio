/**
 * Behaviour tests for the blog article page (T4: S1, S9).
 *
 * They drive the running blog over HTTP, exactly like a reader would, so they assert the
 * rendered page and not any internal helper. Start the blog (`npm run dev`, port 3200) and
 * the portfolio/Payload app (port 3000) first: the article reads its note from Payload.
 *
 * Run with `npm test` inside `apps/blog`.
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const BLOG_URL = (process.env.BLOG_URL ?? 'http://localhost:3200').replace(/\/+$/, '')

/** Strip scripts and styles, keeping the markup: the RSC payload inlined by Next would
 * otherwise double every string and attribute the assertions count. */
function markupOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
}

/** Same, but tags are removed too, so copy broken across elements and the `<!-- -->`
 * separators React inserts between text children is searchable as one sentence. */
function textOf(html) {
  return markupOf(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchPage(path) {
  const response = await fetch(`${BLOG_URL}${path}`, { headers: { 'cache-control': 'no-cache' } })
  const html = await response.text()
  const markup = markupOf(html)

  return { status: response.status, html, markup, text: textOf(html) }
}

/** The section index only: its own block, so an anchor in the body cannot satisfy it. */
function tocMarkup(markup) {
  const start = markup.indexOf('data-reading-toc')

  assert.notEqual(start, -1, 'the article must render a section index')

  return markup.slice(start, markup.indexOf('</nav>', start))
}

/** The `Siguiente nota` block, or an empty string when the article omits it. */
function nextMarkup(markup) {
  const start = markup.indexOf('data-reading-next')

  return start === -1 ? '' : markup.slice(start)
}

function cardHrefs(markup) {
  return [...markup.matchAll(/<a[^>]*data-journal-card[^>]*href="([^"]+)"/g)].map((match) => match[1])
}

/** Both the archive cards and the featured note link to one of the seeded notes. */
function noteHrefs(markup) {
  return [
    ...cardHrefs(markup),
    ...[...markup.matchAll(/<a[^>]*data-journal-featured[^>]*href="([^"]+)"/g)].map(
      (match) => match[1],
    ),
  ]
}

describe('blog article — Spanish note', () => {
  it('renders the hero, the byline and the body of the seeded note', async () => {
    const { status, markup, text } = await fetchPage('/es/agentes-no-son-chatbots')

    assert.equal(status, 200)
    assert.match(markup, /data-reading-body/)
    assert.match(markup, /<h1[^>]*class="reading-title"[^>]*>/)
    assert.match(text, /Los agentes no son chatbots con herramientas\./)
    assert.match(
      text,
      /Diseñar agentes útiles implica bastante más que conectar un LLM a una terminal\./,
    )
    assert.match(text, /Isaac Pepió/)
    assert.match(text, /8 MIN DE LECTURA/)
    assert.match(text, /IA \/ Agentes \/ 8 MIN/) // hero kicker: category and read time
    assert.match(text, /Este artículo es una muestra de diseño\./) // side note
    assert.match(markup, /\/\/ DISCLAIMER/)
    assert.match(text, /PREVISUALIZACIÓN EDITORIAL/) // footer, unchanged
  })

  it('builds the section index from the body headings and anchors them', async () => {
    const { markup, text } = await fetchPage('/es/agentes-no-son-chatbots')
    const toc = tocMarkup(markup)

    assert.match(toc, /href="#el-problema-real"/)
    assert.match(toc, /href="#el-enfoque"/)
    assert.match(toc, /href="#decisiones-que-importan"/)
    assert.match(text, /01\. El problema real/)
    assert.match(text, /02\. El enfoque/)
    assert.match(text, /03\. Decisiones que importan/)
    // The index follows the document order, like the article it summarises.
    assert.ok(toc.indexOf('#el-problema-real') < toc.indexOf('#el-enfoque'))
    assert.ok(toc.indexOf('#el-enfoque') < toc.indexOf('#decisiones-que-importan'))
    // Every entry points at a heading that carries the same id.
    assert.match(markup, /<h2[^>]*id="el-problema-real"[^>]*>[^<]*El problema real/)
    assert.match(markup, /<h2[^>]*id="el-enfoque"[^>]*>[^<]*El enfoque/)
    assert.match(markup, /<h2[^>]*id="decisiones-que-importan"[^>]*>[^<]*Decisiones que importan/)
  })

  it('closes the article with the next older note in the archive order', async () => {
    const { markup, text } = await fetchPage('/es/agentes-no-son-chatbots')
    const next = nextMarkup(markup)

    assert.match(next, /data-reading-next-link[^>]*href="\/es\/cache-contexto-subagentes"/)
    assert.match(text, /SIGUIENTE NOTA/)
    assert.match(text, /Contexto, caché y subagentes: el coste invisible\./)
    assert.match(text, /Leer siguiente/)
  })
})

describe('blog article — English note', () => {
  it('renders the English title, headings and section index', async () => {
    const { status, markup, text } = await fetchPage('/en/agentes-no-son-chatbots')
    const toc = tocMarkup(markup)

    assert.equal(status, 200)
    assert.match(text, /Agents are not chatbots with tools\./)
    assert.match(text, /Designing useful agents takes far more than connecting an LLM to a terminal\./)
    assert.match(text, /8 MIN READ/)
    assert.match(text, /01\. The real problem/)
    assert.match(text, /02\. The approach/)
    assert.match(text, /03\. Decisions that matter/)
    assert.match(toc, /href="#the-real-problem"/)
    assert.match(toc, /href="#the-approach"/)
    assert.match(toc, /href="#decisions-that-matter"/)
    assert.match(markup, /<h2[^>]*id="the-real-problem"[^>]*>[^<]*The real problem/)
    assert.match(text, /This is a layout sample\./) // side note
    assert.match(text, /NEXT NOTE/)
    assert.match(nextMarkup(markup), /href="\/en\/cache-contexto-subagentes"/)
    assert.match(text, /EDITORIAL PREVIEW/) // footer, unchanged
  })

  it('names the post in the document metadata', async () => {
    const { html } = await fetchPage('/en/agentes-no-son-chatbots')

    assert.match(html, /<title>[^<]*Agents are not chatbots with tools\./)
    assert.match(
      html,
      /<meta name="description" content="An agent system starts where the demo ends: permissions, context, execution, observability, and failures you still need to own\."/,
    )
  })
})

describe('blog article — the next note is the next older published note', () => {
  it('follows the archive order between two later notes', async () => {
    const { markup, text } = await fetchPage('/en/homelab-que-no-moleste')

    assert.match(nextMarkup(markup), /href="\/en\/llm-local-cuando-compensa"/)
    assert.match(text, /Local LLMs: when are they actually worth it\?/)
  })

  it('omits the block on the oldest note instead of rendering an empty frame', async () => {
    const { status, markup, text } = await fetchPage('/es/nabla-harness-escritorio')

    assert.equal(status, 200)
    assert.doesNotMatch(markup, /data-reading-next/)
    assert.doesNotMatch(text, /SIGUIENTE NOTA/)
  })
})

describe('blog article — missing pages', () => {
  it('answers an unknown slug with 404', async () => {
    const { status } = await fetchPage('/es/no-existe')

    assert.equal(status, 404)
  })

  it('answers a locale the blog does not serve with 404', async () => {
    const { status } = await fetchPage('/fr/agentes-no-son-chatbots')

    assert.equal(status, 404)
  })

  it('serves the article with a trailing slash, or redirects it to the canonical URL', async () => {
    const response = await fetch(`${BLOG_URL}/es/agentes-no-son-chatbots/`, { redirect: 'manual' })

    assert.ok(
      [200, 301, 307, 308].includes(response.status),
      `unexpected status ${response.status}`,
    )

    if (response.status !== 200) {
      const location = response.headers.get('location')

      assert.equal(new URL(location, BLOG_URL).pathname, '/es/agentes-no-son-chatbots')
    }
  })
})

describe('blog article — the archive keeps its own routes', () => {
  it('still serves the index and page 2 instead of an article', async () => {
    const index = await fetchPage('/es')
    const page2 = await fetchPage('/es/page/2')

    assert.equal(index.status, 200)
    assert.match(index.text, /Cosas que me rondan\./)
    assert.equal(cardHrefs(index.markup).length, 4)
    assert.doesNotMatch(index.markup, /data-reading-body/)

    assert.equal(page2.status, 200)
    assert.match(page2.text, /PÁGINA 02 \/ 02/)
    assert.equal(cardHrefs(page2.markup).length, 1)
    assert.doesNotMatch(page2.markup, /data-reading-body/)
  })

  it('resolves every seeded archive link in both locales', async () => {
    const hrefs = []

    for (const path of ['/es', '/es/page/2', '/en', '/en/page/2']) {
      const { markup } = await fetchPage(path)

      hrefs.push(...noteHrefs(markup))
    }

    assert.equal(hrefs.length, 12) // the six seeded notes, in both locales
    assert.equal(new Set(hrefs).size, 12)

    for (const href of hrefs) {
      const { status, markup } = await fetchPage(href)

      assert.equal(status, 200, `${href} must resolve`)
      assert.match(markup, /data-reading-body/, `${href} must render the article`)
    }
  })
})
