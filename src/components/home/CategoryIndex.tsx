import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { categories } from '@/data/categories'
import { getPhoto, photosIn } from '@/data/photos'
import { Photo } from '@/components/media/Photo'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Arrow } from '@/components/ui/ArrowLink'
import { ease } from '@/lib/motion'

/** Table-of-contents style index; hovering a row swaps the preview frame. */
export function CategoryIndex() {
  const firstWithCover = categories.find((c) => c.cover)!
  const [active, setActive] = useState(firstWithCover.slug)
  const activeCat = categories.find((c) => c.slug === active)
  const preview = activeCat?.cover ? getPhoto(activeCat.cover) : getPhoto(firstWithCover.cover!)

  return (
    <section aria-labelledby="series-heading" className="page-x py-section bg-ink-raised">
      <div className="mx-auto max-w-page">
        <SectionLabel index="03">Series</SectionLabel>
        <h2 id="series-heading" className="mt-10 font-display text-display-lg md:mt-14">
          Five ways of <span className="italic">looking</span>
        </h2>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
          <ul className="border-t border-line md:col-span-7" onMouseLeave={() => setActive(firstWithCover.slug)}>
            {categories.map((c, i) => {
              const count = photosIn(c.slug).length
              const cover = c.cover ? getPhoto(c.cover) : undefined
              return (
                <li key={c.slug} className="border-b border-line">
                  <Link
                    to={`/portfolio/${c.slug}`}
                    onMouseEnter={() => c.cover && setActive(c.slug)}
                    onFocus={() => c.cover && setActive(c.slug)}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 py-6 md:gap-x-8 md:py-8"
                  >
                    <span className="eyebrow self-start pt-3 text-mute tabular-nums md:pt-5">0{i + 1}</span>
                    <span>
                      <span className="block font-display text-display-md transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:text-brass group-focus-visible:text-brass">
                        <span className="group-hover:italic">{c.title}</span>
                      </span>
                      <span className="mt-2 block max-w-md text-sm leading-relaxed text-bone-dim">{c.blurb}</span>
                    </span>
                    <span className="flex flex-col items-end gap-3">
                      {cover ? (
                        <span className="block w-16 md:hidden">
                          <Photo photo={cover} sizes="64px" />
                        </span>
                      ) : null}
                      <span className="eyebrow text-mute tabular-nums">
                        {count ? `${count} ${count === 1 ? 'frame' : 'frames'}` : 'In progress'}
                      </span>
                      <Arrow className="hidden text-bone-dim transition-transform duration-500 group-hover:translate-x-1.5 md:block" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="relative hidden md:col-span-4 md:col-start-9 md:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={preview.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: ease.cinematic }}
                >
                  <Photo photo={preview} sizes="30vw" fill />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
