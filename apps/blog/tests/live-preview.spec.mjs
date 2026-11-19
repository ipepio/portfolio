/**
 * Behaviour test for the article's live preview (T13: S13).
 *
 * It drives the running blog in a real browser and simulates what Payload's admin does while
 * the editor types: `@payloadcms/live-preview-react`'s `useLivePreview` accepts a `message`
 * event whose `origin` is the Payload server and whose `data` is
 *
 *     { type: 'payload-live-preview', collectionSlug, data: <the whole form values>, locale }
 *
 * (see `apps/blog/node_modules/@payloadcms/live-preview/dist/isLivePreviewEvent.js`). The
 * browser sets `origin` from the sending window, so the test posts the same event the admin's
 * iframe would deliver — `new MessageEvent('message', { data, origin })` — and then reads the
 * page as a reader would. Nothing is saved: the document the test sends never reaches the
 * database, and the last step proves it by reloading.
 *
 * Both applications must be running: the blog on 3200 and the portfolio/Payload app on 3000
 * (its REST API is where the article's note comes from, and where the update is merged).
 *
 * Run it separately from the `node --test tests/` suite — it needs a browser and the two
 * servers:
 *
 *     npm run test:live-preview
 */
import { expect, test } from '@playwright/test'

const BLOG_URL = (process.env.BLOG_URL ?? 'http://localhost:3200').replace(/\/+$/, '')

/** The admin's origin: the live-preview event is only accepted from the Payload server. */
const PAYLOAD_URL = (process.env.PAYLOAD_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

const LOCALE = 'es'
const SLUG = 'agentes-no-son-chatbots'

/** The document as the editor's form holds it: one locale, fields flattened. */
async function storedDocument() {
  const query = new URLSearchParams({
    'where[slug][equals]': SLUG,
    depth: '0',
    locale: LOCALE,
    limit: '1',
  })
  const response = await fetch(`${PAYLOAD_URL}/api/posts?${query.toString()}`)

  expect(response.ok, `Payload answered ${response.status} for the seeded note`).toBe(true)

  const [doc] = (await response.json()).docs

  expect(doc, `expected a stored note with slug ${SLUG}`).toBeTruthy()

  return doc
}

/** An upload of the seeded media library, for the cover half of the update. */
async function seededCover() {
  const response = await fetch(`${PAYLOAD_URL}/api/media?limit=1&depth=0`)

  expect(response.ok, `Payload answered ${response.status} for the media library`).toBe(true)

  const [upload] = (await response.json()).docs

  expect(upload, 'expected a seeded upload to use as the live cover').toBeTruthy()

  return upload
}

/** Every `h2` of a Lexical body, in document order — what the section index lists. */
function headingsOf(body) {
  return body.root.children
    .filter((node) => node.type === 'heading' && node.tag === 'h2')
    .map((node) => node.children.map((child) => child.text ?? '').join('').trim())
}

/** A readable anchor for a heading, exactly as `lib/reading.ts` derives it. */
function anchorFor(title) {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug.length > 0 ? slug : 'seccion'
}

/**
 * The editor's message, posted into the page. `origin` is set by the init dictionary the way
 * the browser sets it on a real cross-window message.
 */
async function postLivePreview(page, doc) {
  await page.evaluate(
    ({ message, origin }) => {
      window.dispatchEvent(new MessageEvent('message', { data: message, origin }))
    },
    {
      origin: PAYLOAD_URL,
      message: {
        type: 'payload-live-preview',
        collectionSlug: 'posts',
        data: doc,
        locale: LOCALE,
      },
    },
  )
}

test('the article re-renders from the editor message and reverts on reload', async ({ page }) => {
  const stored = await storedDocument()
  const storedHeadings = headingsOf(stored.body)
  const cover = await seededCover()

  expect(storedHeadings.length, 'the seeded note must have sections').toBeGreaterThan(1)

  const storedHeading = storedHeadings[1]
  const liveTitle = `${stored.title} (sin guardar)`
  const liveHeading = `${storedHeading} sin guardar`

  // The live document the panel sends: the stored note with what the editor has typed on top,
  // including a cover the stored note does not have.
  const live = structuredClone(stored)
  const secondHeading = live.body.root.children.filter(
    (node) => node.type === 'heading' && node.tag === 'h2',
  )[1]

  live.title = liveTitle
  live.cover = cover.id
  // One text node, replaced: the heading keeps its node identity and its tag.
  secondHeading.children = [{ ...secondHeading.children[0], text: liveHeading }]

  // Count the documents the browser loads: a live update must never be one of them.
  let documentLoads = 0

  page.on('load', () => {
    documentLoads += 1
  })

  await page.goto(`${BLOG_URL}/${LOCALE}/${SLUG}`)

  // 1. A plain page load renders the stored note, artwork and all.
  await expect(page.locator('.reading-title')).toHaveText(stored.title)
  await expect(page.locator('[data-reading-toc] a').nth(1)).toHaveText(`02. ${storedHeading}`)
  await expect(page.locator('.reading-cover-image')).toHaveCount(0)
  expect(documentLoads).toBe(1)

  // 2./3. The editor types: title, the second heading and the cover change, nothing is saved.
  // A message that arrives before the page's listener exists is lost, so the dispatch is
  // retried until the page takes it; what it renders afterwards is asserted once, below.
  await expect(async () => {
    await postLivePreview(page, live)
    await expect(page.locator('.reading-title')).toHaveText(liveTitle, { timeout: 1000 })
  }).toPass({ timeout: 15_000 })

  await expect(page.locator('[data-reading-toc] a').nth(1)).toHaveText(`02. ${liveHeading}`)
  await expect(page.locator(`[data-reading-body] h2#${anchorFor(liveHeading)}`)).toHaveText(
    liveHeading,
  )
  // The stored anchor is gone with the text it named: the index is derived from the body.
  await expect(page.locator(`[data-reading-body] h2#${anchorFor(storedHeading)}`)).toHaveCount(0)
  // The cover follows the document too: the upload the editor picked is what the frame paints.
  await expect(page.locator('.reading-cover-image')).toHaveAttribute(
    'src',
    `${PAYLOAD_URL}${cover.url}`,
  )

  // The index entry still points at the live heading and a keyboard can still reach it.
  const entry = page.locator('[data-reading-toc] a').nth(1)

  await expect(entry).toHaveAttribute('href', `#${anchorFor(liveHeading)}`)
  await entry.focus()
  await expect(entry).toBeFocused()

  // A field the test did not touch still follows the document it was sent.
  await expect(page.locator('.reading-subtitle')).toHaveText(stored.subtitle)
  expect(documentLoads, 'the live update must not reload the page').toBe(1)

  // 4. Nothing was persisted: a reload brings the stored document back.
  await page.reload()

  await expect(page.locator('.reading-title')).toHaveText(stored.title)
  await expect(page.locator('[data-reading-toc] a').nth(1)).toHaveText(`02. ${storedHeading}`)
  await expect(page.locator(`[data-reading-body] h2#${anchorFor(storedHeading)}`)).toHaveText(
    storedHeading,
  )
  await expect(page.locator('.reading-cover-image')).toHaveCount(0)
  expect(documentLoads).toBe(2)

  const persisted = await storedDocument()

  expect(persisted.title).toBe(stored.title)
  expect(persisted.cover).toBe(stored.cover)
  expect(headingsOf(persisted.body)).toEqual(storedHeadings)
})
