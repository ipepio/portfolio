/**
 * Behaviour tests for the blog index (T3: S1, S3, S9).
 *
 * They drive the running blog over HTTP, exactly like a reader would, so they assert the
 * rendered page and not any internal helper. Start the blog (`npm run dev`, port 3200) and
 * the portfolio/Payload app (port 3000) first: the index reads its notes from Payload.
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

/** Same, but tags are removed too, so copy broken across `<br />`/`<span>` is searchable. */
function textOf(html) {
  return markupOf(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function count(markup, needle) {
  return markup.split(needle).length - 1
}

/** Every archive card links to the article it summarises; the count is the card count. */
function cardCount(markup) {
  return count(markup, 'data-journal-card')
}

function cardHrefs(markup) {
  return [...markup.matchAll(/<a[^>]*data-journal-card[^>]*href="([^"]+)"/g)].map((m) => m[1])
}

function hrefsFor(markup, marker) {
  return [...markup.matchAll(new RegExp(`<a[^>]*${marker}[^>]*href="([^"]+)"`, 'g'))].map((m) => m[1])
}

async function fetchPage(path) {
  const response = await fetch(`${BLOG_URL}${path}`, { headers: { 'cache-control': 'no-cache' } })
  const html = await response.text()
  const markup = markupOf(html)

  return { status: response.status, html, markup, text: textOf(html) }
}

describe('blog index — page 1 is the canonical archive page', () => {
  it('renders the Spanish hero, featured note and four archive cards', async () => {
    const { status, markup, text } = await fetchPage('/es')

    assert.equal(status, 200)
    assert.match(text, /IPEPIO \/ JOURNAL/) // breadcrumb
    assert.match(text, /EL CUADERNO DE INGENIERÍA/) // hero kicker
    assert.match(text, /Cosas que me rondan\./) // hero h1, split by the reference's line break
    assert.match(text, /Arquitectura, IA, desarrollo, infraestructura y experimentos propios\./)
    assert.match(text, /cat ~\/notes\/about\.md/) // aside code block
    assert.match(text, /CONCEPTO VISUAL · LOS ARTÍCULOS SON EJEMPLOS/) // draft notice
    assert.match(text, /EN PRIMER PLANO/)
    assert.match(text, /Los agentes no son chatbots con herramientas\./) // featured title
    assert.match(text, /LECTURA · 8 MIN/)
    assert.match(text, /POR ISAAC PEPIÓ/)
    assert.match(text, /ARTÍCULO DE EJEMPLO/)
    assert.match(text, /En el radar\./) // archive heading
    assert.match(text, /PREVISUALIZACIÓN EDITORIAL/) // footer
    assert.equal(cardCount(markup), 4)
  })

  it('counts every published note in the archive counter, not the page size', async () => {
    const { text } = await fetchPage('/es')

    assert.match(text, /06 NOTAS/)
    assert.doesNotMatch(text, /04 NOTAS/)
  })

  it('renders the English copy on /en', async () => {
    const { status, markup, text } = await fetchPage('/en')

    assert.equal(status, 200)
    assert.match(text, /NOTES FROM THE ENGINE ROOM/)
    assert.match(text, /Things on my mind\./)
    assert.match(text, /Architecture, AI, software, infrastructure and side experiments\./)
    assert.match(text, /FEATURED NOTE/)
    assert.match(text, /Agents are not chatbots with tools\./)
    assert.match(text, /8 MIN READ/)
    assert.match(text, /BY ISAAC PEPIÓ/)
    assert.match(text, /SAMPLE ARTICLE/)
    assert.match(text, /On my radar\./)
    assert.match(text, /EDITORIAL PREVIEW/)
    assert.equal(cardCount(markup), 4)
  })

  it('links archive cards to the article route and keeps the featured note out of the grid', async () => {
    const { markup } = await fetchPage('/es')
    const hrefs = cardHrefs(markup)

    assert.deepEqual(hrefs, [
      '/es/cache-contexto-subagentes',
      '/es/monolito-migracion',
      '/es/homelab-que-no-moleste',
      '/es/llm-local-cuando-compensa',
    ])
    assert.ok(!hrefs.includes('/es/agentes-no-son-chatbots')) // featured note has its own block
    assert.ok(markup.includes('href="/es/agentes-no-son-chatbots"')) // ...which links to it
  })

  it('offers keyboard-usable previous/next controls with the current page and total', async () => {
    const { markup, text } = await fetchPage('/es')

    assert.match(markup, /data-journal-pagination/)
    assert.deepEqual(hrefsFor(markup, 'data-journal-next'), ['/es/page/2'])
    assert.deepEqual(hrefsFor(markup, 'data-journal-prev'), []) // nothing before page 1
    assert.match(text, /PÁGINA 01 \/ 02/)
  })
})

describe('blog index — later archive pages', () => {
  it('serves the remaining note on /es/page/2', async () => {
    const { status, markup, text } = await fetchPage('/es/page/2')

    assert.equal(status, 200)
    assert.match(text, /En el radar\./)
    assert.equal(cardCount(markup), 1)
    assert.deepEqual(cardHrefs(markup), ['/es/nabla-harness-escritorio'])
    assert.match(text, /PÁGINA 02 \/ 02/)
    assert.deepEqual(hrefsFor(markup, 'data-journal-prev'), ['/es'])
    assert.deepEqual(hrefsFor(markup, 'data-journal-next'), []) // nothing after page 2
  })

  it('serves the English copy on /en/page/2', async () => {
    const { status, markup, text } = await fetchPage('/en/page/2')

    assert.equal(status, 200)
    assert.match(text, /On my radar\./)
    assert.equal(cardCount(markup), 1)
    assert.deepEqual(cardHrefs(markup), ['/en/nabla-harness-escritorio'])
    assert.match(text, /PAGE 02 \/ 02/)
  })

  it('keeps page 1 canonical: /page/1, beyond the last page and junk are 404', async () => {
    for (const path of ['/es/page/1', '/en/page/1', '/es/page/3', '/en/page/3', '/es/page/0', '/es/page/abc']) {
      const { status } = await fetchPage(path)

      assert.equal(status, 404, `${path} must not exist`)
    }
  })
})

describe('blog index — untouched blog routes still behave', () => {
  it('keeps the health endpoint reporting the blog app', async () => {
    const response = await fetch(`${BLOG_URL}/api/health`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.app, '@ipepio/blog')
    assert.equal(body.status, 'ok')
  })

  it('still answers unknown locales with 404', async () => {
    const { status } = await fetchPage('/fr')

    assert.equal(status, 404)
  })
})
