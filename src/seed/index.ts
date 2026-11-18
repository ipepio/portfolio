import { getPayload } from 'payload'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'

import type { About, Experience, Expertise, Project } from '../payload-types'
import {
  aboutSeed,
  capabilitySeeds,
  contactSeed,
  coreToolNames,
  experienceSeeds,
  extendedToolNames,
  projectSeeds,
  tagNames,
} from './content'
import { richText } from './lexical'

const payload = await getPayload({ config })

// SAFETY: Payload handles "all" at runtime (globals already type it as `'all' | TypedLocale`),
// but the collection Local API types only allow configured locale codes.
const ALL_LOCALES = 'all' as unknown as 'es'

/** Alt text is the seed's own key for the portrait, which keeps the upload idempotent. */
const PHOTO_ALT = 'Isaac Pepió'
const PHOTO_PATH = fileURLToPath(new URL('../assets/isaac.png', import.meta.url))

/**
 * Uploads the portrait into the media collection. Re-running the seed deletes the
 * previous copy first (matched by alt), so the collection never accumulates duplicates.
 */
async function seedMedia() {
  await payload.delete({ collection: 'media', where: { alt: { equals: PHOTO_ALT } } })

  return payload.create({
    collection: 'media',
    data: { alt: PHOTO_ALT },
    filePath: PHOTO_PATH,
  })
}

async function seedCollections() {
  // Delete first so re-running the seed never duplicates documents.
  await payload.delete({ collection: 'projects', where: {} })
  await payload.delete({ collection: 'tags', where: {} })

  const tagIds = new Map<string, number>()
  for (const name of tagNames) {
    const tag = await payload.create({ collection: 'tags', data: { name } })
    tagIds.set(name, tag.id)
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

async function seedGlobals(photoId: number) {
  // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
  // while the generated About type describes one resolved locale.
  const aboutData = {
    name: aboutSeed.name,
    role: aboutSeed.role,
    availability: aboutSeed.availability,
    location: aboutSeed.location,
    sectionEyebrow: aboutSeed.sectionEyebrow,
    sectionHeading: aboutSeed.sectionHeading,
    sectionHeadingAccent: aboutSeed.sectionHeadingAccent,
    // `photo` is not localized, so this single write backs both locale versions.
    photo: photoId,
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
    stats: aboutSeed.stats.map((stat) => ({ value: stat.value, label: stat.label })),
    principles: aboutSeed.principles,
    education: aboutSeed.education,
    languages: aboutSeed.languages,
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
  const media = await seedMedia()
  await seedCollections()
  await seedExperience()
  await seedGlobals(media.id)
  await seedExpertise()

  const mediaCount = await payload.count({ collection: 'media' })
  const projects = await payload.count({ collection: 'projects' })
  const tags = await payload.count({ collection: 'tags' })
  const experience = await payload.count({ collection: 'experience' })

  console.log(`Seeded media: ${mediaCount.totalDocs}`)
  console.log(`Seeded capabilities: ${capabilitySeeds.length}`)
  console.log(`Seeded core tools: ${coreToolNames.length}`)
  console.log(`Seeded extended tools: ${extendedToolNames.length}`)
  console.log(`Seeded projects: ${projects.totalDocs}`)
  console.log(`Seeded tags: ${tags.totalDocs}`)
  console.log(`Seeded experience: ${experience.totalDocs}`)
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
