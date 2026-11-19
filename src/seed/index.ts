import { getPayload } from 'payload'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'

import type { About, Experience, Expertise, Post, Project, Tag } from '../payload-types'
import {
  aboutSeed,
  capabilitySeeds,
  contactSeed,
  coreToolNames,
  experienceSeeds,
  extendedToolNames,
  postSeeds,
  projectSeeds,
  tagSeeds,
} from './content'
import type { PostSection } from './content'
import { richText } from './lexical'
import type { RichText } from './lexical'

const payload = await getPayload({ config })

// SAFETY: Payload handles "all" at runtime (globals already type it as `'all' | TypedLocale`),
// but the collection Local API types only allow configured locale codes.
const ALL_LOCALES = 'all' as unknown as 'es'

/** Alt text is the seed's own key for the portrait, which keeps the upload idempotent. */
const PHOTO_ALT = 'Isaac Pepió'
const PHOTO_PATH = fileURLToPath(new URL('../assets/isaac.png', import.meta.url))

/** Same key trick for the CV: one upload per run, matched by alt, never duplicated. */
const CV_ALT = 'CV Isaac Pepió'
const CV_PATH = fileURLToPath(new URL('../assets/CV_Isaac_Pepio.pdf', import.meta.url))

/**
 * Uploads a document into the media collection under its own alt key. Re-running the
 * seed deletes the previous copy first, so the collection never accumulates duplicates.
 */
async function seedUpload(alt: string, filePath: string) {
  await payload.delete({ collection: 'media', where: { alt: { equals: alt } } })

  return payload.create({
    collection: 'media',
    data: { alt },
    filePath,
  })
}

async function seedCollections() {
  // Delete first so re-running the seed never duplicates documents.
  await payload.delete({ collection: 'projects', where: {} })
  await payload.delete({ collection: 'tags', where: {} })

  const tagIds = new Map<string, number>()
  for (const name of tagSeeds) {
    // SAFETY: with locale: 'all' Payload writes every locale at once, while the generated
    // Tag type describes one resolved locale.
    const tag = await payload.create({
      collection: 'tags',
      locale: ALL_LOCALES,
      data: { name } as unknown as Tag,
    })
    // The project seeds reference tags by their canonical (Spanish) value.
    tagIds.set(name.es, tag.id)
  }

  for (const project of projectSeeds) {
    const tags = project.tags.map((name) => {
      const id = tagIds.get(name)
      if (id === undefined) throw new Error(`Unknown tag: ${name}`)
      return id
    })

    // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
    // while the generated Project type describes one resolved locale.
    const data = {
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      status: project.status,
      visual: project.visual,
      order: project.order,
      githubUrl: project.githubUrl,
      tags,
    } as unknown as Project
    await payload.create({ collection: 'projects', locale: ALL_LOCALES, data })
  }
}

/**
 * The career timeline. Delete first so re-running the seed never duplicates rows, then
 * write every locale at once (`locale: 'all'`), exactly like the projects below.
 */
async function seedExperience() {
  await payload.delete({ collection: 'experience', where: {} })

  for (const experience of experienceSeeds) {
    // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
    // while the generated Experience type describes one resolved locale.
    const data = {
      company: experience.company,
      role: experience.role,
      period: experience.period,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      stack: experience.tags.map((name) => ({ name })),
    } as unknown as Experience
    await payload.create({ collection: 'experience', locale: ALL_LOCALES, data })
  }
}

/**
 * `richText` builds a document of paragraphs only. An article body also carries the `h2`
 * headings the reading view indexes, so a heading reuses the paragraph node the helper
 * would have produced and only swaps its node type and tag: both node types, and the root
 * wrapper, still come from the shared helper instead of a second hand-written shape.
 * `Headings are Allowed` in Payload's lexical converter reads exactly `type` and `tag`.
 */
function postBody(sections: PostSection[]): RichText {
  const empty = richText([])

  const children = sections.flatMap((section) => {
    const [heading] = richText([section.heading]).root.children
    const [paragraph] = richText([section.paragraph]).root.children

    return [{ ...heading, type: 'heading', tag: 'h2' }, paragraph]
  })

  return { root: { ...empty.root, children } }
}

/**
 * Blog entries. Delete first so re-running the seed never duplicates rows, then write both
 * locales at once (`locale: 'all'`), like projects and experience above.
 */
async function seedPosts() {
  await payload.delete({ collection: 'posts', where: {} })

  for (const post of postSeeds) {
    // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
    // while the generated Post type describes one resolved locale.
    const data = {
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle,
      excerpt: post.excerpt,
      body: {
        es: postBody(post.body.es),
        en: postBody(post.body.en),
      },
      category: post.category,
      readMinutes: post.readMinutes,
      publishedAt: post.publishedAt,
      status: post.status,
      featured: post.featured,
    } as unknown as Post
    await payload.create({ collection: 'posts', locale: ALL_LOCALES, data })
  }
}

async function seedGlobals(photoId: number, cvId: number) {
  // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
  // while the generated About type describes one resolved locale.
  const aboutData = {
    name: aboutSeed.name,
    role: aboutSeed.role,
    availability: aboutSeed.availability,
    sectionEyebrow: aboutSeed.sectionEyebrow,
    sectionHeading: aboutSeed.sectionHeading,
    sectionHeadingAccent: aboutSeed.sectionHeadingAccent,
    // `photo` is not localized, so this single write backs both locale versions.
    photo: photoId,
    // Neither is the CV: one upload backs both locales and both links (04 and footer).
    cv: cvId,
    bio: {
      es: richText(aboutSeed.bio.es),
      en: richText(aboutSeed.bio.en),
    },
    // Arrays are shared across locales; only their `text`/`label` fields are localized.
    heroLines: aboutSeed.heroLines.map((line) => ({
      text: line.text,
      style: line.style,
    })),
    heroIntro: {
      es: richText([aboutSeed.heroIntro.es]),
      en: richText([aboutSeed.heroIntro.en]),
    },
    heroMeta: aboutSeed.heroMeta.map((item) => ({ text: item })),
    principles: aboutSeed.principles,
    // The four fields below stay in the model but have no section rendering them, so the
    // seed writes them empty on purpose: a re-run must clear whatever an earlier seed (or
    // the admin) left behind instead of keeping stale values the owner never sees.
    // `location` is localized, so with `locale: 'all'` it takes one entry per locale;
    // a bare `null` is ignored by the 'all' write and would keep the old value.
    location: { es: null, en: null },
    stats: [],
    education: [],
    languages: [],
  } as unknown as About

  await payload.updateGlobal({ slug: 'about', locale: 'all', data: aboutData })

  // email and phone are left empty because no source provides them.
  // The form's destination. Phone is left empty because no source provides one.
  await payload.updateGlobal({
    slug: 'contact',
    data: {
      email: contactSeed.email,
      phone: null,
      socials: contactSeed.socials,
    },
  })
}

/**
 * The "what I do" block: capabilities plus both tool belts. Because it is a global,
 * a re-run overwrites the single document instead of deleting and recreating rows.
 */
async function seedExpertise() {
  // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
  // while the generated Expertise type describes one resolved locale.
  const data = {
    capabilities: capabilitySeeds,
    coreTools: coreToolNames.map((name) => ({ name })),
    extendedTools: extendedToolNames.map((name) => ({ name })),
  } as unknown as Expertise

  await payload.updateGlobal({ slug: 'expertise', locale: ALL_LOCALES, data })
}

try {
  const media = await seedUpload(PHOTO_ALT, PHOTO_PATH)
  const cv = await seedUpload(CV_ALT, CV_PATH)
  await seedCollections()
  await seedExperience()
  await seedPosts()
  await seedGlobals(media.id, cv.id)
  await seedExpertise()

  const mediaCount = await payload.count({ collection: 'media' })
  const projects = await payload.count({ collection: 'projects' })
  const tags = await payload.count({ collection: 'tags' })
  const experience = await payload.count({ collection: 'experience' })
  const posts = await payload.count({ collection: 'posts' })

  console.log(`Seeded media: ${mediaCount.totalDocs}`)
  console.log(`Seeded capabilities: ${capabilitySeeds.length}`)
  console.log(`Seeded core tools: ${coreToolNames.length}`)
  console.log(`Seeded extended tools: ${extendedToolNames.length}`)
  console.log(`Seeded projects: ${projects.totalDocs}`)
  console.log(`Seeded tags: ${tags.totalDocs}`)
  console.log(`Seeded experience: ${experience.totalDocs}`)
  console.log(`Seeded posts: ${posts.totalDocs}`)
  console.log('Seeded globals: about, contact, expertise')
} catch (error) {
  console.error('Seed failed:', error)
  process.exitCode = 1
} finally {
  await payload.destroy()
  // The SQLite client keeps the event loop alive after destroy(), so the script would hang.
  // Flush pending output and end the process with the recorded status.
  await Promise.all([
    new Promise<void>((resolve) => process.stdout.write('', () => resolve())),
    new Promise<void>((resolve) => process.stderr.write('', () => resolve())),
  ])
  process.exit(process.exitCode ?? 0)
}
