import { createHash } from 'node:crypto'

/** The two locales Payload localizes the posts collection in. */
export type TranslationLocale = 'es' | 'en'

/** Where the translator lives: any OpenAI-compatible `/chat/completions` endpoint. */
export type TranslationConfig = {
  /** Endpoint root, without the trailing `/chat/completions` and without a trailing slash. */
  baseUrl: string
  /** Sent as a bearer token only when the provider needs one (llama.cpp usually does not). */
  apiKey?: string
  model: string
}

/**
 * Leaves sent in one chat completion. Article prose leaves are short, so a small batch
 * keeps the answer aligned with the input; a long body is split into several calls.
 */
const NODES_PER_CALL = 20

/**
 * The translator is asked for prose only: code, links and marks never reach it, because
 * the Lexical walker copies those nodes verbatim and rewrites only text leaves.
 */
const SYSTEM_PROMPT = [
  'You translate technical writing between Spanish and English.',
  'Keep product, company and technology names untranslated: NestJS, Postgres, Kubernetes, ipepio, LiteLLM, llama.cpp.',
  'Translate the meaning faithfully and keep the tone of the original.',
  'Answer with a JSON array of strings only: one translation per input string, in the same order and with the same length, no wrapper object and no commentary.',
].join(' ')

/** One text leaf of the Lexical tree, addressed by the child indexes that lead to it. */
type TextLeaf = {
  path: number[]
  text: string
}

/** Structural shape of a Lexical node; only the keys the walker reads are named. */
export type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

/** A serialized Lexical state, which is what Payload stores for a `richText` field. */
export type RichTextDocument = {
  root: LexicalNode
  [key: string]: unknown
}

/** Containers whose text leaves are prose, and therefore translatable. */
const PROSE_CONTAINERS = new Set(['paragraph', 'heading', 'listitem', 'quote'])

/** Containers copied verbatim: code is code in every language. */
const VERBATIM_CONTAINERS = new Set(['code', 'code-block'])

type ChatCompletionResponse = {
  choices?: { message?: { content?: unknown } }[]
}

/**
 * Reads the transport from the environment. Both the base URL and the model are
 * required: with either one absent there is no translator, and callers skip instead of
 * failing, which is what keeps a save working in an environment without one.
 */
export function translationConfig(): TranslationConfig | null {
  const baseUrl = process.env.TRANSLATION_BASE_URL?.trim().replace(/\/+$/, '')
  const model = process.env.TRANSLATION_MODEL?.trim()
  const apiKey = process.env.TRANSLATION_API_KEY?.trim()

  if (!baseUrl || !model) return null

  return apiKey ? { apiKey, baseUrl, model } : { baseUrl, model }
}

/**
 * Short stable hash of a field value, used to remember what this module last wrote.
 * Strings hash as themselves and rich text hashes as its serialized form, so the same
 * value always produces the same 16 hex characters.
 */
export function hashOf(value: unknown): string {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value ?? null)

  return createHash('sha256').update(serialized).digest('hex').slice(0, 16)
}

/**
 * Turns the model's answer into exactly one translation per input string. Anything else
 * (prose around the JSON, a different length, an empty item) is an error so the caller
 * can retry instead of writing a mismatched array back into the document.
 */
function parseTranslations(content: string, expected: number): string[] {
  const json = content
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('translator did not answer with JSON')
  }

  if (!Array.isArray(parsed) || parsed.length !== expected) {
    const received = Array.isArray(parsed) ? String(parsed.length) : 'no'
    throw new Error(`translator returned ${received} translations for ${expected} strings`)
  }

  const translations = parsed.map((item) => (typeof item === 'string' ? item : ''))

  if (translations.some((item) => item.trim() === '')) {
    throw new Error('translator returned an empty translation')
  }

  return translations
}

/** One chat completion for one chunk of strings, validated against the chunk length. */
async function requestTranslations(
  config: TranslationConfig,
  strings: string[],
  from: TranslationLocale,
  to: TranslationLocale,
): Promise<string[]> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(config.apiKey ? { authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify({ from, strings, to }) },
      ],
    }),
  })

  if (!response.ok) throw new Error(`translator answered ${response.status}`)

  const body = (await response.json()) as ChatCompletionResponse
  const content = body.choices?.[0]?.message?.content

  if (typeof content !== 'string') throw new Error('translator answered without content')

  return parseTranslations(content, strings.length)
}

/**
 * One retry per chunk: a single malformed or failed answer should not cost the author
 * the translation, and a second failure is a real error for the caller to handle.
 */
async function translateChunk(
  config: TranslationConfig,
  chunk: string[],
  from: TranslationLocale,
  to: TranslationLocale,
): Promise<string[]> {
  try {
    return await requestTranslations(config, chunk, from, to)
  } catch {
    return requestTranslations(config, chunk, from, to)
  }
}

/**
 * Translates a list of strings in order, splitting it into chunks of `NODES_PER_CALL`.
 * Every chunk is validated on its own, so a short or long answer never shifts the texts
 * of the following leaves.
 */
export async function translateBatch(
  strings: string[],
  from: TranslationLocale,
  to: TranslationLocale,
): Promise<string[]> {
  const config = translationConfig()
  if (!config) throw new Error('translation is not configured')

  const translations: string[] = []
  for (let start = 0; start < strings.length; start += NODES_PER_CALL) {
    const chunk = strings.slice(start, start + NODES_PER_CALL)
    translations.push(...(await translateChunk(config, chunk, from, to)))
  }

  if (translations.length !== strings.length) {
    throw new Error(`translator returned ${translations.length} strings for ${strings.length}`)
  }

  return translations
}

/**
 * Collects the text leaves that carry prose. The `prose` flag turns on inside the
 * translatable containers and off again inside a verbatim one, so text inside a link or
 * a bold run is translated while text inside a code node never is.
 */
function collectLeaves(
  node: LexicalNode,
  path: number[],
  prose: boolean,
  leaves: TextLeaf[],
): void {
  if (typeof node.type === 'string' && VERBATIM_CONTAINERS.has(node.type)) return

  if (node.type === 'text' && prose && typeof node.text === 'string' && node.text.trim() !== '') {
    leaves.push({ path, text: node.text })
    return
  }

  const children = Array.isArray(node.children) ? node.children : []
  const childrenAreProse =
    prose || (typeof node.type === 'string' && PROSE_CONTAINERS.has(node.type))

  children.forEach((child, index) => {
    collectLeaves(child, [...path, index], childrenAreProse, leaves)
  })
}

/** Resolves a leaf path inside the given root; the tree was walked, so a miss is a bug. */
function nodeAtPath(root: LexicalNode, path: number[]): LexicalNode {
  let node = root
  for (const index of path) {
    const child = node.children?.[index]
    if (!child) throw new Error(`rich text path ${path.join('.')} does not resolve`)
    node = child
  }

  return node
}

/**
 * Translates a Lexical document node by node: the state is deep-copied, only the text
 * leaves of prose containers are sent to the translator, and each answer is written back
 * at the path it came from. Marks (`format`, `style`), links, list structure and code
 * nodes are untouched because nothing but `text` is ever replaced.
 */
export async function translateRichText(
  doc: RichTextDocument,
  from: TranslationLocale,
  to: TranslationLocale,
): Promise<RichTextDocument> {
  const copy = structuredClone(doc)

  const leaves: TextLeaf[] = []
  collectLeaves(copy.root, [], false, leaves)

  // A body that is only code (or empty) has nothing to translate, so no request is made.
  if (leaves.length === 0) return copy

  const translations = await translateBatch(
    leaves.map((leaf) => leaf.text),
    from,
    to,
  )

  leaves.forEach((leaf, index) => {
    nodeAtPath(copy.root, leaf.path).text = translations[index]
  })

  return copy
}
