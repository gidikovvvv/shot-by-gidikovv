import { Seo } from '@/components/ui/Seo'
import { MaskHeading, Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Photo } from '@/components/media/Photo'
import { ContactCta } from '@/components/home/ContactCta'
import { getPhoto } from '@/data/photos'
import { about } from '@/content/about'
import { site } from '@/config/site'

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description={`About ${site.photographer} — a ${site.location}-based photographer working across events, fashion, portraiture and landscape.`}
      />

      <header className="page-x pt-36 md:pt-48">
        <div className="mx-auto max-w-page">
          <p className="eyebrow text-mute">About</p>
          <MaskHeading
            as="h1"
            animateOnMount
            className="mt-6 font-display text-display-xl"
            lines={['Martin', <span className="italic">Gidikovv</span>]}
          />
        </div>
      </header>

      <section aria-label="Introduction" className="page-x pt-16 md:pt-24">
        <div className="mx-auto grid max-w-page gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <Photo photo={getPhoto('nature-img-2325')} sizes="(min-width: 768px) 58vw, 100vw" priority />
          </Reveal>
          <Reveal className="flex flex-col justify-end md:col-span-4 md:col-start-9" delay={0.15}>
            <p className="font-display text-display-sm leading-snug">{about.intro}</p>
            <p className="eyebrow mt-10 text-mute">
              Based in {site.location} · {site.instagram.handle}
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="philosophy-heading" className="page-x py-section">
        <div className="mx-auto max-w-page">
          <SectionLabel index="01">Philosophy</SectionLabel>
          <h2 id="philosophy-heading" className="mt-10 font-display text-display-lg md:mt-14">
            How I <span className="italic">work</span>
          </h2>
          <ol className="mt-14 grid gap-px border-y border-line bg-line md:mt-20 md:grid-cols-3">
            {about.philosophy.map((p, i) => (
              <li key={p.title} className="bg-ink">
                <Reveal delay={i * 0.1} className="flex h-full flex-col gap-6 py-10 md:px-8 md:py-14 md:first:pl-0">
                  <span className="eyebrow text-brass tabular-nums">0{i + 1}</span>
                  <h3 className="font-display text-3xl">{p.title}</h3>
                  <p className="leading-relaxed text-bone-dim">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="interests-heading" className="page-x pb-section">
        <div className="mx-auto grid max-w-page gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel index="02">Interests</SectionLabel>
            <h2 id="interests-heading" className="sr-only">
              Creative interests
            </h2>
            <ul className="mt-10">
              {about.interests.map((item, i) => (
                <li key={item} className="border-b border-line">
                  <Reveal delay={i * 0.05} className="flex items-baseline gap-5 py-4">
                    <span className="eyebrow text-mute tabular-nums">0{i + 1}</span>
                    <span className="font-display text-2xl md:text-3xl">{item}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <SectionLabel index="03">Equipment</SectionLabel>
            <h2 className="sr-only">Equipment</h2>
            <Reveal>
              <div className="mt-10 grid grid-cols-[1fr_1.4fr] gap-6">
                <Photo photo={getPhoto('events-img-5132')} sizes="(min-width: 768px) 20vw, 40vw" />
                <dl className="flex flex-col justify-end">
                  {about.equipment.map((e) => (
                    <div key={e.label} className="border-b border-line py-4 first:border-t">
                      <dt className="eyebrow text-mute">{e.label}</dt>
                      <dd className="mt-1.5 text-bone">{e.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-bone-dim">
                A deliberately small kit. One body, a versatile zoom for stages and runways, and a fast fifty for
                portraits and low light — so attention stays on the subject, not the gear.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactCta index="04" />
    </>
  )
}
