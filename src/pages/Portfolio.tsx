import { useMemo } from 'react'
import { Link, NavLink, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { categories, getCategory, type Category } from '@/data/categories'
import { allPhotosCurated, photosIn } from '@/data/photos'
import { Seo } from '@/components/ui/Seo'
import { MaskHeading } from '@/components/ui/Reveal'
import { ArrowAnchor, ArrowLink } from '@/components/ui/ArrowLink'
import { JustifiedGallery } from '@/components/gallery/JustifiedGallery'
import { Lightbox } from '@/components/gallery/Lightbox'
import { useLightbox } from '@/components/gallery/useLightbox'
import { ease } from '@/lib/motion'
import { site } from '@/config/site'

export default function Portfolio() {
  const { category: slug } = useParams()
  const category = getCategory(slug)
  const list = useMemo(() => (category ? photosIn(category.slug) : allPhotosCurated), [category])
  const lightbox = useLightbox(list)

  if (slug && !category) return <Navigate to="/portfolio" replace />

  const title = category ? category.title : 'Portfolio'
  const description = category
    ? `${category.title} photography by ${site.photographer}. ${category.blurb}`
    : `The complete portfolio of ${site.photographer} — automotive, street, nature, portrait and event photography from ${site.location}.`

  return (
    <>
      <Seo title={title} description={description} image={list[0] ? `${list[0].path}-1600.webp` : undefined} />

      <header className="page-x pt-36 pb-10 md:pt-48 md:pb-14">
        <div className="mx-auto max-w-page">
          <p className="eyebrow text-mute">
            {category ? (
              <>
                <Link to="/portfolio" className="link-draw hover:text-bone">
                  Portfolio
                </Link>
                <span className="mx-2">/</span>
                <span className="text-bone-dim">{category.title}</span>
              </>
            ) : (
              'Archive — ' + list.length + ' frames'
            )}
          </p>
          <MaskHeading
            key={slug ?? 'all'}
            as="h1"
            animateOnMount
            className="mt-6 font-display text-display-xl"
            lines={[category ? <span className="italic">{category.title}</span> : 'Portfolio']}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={slug ?? 'all'}
              className="mt-6 max-w-xl text-lg leading-relaxed text-bone-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {category?.blurb ?? 'Every series in one place. Choose a category to narrow it down, or open any frame.'}
            </motion.p>
          </AnimatePresence>
        </div>
      </header>

      <FilterBar />

      <section aria-label={`${title} photographs`} className="page-x pt-8 pb-section md:pt-12">
        <div className="mx-auto max-w-page">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slug ?? 'all'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, ease: ease.cinematic }}
            >
              {list.length ? (
                <JustifiedGallery photos={list} onOpen={lightbox.open} showCategory={!category} />
              ) : (
                <EmptySeries category={category} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {lightbox.isOpen && (
          <Lightbox photos={list} index={lightbox.index} onClose={lightbox.close} onNavigate={lightbox.go} />
        )}
      </AnimatePresence>
    </>
  )
}

function FilterBar() {
  const items = [{ to: '/portfolio', label: 'All', count: allPhotosCurated.length }].concat(
    categories.map((c) => ({ to: `/portfolio/${c.slug}`, label: c.title, count: photosIn(c.slug).length })),
  )
  return (
    <nav
      aria-label="Filter by category"
      className="page-x sticky top-0 z-30 border-y border-line bg-ink/85 backdrop-blur-md"
    >
      <ul className="mx-auto -mx-2 flex max-w-page gap-1 overflow-x-auto [scrollbar-width:none] md:mx-auto md:gap-6 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <li key={item.to} className="shrink-0">
            <NavLink
              to={item.to}
              end
              preventScrollReset
              className={({ isActive }) =>
                `eyebrow relative flex h-14 items-center gap-2 px-2 transition-colors duration-300 ${
                  isActive ? 'text-bone' : 'text-mute hover:text-bone-dim'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <sup className="text-[0.55rem] text-mute tabular-nums">{item.count}</sup>
                  {isActive && (
                    <motion.span
                      layoutId="filter-underline"
                      className="absolute inset-x-2 -bottom-px h-px bg-brass"
                      transition={{ duration: 0.5, ease: ease.cinematic }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function EmptySeries({ category }: { category?: Category }) {
  const name = category?.title.toLowerCase() ?? "new"
  return (
    <div className="grid min-h-[50vh] place-items-center border border-dashed border-line px-6 py-24 text-center">
      <div className="max-w-md">
        <p className="eyebrow text-brass">In progress</p>
        <h2 className="mt-5 font-display text-display-sm">This series is being shot right now.</h2>
        <p className="mt-5 leading-relaxed text-bone-dim">
          New {name} work is on its way. {category?.blurb} Sessions are open for booking.
        </p>
        <div className="mt-10 flex flex-col items-center gap-5">
          <ArrowLink to="/contact">Book a session</ArrowLink>
          <ArrowAnchor href={site.instagram.url} target="_blank" rel="noopener noreferrer">
            Follow on Instagram
          </ArrowAnchor>
        </div>
      </div>
    </div>
  )
}
