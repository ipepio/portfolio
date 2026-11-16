import { getPayload } from 'payload'

import config from '@payload-config'
import { AboutSection } from '@/components/site/about-section'
import { ContactSection } from '@/components/site/contact-section'
import { ProjectsSection } from '@/components/site/projects-section'
import { SkillsSection } from '@/components/site/skills-section'

const SKILLS_SUBHEADING =
  'Un perfil transversal que abarca desde el código hasta la infraestructura, pasando por la IA, la calidad y la seguridad.'

/**
 * Home page: composes the four storefront sections from Payload content
 * (About and Contact globals plus the SkillGroups and Projects collections).
 */
export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [about, contact, skillGroups, projects] = await Promise.all([
    payload.findGlobal({ slug: 'about', locale: 'es', depth: 1 }),
    payload.findGlobal({ slug: 'contact', locale: 'es', depth: 1 }),
    payload.find({
      collection: 'skill-groups',
      locale: 'es',
      sort: 'order',
      limit: 100,
      depth: 0,
    }),
    payload.find({
      collection: 'projects',
      locale: 'es',
      sort: 'order',
      limit: 100,
      depth: 1,
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
      <ProjectsSection
        eyebrow="02 / PROYECTOS SELECCIONADOS"
        heading="Ideas que se convierten en sistemas."
        note="Una mezcla de productos propios, investigación aplicada y arquitectura profesional. Algunos están en desarrollo o son privados."
        projects={projects.docs}
      />
      <ContactSection contact={contact} />
    </div>
  )
}
