import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { getPhoto } from '@/data/photos'
import { categories } from '@/data/categories'
import { srcSet, src } from '@/lib/image'
import { ease } from '@/lib/motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MaskHeading } from '@/components/ui/Reveal'
import { site } from '@/config/site'

/** Each slide pairs a landscape frame (desktop) with a portrait frame (phones). */
const SLIDES = [
  { wide: 'events-img-2750', tall: 'events-img-4826' },
  { wide: 'nature-img-1991', tall: 'events-img-5321' },
  { wide: 'nature-img-2325', tall: 'nature-img-0143' },
].map((s) => ({ wide: getPhoto(s.wide), tall: getPhoto(s.tall) }))

const INTERVAL = 6500

export function Hero() {
  const portrait = useMediaQuery('(orientation: portrait)')
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  // null = follow the OS reduced-motion preference until the visitor chooses
  const [userPaused, setPaused] = useState<boolean | null>(null)
  const { scrollY } = useScroll()
  const parallax = useTransform(scrollY, [0, 800], ['0%', '12%'])
  const fade = useTransform(scrollY, [0, 500], [1, 0])

  const paused = userPaused ?? !!reduceMotion
  const playing = !paused

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL)
    return () => window.clearTimeout(t)
  }, [index, playing])

  const photo = portrait ? SLIDES[index].tall : SLIDES[index].wide
  const category = categories.find((c) => c.slug === photo.category)

  return (
    <section aria-label="Introduction" className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-ink-sunken">
      <motion.div className="absolute inset-0" style={{ y: reduceMotion ? 0 : parallax }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={photo.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: ease.inOut }}
          >
            <motion.img
              src={src(photo, 1600)}
              srcSet={srcSet(photo)}
              sizes="100vw"
              alt={photo.alt}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding={index === 0 ? 'sync' : 'async'}
              className="h-full w-full object-cover"
              style={{ objectPosition: photo.focus ?? '50% 50%', backgroundColor: photo.color }}
              initial={{ scale: reduceMotion ? 1 : 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: INTERVAL / 1000 + 1.6, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Scrim: only as much as type legibility needs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_6_5/0.85)_0%,rgb(6_6_5/0.25)_45%,rgb(6_6_5/0.35)_100%)]"
      />

      <motion.div
        style={{ opacity: reduceMotion ? 1 : fade }}
        className="page-x absolute inset-x-0 bottom-0 pb-[calc(env(safe-area-inset-bottom)+2rem)] md:pb-12"
      >
        <div className="mx-auto max-w-page">
          <motion.p
            className="eyebrow mb-6 text-bone-dim md:mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: ease.cinematic }}
          >
            {site.photographer} — Photographer, {site.location}
          </motion.p>

          <MaskHeading
            as="h1"
            animateOnMount
            delay={0.1}
            className="font-display text-[clamp(4rem,17vw,11.5rem)] leading-[0.88] tracking-[-0.02em] text-bone"
            lines={[
              <>
                Shot by <span className="sr-only">Gidikovv</span>
              </>,
              <span aria-hidden="true" className="italic">
                Gidikovv
              </span>,
            ]}
          />

          <div className="mt-10 flex flex-col gap-6 border-t border-line-strong pt-5 sm:flex-row sm:items-center sm:justify-between md:mt-14">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={photo.id}
                className="text-sm text-bone-dim"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: ease.cinematic }}
              >
                <span className="font-display text-lg text-bone italic">{photo.title}</span>
                <span className="mx-3 text-mute">/</span>
                <span className="eyebrow">{category?.title}</span>
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2" role="group" aria-label="Choose slide">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show slide ${i + 1} of ${SLIDES.length}`}
                    aria-current={i === index}
                    className="group flex h-8 items-center"
                  >
                    <span className="relative block h-px w-10 overflow-hidden bg-line-strong md:w-14">
                      {i === index && (
                        <motion.span
                          key={`${index}-${playing}`}
                          className="absolute inset-0 origin-left bg-bone"
                          initial={{ scaleX: playing ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: playing ? INTERVAL / 1000 : 0, ease: 'linear' }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPaused(!paused)}
                className="eyebrow flex h-8 items-center text-bone-dim transition-colors hover:text-bone"
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {paused ? 'Play' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
