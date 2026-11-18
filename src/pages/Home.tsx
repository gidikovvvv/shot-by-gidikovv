import { Seo } from '@/components/ui/Seo'
import { Hero } from '@/components/home/Hero'
import { SelectedWork } from '@/components/home/SelectedWork'
import { CategoryIndex } from '@/components/home/CategoryIndex'
import { ContactCta } from '@/components/home/ContactCta'
import { MaskHeading, Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Photo } from '@/components/media/Photo'
import { getPhoto } from '@/data/photos'
import { about } from '@/content/about'
import { site } from '@/config/site'

export default function Home() {
  return (
    <>
      <Seo description="Cinematic photography by Martin Gidikovv — events, portraits, street, nature and automotive work from Bulgaria. Available for commissions." />
      <Hero />

      {/* 01 — Introduction */}
      <section aria-labelledby="intro-heading" className="page-x py-section">
        <div className="mx-auto max-w-page">
          <SectionLabel index="01">Introduction</SectionLabel>
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
            <MaskHeading
              id="intro-heading"
              className="font-display text-display-md md:col-span-9"
              lines={[
                <>
                  I photograph the moments <span className="italic text-bone-dim">that don’t wait</span> —
                </>,
                <>stage light, city nights and</>,
                <>the people caught in between.</>,
              ]}
            />
            <Reveal className="md:col-span-4 md:col-start-9" delay={0.2}>
              <p className="leading-relaxed text-bone-dim">
                {site.name} is the work of {site.photographer} — a photographer from {site.location} working across
                concerts, fashion, portraiture and the Bulgarian mountains.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <SelectedWork />
      <CategoryIndex />

      {/* 04 — About preview */}
      <section aria-labelledby="about-heading" className="page-x py-section">
        <div className="mx-auto grid max-w-page items-center gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <Photo photo={getPhoto('nature-img-0223')} sizes="(min-width: 768px) 40vw, 100vw" />
          </Reveal>
          <div className="md:col-span-6 md:col-start-7">
            <SectionLabel index="04">The photographer</SectionLabel>
            <h2 id="about-heading" className="mt-10 font-display text-display-md">
              Martin <span className="italic">Gidikovv</span>
            </h2>
            <Reveal>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-bone-dim">{about.intro}</p>
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-sm">
                {about.equipment.slice(0, 2).map((e) => (
                  <div key={e.label}>
                    <dt className="eyebrow text-mute">{e.label}</dt>
                    <dd className="mt-1.5 text-bone-dim">{e.value}</dd>
                  </div>
                ))}
              </dl>
              <ArrowLink to="/about" className="mt-12">
                More about me
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
