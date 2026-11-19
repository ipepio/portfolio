/**
 * Behaviour tests for the blog header (T8: S10) and the designed 404 (T9: S11).
 *
 * They drive the running blog over HTTP, exactly like a reader would, so they assert the
 * rendered page and not any internal helper. Start the blog (`npm run dev`, port 3200) and
 * the portfolio/Payload app (port 3000) first: the pages read their notes from Payload.
 *
 * Run with `npm test` inside `apps/blog`.
 *
 * On the 404s: Next answers a URL that matches no route with server-rendered HTML, but a
 * `notFound()` thrown inside a page is delivered as a client-rendered shell — the page body
 * arrives as the inlined RSC payload, not as markup (the framework decides this; the
 * portfolio, on the same Next version, behaves the same). The assertions below therefore
 * read the whole response body with the payload's JSON quoting normalised, which is what the
 * reader ends up seeing either way.
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const BLOG_URL = (process.env.BLOG_URL ?? 'http://localhost:3200').replace(/\/+$/, '')
const PORTFOLIO_URL = (process.env.PORTFOLIO_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

/** Strip scripts and styles, keeping the markup: the RSC payload inlined by Next would
 * otherwise double every string and attribute the assertions count. */
function markupOf(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
}

/**
 * The response as the reader receives it: markup plus the inlined RSC payload, with the
 * payload's `\"` quoting normalised so both forms answer the same assertions.
 */
function bodyOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, (script) => script.replace(/\\{1,}"/g, '"'))
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
}

/** Same, but tags are removed too, so copy broken across elements is searchable. */
function textOf(html) {
  return bodyOf(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchPage(path, { cookie } = {}) {
  const headers = { 'cache-control': 'no-cache' }

  if (cookie !== undefined) {
    headers.cookie = cookie
  }

  const response = await fetch(`${BLOG_URL}${path}`, { headers })
  const html = await response.text()
  const markup = markupOf(html)

  return { status: response.status, html, markup, body: bodyOf(html), text: textOf(html) }
}

/** The header block only, so a link elsewhere in the page cannot satisfy a header assertion. */
function headerMarkup(markup) {
  const start = markup.indexOf('data-journal-header')

  assert.notEqual(start, -1, 'the blog must render the header')

  return markup.slice(start, markup.indexOf('</header>', start))
}

/**
 * Targets of `<a data-… href="…">` for one marker, in document order.
 *
 * Works on both response shapes: real markup, and the inlined RSC payload Next uses for a
 * `notFound()` 404 (where the anchor is `["$r","a",null,{"data-…":true,"href":"…"}]`).
 */
function hrefsFor(body, marker) {
  const fromMarkup = [
    ...body.matchAll(new RegExp(`<a[^>]*${marker}[^>]*href="([^"]+)"`, 'g')),
  ].map((match) => match[1])

  if (fromMarkup.length > 0) {
    return fromMarkup
  }

  // Payload shape: the anchor attributes are one JSON object, so read the first href after
  // each marker (attributes precede the children).
  return [...body.matchAll(new RegExp(marker, 'g'))]
    .map((match) => body.slice(match.index, match.index + 240).match(/"href":"([^"]+)"/)?.[1])
    .filter((href) => href !== undefined)
}

/** The opening tag that carries `marker`, so its other attributes can be inspected. */
function tagFor(markup, marker) {
  const match = markup.match(new RegExp(`<[a-z]+[^>]*${marker}[^>]*>`))

  assert.notEqual(match, null, `expected a tag carrying ${marker}`)

  return match[0]
}

function htmlTag(html) {
  const match = markupOf(html).match(/<html[^>]*>/)

  assert.notEqual(match, null, 'the document must have an <html> tag')

  return match[0]
}

describe('blog header — identity, links and controls', () => {
  it('renders the journal identity, the archive and the portfolio link on /es', async () => {
    const { status, markup } = await fetchPage('/es')
    const header = headerMarkup(markup)

    assert.equal(status, 200)
    assert.match(header, /<nav[^>]*aria-label="Navegación principal"/) // nav landmark, labelled
    assert.match(header, /class="journal-brand-logo"/) // the portfolio's logo, not a monogram
    assert.match(header, /IPEPIO \/ BLOG/) // journal identity, Spanish
    assert.doesNotMatch(header, />IP</) // the old monogram box is gone
    assert.deepEqual(hrefsFor(header, 'data-journal-brand'), ['/es'])
    assert.deepEqual(hrefsFor(header, 'data-journal-nav-index'), ['/es'])
    assert.deepEqual(hrefsFor(header, 'data-journal-nav-portfolio'), [PORTFOLIO_URL])
    assert.match(tagFor(header, 'data-journal-nav-portfolio'), /target="_blank"/)
    assert.match(tagFor(header, 'data-journal-nav-portfolio'), /rel="noopener noreferrer"/)
  })

  it('loads the language identity from the locale', async () => {
    const { markup } = await fetchPage('/en')
    const header = headerMarkup(markup)

    assert.match(header, /JOURNAL/)
    assert.doesNotMatch(header, /CUADERNO/)
    assert.match(header, /<nav[^>]*aria-label="Main navigation"/)
  })

  it('marks the archive link as the current page on the index and on later archive pages', async () => {
    for (const path of ['/es', '/es/page/2']) {
      const { markup } = await fetchPage(path)
      const archive = tagFor(headerMarkup(markup), 'data-journal-nav-index')

      assert.match(archive, /aria-current="page"/, `${path}: archive must be current`)
    }
  })

  it('does not claim the archive is the current page on an article', async () => {
    const { markup } = await fetchPage('/es/agentes-no-son-chatbots')
    const archive = tagFor(headerMarkup(markup), 'data-journal-nav-index')

    assert.match(archive, /href="\/es"/)
    assert.doesNotMatch(archive, /aria-current/)
  })

  it('offers a labelled theme toggle that starts from the rendered theme', async () => {
    const dark = headerMarkup((await fetchPage('/es')).markup)
    const light = headerMarkup((await fetchPage('/es', { cookie: 'ipepio-theme=light' })).markup)

    assert.match(tagFor(dark, 'data-journal-theme'), /<button/)
    assert.match(tagFor(dark, 'data-journal-theme'), /aria-label="Cambiar a tema claro"/)
    assert.match(tagFor(light, 'data-journal-theme'), /aria-label="Cambiar a tema oscuro"/)
  })
})

describe('blog header — the language switch lands on the equivalent page', () => {
  it('points at the other index from the index', async () => {
    const { markup } = await fetchPage('/es')
    const header = headerMarkup(markup)
    const switchTag = tagFor(header, 'data-journal-language')

    assert.deepEqual(hrefsFor(header, 'data-journal-language'), ['/en'])
    assert.match(switchTag, /hrefLang="en"/i)
    assert.match(switchTag, /aria-label="Ver esta página en inglés"/)
    assert.match(header, />EN<\/a>/)
  })

  it('keeps the archive page number', async () => {
    const { markup } = await fetchPage('/es/page/2')

    assert.deepEqual(hrefsFor(headerMarkup(markup), 'data-journal-language'), ['/en/page/2'])
  })

  it('keeps the article slug', async () => {
    const { markup } = await fetchPage('/es/agentes-no-son-chatbots')

    assert.deepEqual(hrefsFor(headerMarkup(markup), 'data-journal-language'), [
      '/en/agentes-no-son-chatbots',
    ])
  })

  it('switches back to Spanish from the English pages', async () => {
    const { markup } = await fetchPage('/en/agentes-no-son-chatbots')
    const switchTag = tagFor(headerMarkup(markup), 'data-journal-language')

    assert.deepEqual(hrefsFor(headerMarkup(markup), 'data-journal-language'), [
      '/es/agentes-no-son-chatbots',
    ])
    assert.match(switchTag, /aria-label="View this page in Spanish"/)
  })
})

describe('blog header — the theme cookie drives the first paint', () => {
  it('renders light when the shared cookie says light', async () => {
    const { html } = await fetchPage('/es', { cookie: 'ipepio-theme=light' })

    assert.match(htmlTag(html), /data-theme="light"/)
  })

  it('renders dark with the dark cookie, with no cookie and with an unknown value', async () => {
    for (const options of [{ cookie: 'ipepio-theme=dark' }, {}, { cookie: 'ipepio-theme=banana' }]) {
      const { html } = await fetchPage('/es', options)

      assert.match(htmlTag(html), /data-theme="dark"/, JSON.stringify(options))
    }
  })

  it('answers the unmatched-route 404 in the reader theme', async () => {
    const { status, html } = await fetchPage('/nada/que/ver', { cookie: 'ipepio-theme=light' })

    assert.equal(status, 404)
    assert.match(htmlTag(html), /data-theme="light"/)
  })

  it('hands the persisted theme to the reader on a notFound() 404 too', async () => {
    const { status, body } = await fetchPage('/es/no-existe', { cookie: 'ipepio-theme=light' })

    assert.equal(status, 404)
    // The page body is delivered client-side (see the file header), so the theme travels with
    // the header's props instead of as a `<html>` attribute.
    assert.match(body, /"theme":"light"/)
  })
})

describe('blog 404 — a designed page, not the framework default', () => {
  it('answers an unknown slug with the shell, a way back and the featured note', async () => {
    const { status, body, text } = await fetchPage('/es/no-existe')

    assert.equal(status, 404)
    assert.match(text, /ERROR 404/)
    assert.match(text, /Esta nota/)
    assert.match(text, /no existe\./)
    assert.deepEqual(hrefsFor(body, 'data-journal-notfound-index'), ['/es'])
    assert.deepEqual(hrefsFor(body, 'data-journal-notfound-featured'), [
      '/es/agentes-no-son-chatbots',
    ])
    assert.match(text, /PREVISUALIZACIÓN EDITORIAL/) // the footer, unchanged
    assert.doesNotMatch(text, /This page could not be found/) // never the framework default
  })

  it('answers every route the pages reject with the same 404', async () => {
    for (const path of ['/es/page/1', '/es/page/0', '/es/page/9', '/es/page/abc']) {
      const { status, body, text } = await fetchPage(path)

      assert.equal(status, 404, `${path} must not exist`)
      assert.match(text, /Esta nota/, path)
      assert.deepEqual(hrefsFor(body, 'data-journal-notfound-index'), ['/es'], path)
      assert.doesNotMatch(text, /This page could not be found/, path)
    }
  })

  it('speaks Spanish for a locale the blog does not serve, and stays on the Spanish routes', async () => {
    const { status, body, text } = await fetchPage('/fr')

    assert.equal(status, 404)
    assert.match(text, /Esta nota/)
    assert.deepEqual(hrefsFor(body, 'data-journal-notfound-index'), ['/es'])
  })

  it('answers in English when the URL is English', async () => {
    const { status, body, text } = await fetchPage('/en/no-existe')

    assert.equal(status, 404)
    assert.match(text, /LOST ROUTE/)
    assert.match(text, /This note/)
    assert.match(text, /does not exist\./)
    assert.deepEqual(hrefsFor(body, 'data-journal-notfound-index'), ['/en'])
    assert.deepEqual(hrefsFor(body, 'data-journal-notfound-featured'), [
      '/en/agentes-no-son-chatbots',
    ])
  })

  it('serves the designed page as real markup for a URL that matches no route', async () => {
    const { status, markup, text } = await fetchPage('/nada/que/ver')
    const header = headerMarkup(markup)

    assert.equal(status, 404)
    assert.match(header, /<nav[^>]*aria-label="Navegación principal"/)
    assert.deepEqual(hrefsFor(header, 'data-journal-nav-portfolio'), [PORTFOLIO_URL])
    assert.deepEqual(hrefsFor(markup, 'data-journal-notfound-index'), ['/es'])
    assert.match(text, /Esta nota/)
    assert.match(text, /PREVISUALIZACIÓN EDITORIAL/)
  })

  it('claims the Spanish locale for an English 404 as well, in its own language', async () => {
    const { status, text } = await fetchPage('/en/page/9')

    assert.equal(status, 404)
    assert.match(text, /This note/)
    assert.doesNotMatch(text, /Esta nota/)
  })
})

describe('blog header — untouched behaviour still holds', () => {
  it('keeps the footer pointing at the portfolio', async () => {
    const { markup } = await fetchPage('/es')
    const footer = markup.slice(markup.indexOf('class="journal-footer"'))

    assert.match(footer, new RegExp(`<a href="${PORTFOLIO_URL}">`))
    assert.match(footer, /← Portfolio/)
  })

  it('keeps every seeded note and the archive pagination reachable', async () => {
    for (const path of [
      '/es/agentes-no-son-chatbots',
      '/es/cache-contexto-subagentes',
      '/es/monolito-migracion',
      '/es/homelab-que-no-moleste',
      '/es/llm-local-cuando-compensa',
      '/es/nabla-harness-escritorio',
      '/en/agentes-no-son-chatbots',
      '/en/nabla-harness-escritorio',
      '/es/page/2',
      '/en/page/2',
    ]) {
      const { status } = await fetchPage(path)

      assert.equal(status, 200, `${path} must still resolve`)
    }
  })
})
