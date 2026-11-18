import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { nav, site } from '@/config/site'
import { ease, duration } from '@/lib/motion'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="eyebrow text-[0.625rem] text-bone-dim">Shot by</span>
      <span className="font-display text-[1.65rem] leading-none tracking-tight italic">Gidikovv</span>
    </span>
  )
}

export function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const { scrollY } = useScroll()

  // Hide on scroll down, reveal on scroll up; gain a backdrop once past the top.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > 240 && y > prev + 4 ? true : y < prev - 4 ? false : hidden)
  })

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <a
        href="#main"
        className="eyebrow fixed top-3 left-3 z-[80] -translate-y-20 bg-bone px-4 py-3 text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: duration.base, ease: ease.cinematic }}
        className={`page-x fixed inset-x-0 top-0 z-[70] pt-[env(safe-area-inset-top)] transition-[background-color,backdrop-filter,border-color] duration-500 ${
          solid && !open ? 'border-b border-line bg-ink/75 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-18 max-w-page items-center justify-between md:h-22">
          <Link to="/" aria-label={`${site.name} — home`} className="text-bone">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {nav.map((item, i) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `eyebrow group inline-flex items-baseline gap-2 transition-colors duration-300 ${
                        isActive ? 'text-bone' : 'text-bone-dim hover:text-bone'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="text-[0.6rem] text-mute tabular-nums">0{i + 1}</span>
                        <span className="link-draw pb-0.5" aria-current={isActive ? 'page' : undefined}>
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="eyebrow -mr-3 flex h-11 items-center gap-3 px-3 text-bone md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-8 overflow-hidden" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? 'top-1.5 rotate-[20deg]' : 'top-0.5'}`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? 'top-1.5 -rotate-[20deg]' : 'top-2.5'}`}
              />
            </span>
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollLock(true)
  useFocusTrap(ref, true, '[aria-controls="mobile-menu"]')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="page-x fixed inset-0 z-[65] flex flex-col bg-ink pt-[calc(env(safe-area-inset-top)+6rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] md:hidden"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.7, ease: ease.inOut }}
    >
      <nav aria-label="Mobile" className="flex-1">
        <ul className="border-t border-line">
          {nav.map((item, i) => (
            <li key={item.to} className="overflow-hidden border-b border-line">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%', transition: { duration: 0.25 } }}
                transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.25 + i * 0.06 }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between py-4 font-display text-[2.75rem] leading-none ${
                      isActive ? 'text-bone' : 'text-bone-dim'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'italic' : ''}>{item.label}</span>
                      <span className="eyebrow text-mute tabular-nums">0{i + 1}</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="flex flex-col gap-3 text-sm text-bone-dim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.6 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <a href={`mailto:${site.email}`} className="break-all hover:text-bone">
          {site.email}
        </a>
        <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
          Instagram {site.instagram.handle}
        </a>
        <span className="eyebrow mt-3 text-mute">Based in {site.location}</span>
      </motion.div>
    </motion.div>
  )
}
