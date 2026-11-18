import { Link } from 'react-router-dom'
import { site } from '@/config/site'
import { MaskHeading, Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Arrow } from '@/components/ui/ArrowLink'

export function ContactCta({ index = '05' }: { index?: string }) {
  return (
    <section aria-labelledby="cta-heading" className="page-x py-section">
      <div className="mx-auto max-w-page">
        <SectionLabel index={index}>Commissions</SectionLabel>
        <MaskHeading
          id="cta-heading"
          className="mt-12 font-display text-display-xl md:mt-16"
          lines={['Let’s make', <span className="italic text-bone-dim">something worth</span>, 'keeping.']}
        />

        <Reveal className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
          <p className="max-w-md text-lg leading-relaxed text-bone-dim md:col-span-5">
            Events, portraits, brand and editorial work across {site.location} and beyond. Tell me what you have in
            mind — I reply to every inquiry personally.
          </p>
          <div className="flex flex-col gap-8 md:col-span-6 md:col-start-7 md:items-end">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-6 border border-bone px-8 py-5 transition-colors duration-500 hover:bg-bone hover:text-ink focus-visible:bg-bone focus-visible:text-ink"
            >
              <span className="eyebrow text-[0.75rem]">Start an inquiry</span>
              <Arrow className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2" />
            </Link>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-bone-dim">
              <a href={`mailto:${site.email}`} className="link-draw hover:text-bone">
                {site.email}
              </a>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-draw hover:text-bone">
                {site.instagram.handle}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
