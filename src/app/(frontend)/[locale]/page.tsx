import { getPayload } from 'payload'

import { notFound } from 'next/navigation'

import config from '@payload-config'
import { AboutSection } from '@/components/site/about-section'
import { ContactSection } from '@/components/site/contact-section'
import { ExperienceSection } from '@/components/site/experience-section'
import { HeroSection } from '@/components/site/hero-section'
import { ProjectsSection } from '@/components/site/projects-section'
import { SkillsSection } from '@/components/site/skills-section'
import { getDictionary, isLocale, locales } from '@/lib/i18n'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type HomePageProps = {
  params: Promise<{ locale: string }>
}

/**
 * Home page: composes the storefront sections from Payload content (About and
 * Contact globals plus the Experience, SkillGroups and Projects collections),
 * read in the locale of the URL segment.
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

  const [about, contact, experiences, skillGroups, projects] = await Promise.all([
    payload.findGlobal({ slug: 'about', locale, depth: 1 }),
    payload.findGlobal({ slug: 'contact', locale, depth: 1 }),
    payload.find({
      collection: 'experience',
      locale,
      sort: '-startDate',
      limit: 100,
      depth: 1,
    }),
    payload.find({
      collection: 'skill-groups',
      locale,
      sort: 'order',
      limit: 100,
      depth: 0,
    }),
    payload.find({
      collection: 'projects',
      locale,
      sort: 'order',
      limit: 100,
      depth: 1,
    }),
  ])

  return (
    <div className="flex flex-col">
      <HeroSection
        name={about.name}
        availability={about.availability}
        heroLines={about.heroLines}
        heroIntro={about.heroIntro}
        heroMeta={about.heroMeta}
        primaryCta={dict.hero.primaryCta}
        secondaryCta={dict.hero.secondaryCta}
        statusNote={dict.hero.statusNote}
      />
      <AboutSection
        about={about}
        eyebrow={dict.about.eyebrow}
        heading={dict.about.heading}
        educationHeading={dict.about.educationHeading}
        languagesHeading={dict.about.languagesHeading}
        presentLabel={dict.experience.present}
      />
      <ExperienceSection
        eyebrow={dict.experience.eyebrow}
        heading={dict.experience.heading}
        note={dict.experience.note}
        presentLabel={dict.experience.present}
        locale={locale}
        experiences={experiences.docs}
      />
      <SkillsSection
        eyebrow={dict.skills.eyebrow}
        heading={dict.skills.heading}
        subheading={dict.skills.subheading}
        groups={skillGroups.docs}
      />
      <ProjectsSection
        eyebrow={dict.projects.eyebrow}
        heading={dict.projects.heading}
        note={dict.projects.note}
        projects={projects.docs}
        locale={locale}
        allLabel={dict.projects.allLabel}
        statusLabels={dict.projects.statusLabels}
        gridLabels={dict.projects.gridLabels}
      />
      <ContactSection
        contact={contact}
        eyebrow={dict.contact.eyebrow}
        heading={dict.contact.heading}
      />
    </div>
  )
}
