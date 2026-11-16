import { getPayload } from 'payload'

import config from '@payload-config'
import { AboutSection } from '@/components/site/about-section'
import { ContactSection } from '@/components/site/contact-section'
import { SkillsSection } from '@/components/site/skills-section'

const SKILLS_SUBHEADING =
  'Un perfil transversal que abarca desde el código hasta la infraestructura, pasando por la IA, la calidad y la seguridad.'

/**
 * Home page: composes the three storefront sections from Payload content
 * (About and Contact globals plus the SkillGroups collection).
 */
export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [about, contact, skillGroups] = await Promise.all([
    payload.findGlobal({ slug: 'about', locale: 'es', depth: 1 }),
    payload.findGlobal({ slug: 'contact', locale: 'es', depth: 1 }),
    payload.find({
      collection: 'skill-groups',
      locale: 'es',
      sort: 'order',
      limit: 100,
      depth: 0,
    }),
  ])

  return (
    <div className="flex flex-col">
      <AboutSection about={about} />
      <SkillsSection
        eyebrow="LO QUE HAGO"
        heading="Habilidades técnicas por área."
        subheading={SKILLS_SUBHEADING}
        groups={skillGroups.docs}
      />
      <ContactSection contact={contact} />
    </div>
  )
}
