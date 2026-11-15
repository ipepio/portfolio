import type { About } from '../payload-types'

export type RichText = NonNullable<About['bio']>

/**
 * Minimal Lexical JSON builder for plain paragraphs.
 * Shape verified against the richText fields in src/payload-types.ts.
 */
export function richText(paragraphs: string[]): RichText {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        textFormat: 0,
        children: [
          {
            type: 'text',
            text,
            version: 1,
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
          },
        ],
      })),
    },
  }
}
