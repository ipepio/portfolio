import { getPayload } from 'payload'

import { notFound } from 'next/navigation'

import config from '@payload-config'
import { AboutSection } from '@/components/site/about-section'
import { ContactSection } from '@/components/site/contact-section'
import { ExperienceSection } from '@/components/site/experience-section'
import { ExpertiseSection } from '@/components/site/expertise-section'
import { HeroSection } from '@/components/site/hero-section'
import { ManifestoBand } from '@/components/site/manifesto-band'
import { ProjectsSection } from '@/components/site/projects-section'
import { SiteFooter } from '@/components/site/site-footer'
import { getDictionary, isLocale, locales } from '@/lib/i18n'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type HomePageProps = {
  params: Promise<{ locale: string }>
}

/**
 * Home page: composes the storefront sections from Payload content (the About, Contact
 * and Expertise globals plus the Experience and Projects collections), read in the
 * locale of the URL segment.
 *
 * Section order is the one the navigation promises: Inicio, Sobre mí, Skills, Proyectos,
 * Experiencia, Contacto. The expertise global feeds the skills band; the About orbit is
 * the self-contained expertise graph and no longer reads it. The manifesto band closes
 * the skills section, and the diamond separator bridges sections 04 and 05.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  // Unknown locales are missing routes, not Spanish pages.
  if (!isLocale(locale)) {
    notFound()
  }

  const dict = getDictionary(locale)
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [about, contact, experiences, expertise, projects] = await Promise.all([
    payload.findGlobal({ slug: 'about', locale, depth: 1 }),
    payload.findGlobal({ slug: 'contact', locale, depth: 1 }),
    payload.find({
      collection: 'experience',
      locale,
      sort: '-startDate',
      limit: 100,
      depth: 1,
    }),
    payload.findGlobal({ slug: 'expertise', locale, depth: 0 }),
    payload.find({
      collection: 'projects',
      locale,
      sort: 'order',
      limit: 100,
      depth: 1,
    }),
  ])

  // Payload array rows carry `id: string | null`; both sections take an optional id.
  const capabilities = expertise.capabilities.map((capability) => ({
    id: capability.id ?? undefined,
    title: capability.title,
    description: capability.description,
    scene: capability.scene,
  }))

  return (
    <div className="flex flex-col">
      {/* Content comes from Payload; each section's chrome is one dictionary slice. */}
      <HeroSection
        name={about.name}
        availability={about.availability}
        heroLines={about.heroLines}
        heroIntro={about.heroIntro}
        heroMeta={about.heroMeta}
        copy={dict.hero}
        photo={about.photo}
        role={about.role}
        portrait={dict.portrait}
      />
      <AboutSection about={about} copy={dict.about} />
      <ExpertiseSection
        copy={dict.expertise}
        capabilities={capabilities}
        coreTools={(expertise.coreTools ?? []).map((tool) => tool.name)}
        extendedTools={(expertise.extendedTools ?? []).map((tool) => tool.name)}
      />
      <ManifestoBand copy={dict.manifesto} />
      <ProjectsSection copy={dict.projects} projects={projects.docs} />
      <ExperienceSection
        copy={dict.experience}
        experiences={experiences.docs}
        cvHref={typeof about.cv === 'object' && about.cv ? about.cv.url : null}
      />
      <ContactSection contact={contact} copy={dict.contact} ownerName={about.name} />
      <SiteFooter
        contact={contact}
        copy={dict.footer}
        name={about.name}
        cvHref={typeof about.cv === 'object' && about.cv ? about.cv.url : null}
      />
    </div>
  )
}
