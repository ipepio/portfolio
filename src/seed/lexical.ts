import type { About } from '../payload-types'

export type RichText = NonNullable<About['bio']>

/**
 * One contiguous run of text inside a paragraph. `bold` sets Lexical's
 * `format` bit field to 1, which the official JSX/HTML converters render
 * as `<strong>` (verified in @payloadcms/richtext-lexical's `text` converter).
 */
export type RichTextRun = { text: string; bold?: boolean }

/** A paragraph is either plain text or a list of formatted runs. */
export type RichTextParagraph = string | RichTextRun[]

/** Lexical packs text styles into a bit field: 0 is plain, 1 is bold. */
const PLAIN_FORMAT = 0
const BOLD_FORMAT = 1

function paragraphRuns(paragraph: RichTextParagraph): RichTextRun[] {
  return typeof paragraph === 'string' ? [{ text: paragraph }] : paragraph
}

function textNode(run: RichTextRun) {
  return {
    type: 'text',
    text: run.text,
    version: 1,
    format: run.bold ? BOLD_FORMAT : PLAIN_FORMAT,
    detail: 0,
    mode: 'normal',
    style: '',
  }
}

/**
 * Minimal Lexical JSON builder. A paragraph may be a plain string or a list
 * of runs, so the same helper seeds plain bios and intros with a bold name.
 * Shape verified against the richText fields in src/payload-types.ts.
 */
export function richText(paragraphs: RichTextParagraph[]): RichText {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        textFormat: 0,
        children: paragraphRuns(paragraph).map(textNode),
      })),
    },
  }
}
