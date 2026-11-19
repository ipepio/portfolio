/**
 * The article page's presentational blocks: hero, cover, section index, side note, body and
 * the `Siguiente nota` footer.
 *
 * The article is the reference's full reading view, so its blocks are the `reading-*` ones
 * ported into `globals.css`. Every string arrives from the dictionary and every note from
 * Payload: these components only lay the design out.
 */
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import { Art, FeatureVisual, type ArtKind } from '@/components/journal-cover'
import { format, pad, type JournalCopy } from '@/lib/i18n'
import type { ArticleCover } from '@/lib/live-preview'
import type { Locale, PostDetail, PostSummary } from '@/lib/payload'
import { lexicalText, type ReadingSection } from '@/lib/reading'
import { postHref } from '@/lib/routes'

/** Lexical editor state accepted by the official Payload `RichText` renderer. */
type RichTextData = Parameters<typeof RichText>[0]['data']

/**
 * The `reading-hero`: kicker, title, subtitle and byline.
 *
 * The kicker carries the note's category and reading time, and the byline repeats the
 * minutes beside the author, exactly like the reference.
 */
export function ReadingHero({ copy, post }: { copy: JournalCopy; post: PostDetail }) {
  const minutes = typeof post.readMinutes === 'number' ? post.readMinutes : null
  const category = post.category ?? null
  const kicker =
    category === null
      ? minutes === null
        ? null
        : format(copy.readMinutes, { minutes })
      : minutes === null
        ? category
        : format(copy.cardCategory, { category, minutes })

  return (
    <header className="reading-hero">
      {kicker === null ? null : (
        <div className="journal-kicker">
          <i aria-hidden="true" /> {kicker}
        </div>
      )}
      <h1 className="reading-title">{post.title}</h1>
      {post.subtitle === null || post.subtitle === undefined ? null : (
        <p className="reading-subtitle">{post.subtitle}</p>
      )}
      <div className="reading-byline">
        <span className="reading-avatar" aria-hidden="true">
          {copy.authorInitials}
        </span>
        <span>
          <strong>{copy.authorName}</strong> / {copy.authorHandle}
        </span>
        {minutes === null ? null : (
          <>
            <span aria-hidden="true">·</span>
            <span>{format(copy.articleReadMinutes, { minutes })}</span>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span>{copy.articleDraft}</span>
      </div>
    </header>
  )
}

/**
 * The cover frame: the note's own image when it has one, and the artwork when it has not.
 *
 * Payload's `cover` upload is empty for the seeded notes and the reference paints an editorial
 * graphic instead, so the page keeps that graphic: the same art the archive card of this note
 * shows, blown up to the reading width. A note that does carry an upload paints it in the same
 * frame — which is also what makes the cover follow the editor's live document (T13: S13):
 * choosing an image while typing swaps the artwork for it without saving.
 */
export function ReadingCover({
  copy,
  kind,
  serial,
  cover = null,
}: {
  copy: JournalCopy
  kind: ArtKind
  serial: string
  cover?: ArticleCover | null
}) {
  return (
    // The artwork is decoration and is hidden from assistive technology; an uploaded image
    // is content, and keeps its alternative text.
    <div className="reading-cover" aria-hidden={cover === null ? 'true' : undefined}>
      {cover === null ? (
        kind === 'agents' ? (
          <FeatureVisual
            corner={copy.featureCoverCorner}
            serial={serial}
            idTemplate={copy.featureCoverId}
          />
        ) : (
          <div className="journal-graphic is-art">
            <span className="graphic-corner">{copy.featureCoverCorner}</span>
            <Art kind={kind} />
            <span className="graphic-id">{format(copy.featureCoverId, { serial })}</span>
          </div>
        )
      ) : (
        // The URL is the live document's own upload, served by the Payload app at runtime —
        // no build-time remote pattern can describe it, so it is painted as an image and not
        // through `next/image`.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="reading-cover-image" src={cover.url} alt={cover.alt} />
      )}
      <span className="reading-cover-label">{format(copy.articleCoverLabel, { serial })}</span>
    </div>
  )
}

/**
 * The sticky section index: one anchor per `h2` of the body, numbered like the reference.
 *
 * They are real links and not buttons, so the index works without JavaScript and a keyboard
 * reaches every entry with Tab; the ids they point at are the ones `ReadingBody` gives the
 * headings.
 */
export function ReadingToc({ copy, sections }: { copy: JournalCopy; sections: ReadingSection[] }) {
  return (
    <nav className="reading-toc" aria-label={copy.tocTitle} data-reading-toc>
      <span className="journal-kicker">
        <i aria-hidden="true" /> {copy.tocLabel}
      </span>
      {sections.map((section, index) => (
        <a key={section.id} href={`#${section.id}`}>
          {/* One text node: `01. Heading`, exactly as the reference prints the index. */}
          {`${pad(index + 1)}. ${section.title}`}
        </a>
      ))}
    </nav>
  )
}

/**
 * The heading converter that anchors every `h2`, so the section index can link to it.
 *
 * The anchor comes from the heading's own text through `readingSections`, which the index
 * uses as well: the two never depend on render order or on how often the page rendered.
 */
function headingConverters(sections: ReadingSection[]): JSXConvertersFunction {
  const anchors = new Map(sections.map((section) => [section.title, section.id]))

  return ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const anchor = anchors.get(lexicalText(node).trim())
      const props = anchor === undefined ? {} : { id: anchor }

      switch (node.tag) {
        case 'h1':
          return <h1 {...props}>{children}</h1>
        case 'h3':
          return <h3 {...props}>{children}</h3>
        case 'h4':
          return <h4 {...props}>{children}</h4>
        case 'h5':
          return <h5 {...props}>{children}</h5>
        case 'h6':
          return <h6 {...props}>{children}</h6>
        case 'h2':
        default:
          return <h2 {...props}>{children}</h2>
      }
    },
  })
}

/** The Lexical body, rendered by Payload's own renderer so formatting, links and code
 * blocks keep their structure (the blog reads `body`, it does not re-implement it). */
export function ReadingBody({ body, sections }: { body: unknown; sections: ReadingSection[] }) {
  // SAFETY: `body` is a stored Payload lexical editor state; the generated type describes
  // its nodes loosely, while `RichText` requires the full `SerializedEditorState` union. The
  // runtime shape is identical for editor states produced by the configured editor.
  const data = (body ?? null) as unknown as RichTextData | null

  return (
    <article className="reading-body" data-reading-body>
      {data === null ? null : <RichText converters={headingConverters(sections)} data={data} />}
    </article>
  )
}

/** The reference's editorial disclaimer, in the right-hand column on wide screens. */
export function ReadingSideNote({ copy }: { copy: JournalCopy }) {
  return (
    <aside className="reading-side-note">
      <strong>{copy.sideNoteTitle}</strong>
      {copy.sideNoteBody}
    </aside>
  )
}

/**
 * `Siguiente nota`: the note that follows this one in the archive order, with its title and
 * a link to it. The page omits the block instead of rendering it empty when there is none.
 */
export function ReadingEnd({
  locale,
  copy,
  post,
}: {
  locale: Locale
  copy: JournalCopy
  post: PostSummary
}) {
  return (
    <section className="reading-end" data-reading-next>
      <div>
        <div className="journal-kicker">
          <i aria-hidden="true" /> {copy.nextNoteKicker}
        </div>
        <h3>{post.title}</h3>
      </div>
      <a className="journal-page-step" data-reading-next-link href={postHref(locale, post.slug)}>
        {copy.nextNoteAction} ↗
      </a>
    </section>
  )
}
