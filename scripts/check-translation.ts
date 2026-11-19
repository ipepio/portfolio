/**
 * Runnable check for the automatic post translation (odd/tasks/portfolio-blog.md, T6).
 *
 *   npx tsx scripts/check-translation.ts
 *
 * It starts a fake OpenAI-compatible translator, boots Payload against a **temporary copy**
 * of `ipepio-portfolio.db` (the real database is never opened for writes) and exercises the
 * three guarantees of the hook: a save fills the missing locale, a human edit survives a
 * later save, and a save still works with no translator configured or with a broken answer.
 * Nothing here is part of the app; the file exists to make the behaviour reproducible
 * without an LLM.
 */
import assert from 'node:assert/strict'
import { copyFile, mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { LexicalNode } from '../src/lib/translation'
import type { Post } from '../src/payload-types'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const realDatabase = path.join(repoRoot, 'ipepio-portfolio.db')

/** Text of the code nodes in the fixture body; it must reach the other locale untouched. */
const CODE_TEXT = 'const total = suma(1, 2)'
const CODE_BLOCK_TEXT = 'npm run dev'

const SPANISH_TITLE = 'Los agentes no son chatbots.'
const SPANISH_SUBTITLE = 'Subtítulo de prueba.'
const SPANISH_EXCERPT = 'Extracto de prueba.'
const SPANISH_CATEGORY = 'IA / Agentes'

const HANDWRITTEN_TITLE = 'Handwritten English title'

/** Answers the fake translator can give; the check drives them one by one. */
type FakeMode = 'ok' | 'wrong-length' | 'malformed'

type FakeRequest = { from: string; to: string; strings: string[] }

let fakeMode: FakeMode = 'ok'
const fakeRequests: FakeRequest[] = []

/** Deterministic "translation": the target locale prefix plus the original string. */
const fakeServer = createServer((request, response) => {
  let raw = ''
  request.on('data', (chunk) => {
    raw += chunk
  })
  request.on('end', () => {
    try {
      const body = JSON.parse(raw) as { messages?: { content?: string }[] }
      const asked = JSON.parse(body.messages?.[1]?.content ?? '{}') as FakeRequest
      fakeRequests.push(asked)

      const prefix = asked.to === 'en' ? 'EN:' : 'ES:'
      const translated = asked.strings.map((text) => `${prefix} ${text}`)
      const answer = fakeMode === 'wrong-length' ? translated.slice(0, -1) : translated

      response.writeHead(200, { 'content-type': 'application/json' })
      response.end(
        JSON.stringify({
          choices: [
            {
              message: {
                content:
                  fakeMode === 'malformed' ? 'these are not translations' : JSON.stringify(answer),
              },
            },
          ],
        }),
      )
    } catch (error) {
      response.writeHead(500, { 'content-type': 'application/json' })
      response.end(JSON.stringify({ error: String(error) }))
    }
  })
})

const textNode = (text: string, format = 0) => ({
  type: 'text',
  text,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const block = (type: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
  type,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  textFormat: 0,
  ...extra,
  children,
})

/** A body with every node kind the walker distinguishes: heading, prose, code and a quote. */
const bodyFor = (heading: string, paragraph: string, quote: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      block('heading', [textNode(heading)], { tag: 'h2' }),
      // format 1 is Lexical's bold bit: the mark has to survive the translation.
      block('paragraph', [textNode('Parte normal. '), textNode(paragraph, 1)]),
      block('code', [textNode(CODE_TEXT)], { language: 'typescript' }),
      block('code-block', [textNode(CODE_BLOCK_TEXT)]),
      block('quote', [textNode(quote)]),
    ],
  },
})

/** A Lexical node with its text removed: the part of the document a translation must keep. */
type NodeShape = {
  type?: string
  format?: unknown
  tag?: unknown
  language?: unknown
  children?: NodeShape[]
}

type BodyScan = {
  /** Text of the leaves outside code, in document order. */
  prose: string[]
  code: string[]
  codeBlock: string[]
  /** Node types and marks with the text removed; proves only the wording changed. */
  shape: NodeShape | null
}

/** One walk that separates prose from verbatim text and records the document skeleton. */
function scanBody(value: unknown): BodyScan {
  const prose: string[] = []
  const code: string[] = []
  const codeBlock: string[] = []

  const shapeOf = (node: LexicalNode): NodeShape => ({
    type: node.type,
    format: node.format,
    tag: node.tag,
    language: node.language,
    children: node.children?.map(shapeOf),
  })

  const walk = (node: LexicalNode, verbatim: 'code' | 'codeBlock' | null): void => {
    const kind = node.type === 'code' ? 'code' : node.type === 'code-block' ? 'codeBlock' : verbatim

    if (typeof node.text === 'string') {
      if (kind === 'code') code.push(node.text)
      else if (kind === 'codeBlock') codeBlock.push(node.text)
      else prose.push(node.text)
    }

    node.children?.forEach((child) => walk(child, kind))
  }

  const root = (value as { root?: LexicalNode } | null | undefined)?.root
  if (root) walk(root, null)

  return { code, codeBlock, prose, shape: root ? shapeOf(root) : null }
}

const log = (label: string): void => console.log(`✓ ${label}`)

async function main(): Promise<void> {
  // A fresh port for the fake translator, so the base URL can be handed to Payload inline.
  console.log('· starting fake translator')
  await new Promise<void>((resolve) => fakeServer.listen(0, '127.0.0.1', resolve))
  const port = (fakeServer.address() as AddressInfo).port

  // The real database is only ever read: Payload boots against a copy in a temp directory
  // and every write in this check lands there.
  const scratch = await mkdtemp(path.join(tmpdir(), 'translation-check-'))
  const databaseCopy = path.join(scratch, 'portfolio.db')
  await copyFile(realDatabase, databaseCopy)

  process.env.DATABASE_URI = `file:${databaseCopy}`
  process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || 'translation-check-secret'
  process.env.TRANSLATION_BASE_URL = `http://127.0.0.1:${port}/v1`
  process.env.TRANSLATION_MODEL = 'fake-translator'
  delete process.env.TRANSLATION_API_KEY

  // Configured above before the config module is evaluated, because it reads `DATABASE_URI`.
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  console.log('· booting Payload against the database copy')
  const payload = await getPayload({ config: await config })
  console.log('· Payload ready')

  try {
    console.log('· creating a Spanish post')
    const created = await payload.create({
      collection: 'posts',
      locale: 'es',
      // SAFETY: the body fixture is a plain Lexical state, wider than the generated rich
      // text type; the Local API only stores it and every read is narrowed by `scanBody`.
      data: {
        title: SPANISH_TITLE,
        slug: 'translation-check',
        subtitle: SPANISH_SUBTITLE,
        excerpt: SPANISH_EXCERPT,
        category: SPANISH_CATEGORY,
        body: bodyFor('El problema real', 'Una demo impresiona.', 'La cita original.'),
        readMinutes: 3,
        publishedAt: '2026-01-01T09:00:00.000Z',
        status: 'published',
      } as unknown as Post,
    })
    const id = created.id

    const read = (locale: 'es' | 'en') =>
      payload.findByID({
        collection: 'posts',
        id,
        locale,
        depth: 0,
        fallbackLocale: 'none',
        // `translationState` is hidden from the admin and, by default, from responses.
        showHiddenFields: true,
      })

    console.log('· step 1: first save')
    // 1. Saving a Spanish post fills every empty English field, node by node.
    const english = await read('en')
    assert.equal(english.title, `EN: ${SPANISH_TITLE}`, 'English title should be translated')
    assert.equal(english.subtitle, `EN: ${SPANISH_SUBTITLE}`, 'English subtitle should be filled')
    assert.equal(english.excerpt, `EN: ${SPANISH_EXCERPT}`, 'English excerpt should be filled')
    assert.equal(english.category, `EN: ${SPANISH_CATEGORY}`, 'English category should be filled')

    const firstBody = scanBody(english.body)
    assert.deepEqual(
      firstBody.prose,
      [
        'EN: El problema real',
        'EN: Parte normal. ',
        'EN: Una demo impresiona.',
        'EN: La cita original.',
      ],
      'every prose leaf (heading, bold run, paragraph, quote) should be translated',
    )
    assert.deepEqual(firstBody.code, [CODE_TEXT], 'code text must stay verbatim')
    assert.deepEqual(firstBody.codeBlock, [CODE_BLOCK_TEXT], 'code-block text must stay verbatim')
    assert.deepEqual(
      firstBody.shape,
      scanBody((await read('es')).body).shape,
      'only the wording may change: node types and marks must stay intact',
    )
    assert.ok(
      !fakeRequests.some((request) => request.strings.includes(CODE_TEXT)),
      'code must never be sent to the translator',
    )
    log('a Spanish save fills the English fields and copies code verbatim')

    // SAFETY: `translationState` is a plain JSON field the hook writes, and the generated
    // Post type does not describe it until the next `payload generate:types` run.
    const stateAfterCreate = (
      (await read('es')) as unknown as { translationState?: Record<string, Record<string, string>> }
    ).translationState
    assert.ok(stateAfterCreate, 'the hook should store the hashes of what it wrote')
    assert.ok(
      stateAfterCreate.title?.en,
      'the English title hash should be remembered so a later save can update it',
    )

    console.log('· step 2: human edit')
    // 2. A human edit in English: the hook must not revisit it, and must not touch the
    //    human-written Spanish title either.
    await payload.update({
      collection: 'posts',
      id,
      locale: 'en',
      data: { title: HANDWRITTEN_TITLE },
    })

    const afterHumanEdit = await read('en')
    assert.equal(afterHumanEdit.title, HANDWRITTEN_TITLE, 'the human title should be stored')
    assert.equal(
      (await read('es')).title,
      SPANISH_TITLE,
      'an English save must not overwrite the human Spanish title',
    )
    log('a handwritten English title survives its own save')

    console.log('· step 3: Spanish source edit')
    // 3. The Spanish source moves on: the human English title stays, the rest follows.
    await payload.update({
      collection: 'posts',
      id,
      locale: 'es',
      // SAFETY: same untyped Lexical fixture as the create call above.
      data: {
        title: 'Los agentes no son chatbots, revisado.',
        excerpt: 'Extracto revisado.',
        body: bodyFor('El problema actualizado', 'Una demo nueva impresiona.', 'La cita nueva.'),
      } as unknown as Post,
    })

    const afterSourceEdit = await read('en')
    assert.equal(afterSourceEdit.title, HANDWRITTEN_TITLE, 'the human title must survive')
    assert.equal(afterSourceEdit.excerpt, 'EN: Extracto revisado.', 'machine text should follow')
    assert.equal(
      afterSourceEdit.subtitle,
      `EN: ${SPANISH_SUBTITLE}`,
      'an unchanged source keeps its translation',
    )

    const secondBody = scanBody(afterSourceEdit.body)
    assert.deepEqual(
      secondBody.prose,
      [
        'EN: El problema actualizado',
        'EN: Parte normal. ',
        'EN: Una demo nueva impresiona.',
        'EN: La cita nueva.',
      ],
      'the English body should follow the edited Spanish body',
    )
    assert.deepEqual(secondBody.code, [CODE_TEXT], 'the code block must still be verbatim')
    assert.deepEqual(
      secondBody.codeBlock,
      [CODE_BLOCK_TEXT],
      'the code-block must still be verbatim',
    )
    log('a later Spanish save keeps the human edit and updates the machine text')

    console.log('· step 4: no translator')
    // 4. No transport configured: the save works and nothing is translated. Both halves of
    //    the configuration are checked, because either one missing means "no translator".
    for (const variable of ['TRANSLATION_BASE_URL', 'TRANSLATION_MODEL'] as const) {
      const configured = process.env[variable]
      delete process.env[variable]
      const requestsBeforeUnconfigured = fakeRequests.length
      const title = `Los agentes no son chatbots, sin ${variable}.`

      const savedWithoutTranslator = await payload.update({
        collection: 'posts',
        id,
        locale: 'es',
        data: { title },
      })

      assert.ok(savedWithoutTranslator, `the save should resolve without ${variable}`)
      assert.equal(
        fakeRequests.length,
        requestsBeforeUnconfigured,
        `no request should be made without ${variable}`,
      )
      assert.equal(
        (await read('es')).title,
        title,
        `the Spanish save should still be stored without ${variable}`,
      )
      assert.equal(
        (await read('en')).title,
        HANDWRITTEN_TITLE,
        `nothing should be translated without ${variable}`,
      )
      assert.equal(
        (await read('en')).excerpt,
        'EN: Extracto revisado.',
        `no field should be half-written without ${variable}`,
      )

      process.env[variable] = configured
    }
    log(
      'with no TRANSLATION_BASE_URL or TRANSLATION_MODEL the save succeeds and nothing is translated',
    )

    console.log('· step 5: broken answers')
    // 5. The translator answers with something unusable: one retry, then the save survives
    //    and still writes nothing.
    process.env.TRANSLATION_BASE_URL = `http://127.0.0.1:${port}/v1`

    for (const brokenMode of ['malformed', 'wrong-length'] as const) {
      fakeMode = brokenMode
      const requestsBeforeBroken = fakeRequests.length

      await payload.update({
        collection: 'posts',
        id,
        locale: 'es',
        data: { excerpt: `Extracto con respuesta ${brokenMode}.` },
      })

      assert.equal(
        fakeRequests.length - requestsBeforeBroken,
        2,
        `a ${brokenMode} answer should be retried exactly once`,
      )
      assert.equal(
        (await read('en')).excerpt,
        'EN: Extracto revisado.',
        `a ${brokenMode} answer must leave the target field untouched`,
      )
    }

    console.log('· step 6: recovery')
    // 6. The next save with a working translator repairs the field: nothing was left dirty.
    fakeMode = 'ok'
    await payload.update({
      collection: 'posts',
      id,
      locale: 'es',
      data: { excerpt: 'Extracto arreglado.' },
    })
    assert.equal(
      (await read('en')).excerpt,
      'EN: Extracto arreglado.',
      'a working translator should translate on the next save',
    )
    log('a malformed answer is retried once, then the save survives and repairs itself')

    console.log('\nall translation checks passed')
  } finally {
    await payload.destroy()
    // `fetch` keeps the connection alive, so the server has to drop it before closing.
    fakeServer.closeAllConnections()
    fakeServer.close()
    await rm(scratch, { recursive: true, force: true })
  }
}

// The schema push leaves a child process behind, so the script cannot wait for the event
// loop to drain: every handle is closed above and this only ends the process.
main().then(
  () => process.exit(0),
  (error: unknown) => {
    console.error(`\ntranslation check failed: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  },
)
