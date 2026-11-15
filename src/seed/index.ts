import { getPayload } from 'payload'

import config from '@payload-config'

import type { About, Project, SkillGroup } from '../payload-types'
import { aboutSeed, contactSeed, projectSeeds, skillGroupSeeds, tagNames } from './content'
import { richText } from './lexical'

const payload = await getPayload({ config })

// SAFETY: Payload handles "all" at runtime (globals already type it as `'all' | TypedLocale`),
// but the collection Local API types only allow configured locale codes.
const ALL_LOCALES = 'all' as unknown as 'es'

async function seedCollections() {
  // Delete first so re-running the seed never duplicates documents.
  await payload.delete({ collection: 'projects', where: {} })
  await payload.delete({ collection: 'skill-groups', where: {} })
  await payload.delete({ collection: 'tags', where: {} })

  for (const group of skillGroupSeeds) {
    // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
    // while the generated SkillGroup type describes one resolved locale.
    const data = group as unknown as SkillGroup
    await payload.create({ collection: 'skill-groups', locale: ALL_LOCALES, data })
  }

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
      order: project.order,
      githubUrl: project.githubUrl,
      tags,
    } as unknown as Project
    await payload.create({ collection: 'projects', locale: ALL_LOCALES, data })
  }
}

async function seedGlobals() {
  // SAFETY: with locale: 'all' Payload reads localized fields as locale-keyed objects,
  // while the generated About type describes one resolved locale.
  const aboutData = {
    name: aboutSeed.name,
    role: aboutSeed.role,
    availability: aboutSeed.availability,
    location: aboutSeed.location,
    photo: null,
    bio: {
      es: richText(aboutSeed.bio.es),
      en: richText(aboutSeed.bio.en),
    },
    principles: aboutSeed.principles,
    education: aboutSeed.education,
    languages: aboutSeed.languages,
  } as unknown as About

  await payload.updateGlobal({ slug: 'about', locale: 'all', data: aboutData })

  // email and phone are left empty because no source provides them.
  await payload.updateGlobal({
    slug: 'contact',
    data: {
      email: null,
      phone: null,
      socials: contactSeed.socials,
    },
  })
}

try {
  await seedCollections()
  await seedGlobals()

  const skillGroups = await payload.count({ collection: 'skill-groups' })
  const projects = await payload.count({ collection: 'projects' })
  const tags = await payload.count({ collection: 'tags' })

  console.log(`Seeded skill-groups: ${skillGroups.totalDocs}`)
  console.log(`Seeded projects: ${projects.totalDocs}`)
  console.log(`Seeded tags: ${tags.totalDocs}`)
  console.log('Seeded globals: about, contact')
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
