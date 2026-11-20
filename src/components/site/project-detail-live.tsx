'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useState } from 'react'

import { ProjectDetail } from '@/components/site/project-detail'
import type { ProjectDetailItem } from '@/components/site/project-detail'
import type { Locale, ProjectDetailLabels } from '@/lib/i18n'

/** Payload's API lives in this same application, so the default route needs no proxy. */
const API_ROUTE = '/api'

/** The cover and the tags are uploads/relationships: one level is what this page reads. */
const PREVIEW_DEPTH = 1

/**
 * The application's own origin, resolved once on the client.
 *
 * `useLivePreview` compares `event.origin` with it, and Payload's admin posts its messages
 * from the origin that also serves this page (the admin is a route of this same app), so the
 * two always agree — here and in any deployment, without an environment variable.
 *
 * The lazy initialiser is what makes this safe during the server pass: there is no `window`
 * there, so it starts as an empty string, which is never used because the hook only
 * subscribes inside an effect. On the client the first render already has the origin, so the
 * very first subscription is the correct one (an empty `serverURL` would make the hook's
 * `postMessage` target origin invalid).
 */
function useOwnOrigin(): string {
  const [origin] = useState(() => (typeof window === 'undefined' ? '' : window.location.origin))
  return origin
}

/**
 * The live half of a project's detail page (T3: S3), mirroring the blog's `LiveArticle`.
 *
 * `initialData` is the document the page just read from Payload on the server, so a plain
 * load renders exactly the stored project — no flash, no extra paint, same markup and same
 * markup order as before the page had a live half. From then on every
 * `payload-live-preview` message the admin sends while the editor types replaces that
 * document, and the whole detail (title, lead, tags, cover, markdown body) re-renders from
 * it. The markdown parse runs on the client for exactly that reason: a heading, a list or a
 * whole new ```mermaid fence updates without a reload.
 *
 * Projects have no draft state and their reads are public, so there is no draft mode and no
 * token route: the preview URL the admin iframes is the public one, and the merge request the
 * hook sends (`POST /api/projects/:id` with `X-Payload-HTTP-Method-Override: GET`) is a read
 * of the editor's own values answered by this app.
 */
export function LiveProjectDetail({
  project,
  locale,
  labels,
}: {
  project: ProjectDetailItem
  locale: Locale
  labels: ProjectDetailLabels
}) {
  const { data } = useLivePreview<ProjectDetailItem>({
    initialData: project,
    serverURL: useOwnOrigin(),
    apiRoute: API_ROUTE,
    depth: PREVIEW_DEPTH,
  })

  return <ProjectDetail project={data} locale={locale} labels={labels} />
}
