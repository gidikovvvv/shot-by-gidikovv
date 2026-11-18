import { Suspense, useLayoutEffect, useRef } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { pageTransition } from '@/lib/motion'

/** Top-level section of the path — /portfolio/street and /portfolio share one page instance. */
const sectionOf = (pathname: string) => '/' + (pathname.split('/')[1] ?? '')

export function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const section = sectionOf(location.pathname)
  const prevSection = useRef(section)

  // Only reset scroll when moving between sections (not when filtering or opening the lightbox).
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  return (
    <div className="grain min-h-dvh">
      <Header />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (prevSection.current !== section) window.scrollTo({ top: 0, behavior: 'instant' })
          prevSection.current = section
        }}
      >
        <motion.main
          id="main"
          key={section}
          tabIndex={-1}
          className="outline-none"
          variants={pageTransition}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
