'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useMemo } from 'react'

import { artKindFor } from '@/components/journal-cover'
import {
  ReadingBody,
  ReadingCover,
  ReadingHero,
  ReadingSideNote,
  ReadingToc,
} from '@/components/reading-blocks'
import { LIVE_PREVIEW_ROUTE, coverOf } from '@/lib/live-preview'
import type { JournalCopy } from '@/lib/i18n'
import type { PostDetail } from '@/lib/payload'
import { readingSections } from '@/lib/reading'

/** The merge request `useLivePreview` would have sent to Payload, once it has a message. */
type MergeRequest = {
  apiPath: string
  data: Record<string, unknown>
  endpoint: string
  serverURL: string
}

/**
 * Where the live document comes from: this application's own route, which forwards the merge
 * to the Payload server (see `lib/live-preview.ts` and `app/api/live-preview`).
 *
 * It is a module-level function on purpose: `useLivePreview` re-subscribes whenever this
 * handler changes identity, and a new subscription drops the document merged so far.
 */
function mergeThroughBlog({ data, endpoint }: MergeRequest): Promise<Response> {
  return fetch(`${LIVE_PREVIEW_ROUTE}/${endpoint}`, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
}

/**
 * The live half of the article (T13: S13): hero, cover, section index, body and side note,
 * rendered from the document the editor currently has on screen.
 *
 * It starts from `initialData` — the note the page read from Payload on the server — so a
 * plain page load renders exactly the stored note, with no flash and no extra paint: the
 * blocks are the same ones this page rendered before it had a live half, in the same order.
 * From then on `useLivePreview` replaces that document with every `payload-live-preview`
 * message the admin sends, and everything the article derives from it follows in the same
 * render: the title, subtitle, category and reading time of the hero, the byline, the cover,
 * the body, and the section index, which is recomputed from the live body (so a new heading
 * gets its own anchor and the index stays keyboard reachable, because its entries are still
 * links).
 *
 * The reader's own note never changes underneath them: only Payload's admin origin is
 * accepted as the sender, so a plain article load has nobody to listen to.
 */
export function LiveArticle({
  copy,
  post,
  serial,
  serverURL,
}: {
  copy: JournalCopy
  post: PostDetail
  serial: string
  serverURL: string
}) {
  const { data } = useLivePreview<PostDetail>({
    initialData: post,
    serverURL,
    // The cover is an upload: one level of depth is what turns its id into the file the
    // article can paint.
    depth: 1,
    requestHandler: mergeThroughBlog,
  })

  const sections = useMemo(() => readingSections(data.body), [data.body])
  const cover = coverOf(data.cover, serverURL)

  return (
    <>
      <ReadingHero copy={copy} post={data} />
      <ReadingCover copy={copy} kind={artKindFor(data.slug)} serial={serial} cover={cover} />
      <div className={sections.length === 0 ? 'reading-layout is-plain' : 'reading-layout'}>
        {sections.length === 0 ? null : <ReadingToc copy={copy} sections={sections} />}
        <ReadingBody body={data.body} sections={sections} />
        <ReadingSideNote copy={copy} />
      </div>
    </>
  )
}
