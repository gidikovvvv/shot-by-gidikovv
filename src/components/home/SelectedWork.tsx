import { AnimatePresence } from 'framer-motion'
import { featuredPhotos } from '@/data/photos'
import { categories } from '@/data/categories'
import { Photo } from '@/components/media/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Lightbox } from '@/components/gallery/Lightbox'
import { useLightbox } from '@/components/gallery/useLightbox'

/**
 * Hand-composed editorial spread: two independently stacked columns (the right
 * one starts lower), so frames can never overlap each other's captions.
 * Each slot sets its width within its column; on phones the columns dissolve
 * (display: contents) and `order` restores the original sequence.
 */
const COLUMNS = [
  { className: 'md:w-[42%]', slots: [0, 2, 4, 6] },
  { className: 'md:w-[48%] md:pt-[18vw]', slots: [1, 3, 5, 7] },
]
const WIDTH = ['md:w-full', 'md:w-full', 'md:ml-auto md:w-[72%]', 'md:w-[70%]', 'md:w-[82%]', 'md:ml-auto md:w-[62%]', 'md:ml-auto md:w-[64%]', 'md:w-[86%]']
const MOBILE = ['w-full', 'ml-auto w-[82%]', 'w-[78%]', 'ml-auto w-[88%]', 'w-full', 'ml-auto w-[74%]', 'w-[86%]', 'ml-auto w-full']
const ORDER = ['order-1', 'order-2', 'order-3', 'order-4', 'order-5', 'order-6', 'order-7', 'order-8']
const SIZES = ['42vw', '48vw', '30vw', '34vw', '34vw', '30vw', '30vw', '42vw']

export function SelectedWork() {
  const lightbox = useLightbox(featuredPhotos)

  return (
    <section aria-labelledby="selected-heading" className="page-x py-section">
      <div className="mx-auto max-w-page">
        <SectionLabel index="02">Selected work</SectionLabel>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <h2 id="selected-heading" className="font-display text-display-lg">
            Recent <span className="italic">frames</span>
          </h2>
          <p className="max-w-sm text-bone-dim">
            A short edit across every series — from runway flash to high-altitude light. Tap any frame to view it full
            screen.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-14 md:mt-24 md:flex-row md:justify-between md:gap-0">
          {COLUMNS.map((col, c) => (
            <ul key={c} className={`contents md:flex md:flex-col md:gap-[9vw] ${col.className}`}>
              {col.slots.map((i) => {
                const p = featuredPhotos[i]
                if (!p) return null
                return (
                  <li key={p.id} className={`${MOBILE[i]} ${ORDER[i]} md:order-none ${WIDTH[i]}`}>
                  <Reveal>
                    <button
                      type="button"
                      onClick={() => lightbox.open(p.id)}
                      className="group block w-full cursor-zoom-in text-left"
                      aria-label={`Open “${p.title}” — ${p.alt}`}
                    >
                      <Photo
                        photo={p}
                        sizes={`(min-width: 768px) ${SIZES[i] ?? '50vw'}, 90vw`}
                        imgClassName="group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                      />
                      <span className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                        <span className="flex items-baseline gap-3">
                          <span className="eyebrow text-mute tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                          <span className="font-display text-xl transition-colors duration-300 group-hover:text-brass">
                            {p.title}
                          </span>
                        </span>
                        <span className="eyebrow text-mute">{categories.find((c) => c.slug === p.category)?.title}</span>
                      </span>
                    </button>
                  </Reveal>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>

        <div className="mt-20 flex justify-center md:mt-32">
          <ArrowLink to="/portfolio">View the full portfolio</ArrowLink>
        </div>
      </div>

      <AnimatePresence>
        {lightbox.isOpen && (
          <Lightbox
            photos={featuredPhotos}
            index={lightbox.index}
            onClose={lightbox.close}
            onNavigate={lightbox.go}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
