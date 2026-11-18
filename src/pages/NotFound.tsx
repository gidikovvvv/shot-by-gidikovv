import { Seo } from '@/components/ui/Seo'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Photo } from '@/components/media/Photo'
import { getPhoto } from '@/data/photos'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page doesn’t exist." />
      <meta name="robots" content="noindex" />
      <section className="page-x grid min-h-dvh items-center pt-28 pb-16">
        <div className="mx-auto grid w-full max-w-page items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow text-mute">404</p>
            <h1 className="mt-6 font-display text-display-lg">
              Lost the <span className="italic">light.</span>
            </h1>
            <p className="mt-6 max-w-sm text-bone-dim">This page doesn’t exist — or it walked off stage.</p>
            <ArrowLink to="/" className="mt-10">
              Back to the index
            </ArrowLink>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Photo photo={getPhoto('events-img-4653')} sizes="(min-width: 768px) 30vw, 100vw" />
          </div>
        </div>
      </section>
    </>
  )
}
