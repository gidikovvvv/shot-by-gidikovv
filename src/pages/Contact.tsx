import { Seo } from '@/components/ui/Seo'
import { MaskHeading, Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/contact/ContactForm'
import { site } from '@/config/site'

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description={`Book ${site.photographer} for events, portraits, fashion and automotive photography in ${site.location}. Send an inquiry or reach out on Instagram.`}
      />

      <section aria-labelledby="contact-heading" className="page-x pt-36 pb-section md:pt-48">
        <div className="mx-auto grid max-w-page gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-mute">Contact</p>
            <MaskHeading
              id="contact-heading"
              as="h1"
              animateOnMount
              className="mt-6 font-display text-display-lg"
              lines={['Have a', <span className="italic">shoot in mind?</span>]}
            />

            <Reveal delay={0.2}>
              <p className="mt-10 max-w-sm text-lg leading-relaxed text-bone-dim">
                Concerts, fashion shows, portrait sessions, cars or something new entirely — tell me about it and I’ll
                get back to you personally.
              </p>

              <dl className="mt-14 space-y-8 border-t border-line pt-8">
                <div>
                  <dt className="eyebrow text-mute">Email</dt>
                  <dd className="mt-2">
                    <a href={`mailto:${site.email}`} className="link-draw font-display text-2xl break-all md:text-3xl">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-mute">Instagram</dt>
                  <dd className="mt-2">
                    <a
                      href={site.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw font-display text-2xl md:text-3xl"
                    >
                      {site.instagram.handle}
                    </a>
                    <p className="mt-2 text-sm text-bone-dim">The fastest place to see new work — DMs open.</p>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-mute">Based in</dt>
                  <dd className="mt-2 text-bone-dim">{site.location} — available to travel</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal className="md:col-span-6 md:col-start-7 md:pt-24" delay={0.3}>
            <h2 className="eyebrow mb-10 text-bone-dim">Photography inquiry</h2>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
