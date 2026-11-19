/**
 * Behaviour tests for the draft preview (T12: S12).
 *
 * They drive the running blog over HTTP, exactly like the admin's Preview action does, so
 * they assert the token route, the cookie Next sets and what a reader sees — never an
 * internal helper. Start the blog (`npm run dev`, port 3200) with `PREVIEW_SECRET` set —
 *
 *     PREVIEW_SECRET=dev-preview-secret npx next dev -p 3200
 *
 * — and the portfolio/Payload app (port 3000) first: the pages read their notes from Payload.
 * The secret the route compares against is the one the server was started with, so the tests
 * read the same variable, and fall back to the documented development value.
 *
 * The draft-mode cookie is not hardcoded: the tests take it from the route's own
 * `Set-Cookie`, which is what an editor's browser stores.
 *
 * Run with `npm test` inside `apps/blog`.
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const BLOG_URL = (process.env.BLOG_URL ?? 'http://localhost:3200').replace(/\/+$/, '')
const PREVIEW_SECRET = process.env.PREVIEW_SECRET ?? 'dev-preview-secret'

/** The cookie `draftMode().enable()` writes (Next's own name, see the draftMode reference). */
const DRAFT_COOKIE = '__prerender_bypass'

/** Strip scripts and styles, keeping the markup, as the other suites do. */
function markupOf(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
}

/** Same, but tags are removed too, so copy broken across elements is searchable. */
function textOf(html) {
  return markupOf(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function draftUrl(params) {
  return `${BLOG_URL}/api/draft?${new URLSearchParams(params).toString()}`
}

/** The token route, without following the redirect it answers with. */
async function callDraft(params) {
  const response = await fetch(draftUrl(params), { redirect: 'manual' })
  const cookies = response.headers.getSetCookie().filter((cookie) => cookie.startsWith(DRAFT_COOKIE))

  return { response, cookies, body: await response.text() }
}

/** `name=value`, exactly as a browser would send it back. */
function cookieHeaderOf(cookies) {
  const pair = cookies[0]?.split(';')[0]

  assert.ok(pair, `expected a ${DRAFT_COOKIE} cookie in Set-Cookie`)

  return pair
}

async function fetchPage(path, { cookie } = {}) {
  const headers = { 'cache-control': 'no-cache' }

  if (cookie !== undefined) {
    headers.cookie = cookie
  }

  const response = await fetch(`${BLOG_URL}${path}`, { headers })
  const html = await response.text()
  const markup = markupOf(html)

  return { status: response.status, html, markup, text: textOf(html) }
}

/** How many archive cards the index renders, which is what the published filter decides. */
function cardCount(markup) {
  return [...markup.matchAll(/<a[^>]*data-journal-card[^>]*href="/g)].length
}

describe('draft route — the secret is the only way in', () => {
  it('answers 404 when the secret is missing', async () => {
    const { response } = await callDraft({ slug: 'agentes-no-son-chatbots', locale: 'es' })

    assert.equal(response.status, 404)
    assert.equal(response.headers.get('set-cookie'), null, 'no draft cookie without a secret')
  })

  it('answers 404 when the secret is wrong', async () => {
    const { response } = await callDraft({
      secret: 'not-the-secret',
      slug: 'agentes-no-son-chatbots',
      locale: 'es',
    })

    assert.equal(response.status, 404)
    assert.equal(response.headers.get('set-cookie'), null)
  })

  it('does not reveal which part of the token failed', async () => {
    const missing = await callDraft({ slug: 'agentes-no-son-chatbots', locale: 'es' })
    const wrong = await callDraft({
      secret: 'not-the-secret',
      slug: 'agentes-no-son-chatbots',
      locale: 'es',
    })

    assert.equal(missing.response.status, wrong.response.status)
    assert.equal(missing.body, wrong.body)
  })

  it('answers 404 for a valid secret without a slug', async () => {
    const { response } = await callDraft({ secret: PREVIEW_SECRET, locale: 'es' })

    assert.equal(response.status, 404)
    assert.equal(response.headers.get('set-cookie'), null)
  })
})

describe('draft route — a valid token opens draft mode and redirects to the note', () => {
  it('redirects to the Spanish article and sets the draft-mode cookie', async () => {
    const { response, cookies } = await callDraft({
      secret: PREVIEW_SECRET,
      slug: 'agentes-no-son-chatbots',
      locale: 'es',
    })

    assert.equal(response.status, 307)
    assert.equal(new URL(response.headers.get('location'), BLOG_URL).pathname, '/es/agentes-no-son-chatbots')

    assert.equal(cookies.length, 1, 'exactly one draft-mode cookie')
    assert.match(cookies[0], /HttpOnly/i)
    assert.match(cookies[0], /Path=\//i)
    // `httpOnly` and a session cookie: nothing to persist, nothing readable from script.
    assert.doesNotMatch(cookies[0], /Max-Age=[0-9]+/i)
  })

  it('redirects to the same note in English when the locale says so', async () => {
    const { response } = await callDraft({
      secret: PREVIEW_SECRET,
      slug: 'agentes-no-son-chatbots',
      locale: 'en',
    })

    assert.equal(response.status, 307)
    assert.equal(
      new URL(response.headers.get('location'), BLOG_URL).pathname,
      '/en/agentes-no-son-chatbots',
    )
  })

  it('leaves draft mode on the way out and lands back on the index', async () => {
    const { response, cookies } = await callDraft({
      secret: PREVIEW_SECRET,
      locale: 'es',
      exit: '1',
    })

    assert.equal(response.status, 307)
    assert.equal(new URL(response.headers.get('location'), BLOG_URL).pathname, '/es')

    // Disabling deletes the cookie: same name, empty value, already expired.
    assert.equal(cookies.length, 1)
    assert.match(cookies[0], new RegExp(`^${DRAFT_COOKIE}=;`))
    assert.match(cookies[0], /Expires=Thu, 01 Jan 1970/i)
  })
})

describe('preview strip — visible only inside draft mode', () => {
  it('is absent on the index and on an article in normal mode', async () => {
    for (const path of ['/es', '/en', '/es/agentes-no-son-chatbots', '/en/agentes-no-son-chatbots']) {
      const { status, markup, text } = await fetchPage(path)

      assert.equal(status, 200, path)
      assert.doesNotMatch(markup, /data-draft-strip/, path)
      assert.doesNotMatch(text, /BORRADOR · VISTA PREVIA/, path)
      assert.doesNotMatch(text, /DRAFT · PREVIEW/, path)
    }
  })

  it('appears on every previewed page once the draft-mode cookie is sent', async () => {
    const { cookies } = await callDraft({
      secret: PREVIEW_SECRET,
      slug: 'agentes-no-son-chatbots',
      locale: 'es',
    })
    const cookie = cookieHeaderOf(cookies)

    const article = await fetchPage('/es/agentes-no-son-chatbots', { cookie })

    assert.equal(article.status, 200)
    assert.match(article.markup, /data-draft-strip/)
    assert.match(article.text, /BORRADOR · VISTA PREVIA/)

    const index = await fetchPage('/es', { cookie })

    assert.equal(index.status, 200)
    assert.match(index.markup, /data-draft-strip/)
  })

  it('speaks the locale of the page it sits on', async () => {
    const { cookies } = await callDraft({
      secret: PREVIEW_SECRET,
      slug: 'agentes-no-son-chatbots',
      locale: 'en',
    })
    const english = await fetchPage('/en/agentes-no-son-chatbots', { cookie: cookieHeaderOf(cookies) })

    assert.match(english.text, /DRAFT · PREVIEW/)
    assert.doesNotMatch(english.text, /BORRADOR · VISTA PREVIA/)
  })

  it('offers the way out, back to the index of the page locale', async () => {
    const { cookies } = await callDraft({
      secret: PREVIEW_SECRET,
      slug: 'agentes-no-son-chatbots',
      locale: 'es',
    })
    const { markup } = await fetchPage('/es/agentes-no-son-chatbots', { cookie: cookieHeaderOf(cookies) })
    const start = markup.indexOf('data-draft-strip')
    const strip = markup.slice(start, markup.indexOf('</', markup.indexOf('data-draft-exit')))

    assert.match(strip, /href="\/api\/draft\?[^"]*exit=1[^"]*locale=es/)
  })

  it('keeps the public archive exactly as it was, cookie or not', async () => {
    const { cookies } = await callDraft({
      secret: PREVIEW_SECRET,
      slug: 'agentes-no-son-chatbots',
      locale: 'es',
    })
    const cookie = cookieHeaderOf(cookies)
    const plain = await fetchPage('/es')
    const preview = await fetchPage('/es', { cookie })

    assert.equal(plain.status, 200)
    assert.equal(preview.status, 200)
    assert.equal(cardCount(plain.markup), 4)
    assert.equal(cardCount(preview.markup), 4, 'the preview does not leak drafts into the archive')
    assert.equal(
      new URL(preview.markup.match(/<a[^>]*data-journal-featured[^>]*href="([^"]+)"/)?.[1] ?? '/', BLOG_URL)
        .pathname,
      new URL(plain.markup.match(/<a[^>]*data-journal-featured[^>]*href="([^"]+)"/)?.[1] ?? '/', BLOG_URL)
        .pathname,
    )
  })
})
