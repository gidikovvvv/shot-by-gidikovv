import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import type { Photo } from '@/data/photos'
import { categories } from '@/data/categories'
import { srcSet, src } from '@/lib/image'
import { ease } from '@/lib/motion'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface Props {
  photos: Photo[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState(0)
  const [chrome, setChrome] = useState(true)
  const photo = photos[index]
  const total = photos.length

  useScrollLock(true)
  useFocusTrap(ref, true)

  const go = (delta: number) => {
    setDirection(delta)
    onNavigate(index + delta)
  }

  // Keyboard: ← → navigate, Home/End jump, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Escape') onClose()
      else if (e.key === 'Home') onNavigate(0)
      else if (e.key === 'End') onNavigate(total - 1)
      else return
      e.preventDefault()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  // Preload neighbours so next/prev feel instant
  useEffect(() => {
    for (const d of [1, -1]) {
      const p = photos[(index + d + total) % total]
      if (!p) continue
      const img = new Image()
      img.sizes = '100vw'
      img.srcset = srcSet(p)
    }
  }, [index, photos, total])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) go(info.offset.x < 0 ? 1 : -1)
    else if (info.offset.y > 120) onClose()
  }

  if (!photo) return null
  const category = categories.find((c) => c.slug === photo.category)
  const exif = photo.exif
  const exifLine = exif ? [exif.focal, exif.aperture, exif.shutter, exif.iso].filter(Boolean).join('  ·  ') : ''

  return createPortal(
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[90] flex flex-col bg-ink-sunken text-bone"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: ease.cinematic }}
    >
      {/* Top bar */}
      <div
        className={`page-x relative z-10 flex items-center justify-between pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 transition-opacity duration-300 ${chrome ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="eyebrow text-bone-dim tabular-nums" aria-hidden="true">
          {pad(index + 1)} <span className="text-mute">/ {pad(total)}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="eyebrow -mr-3 flex h-11 items-center gap-3 px-3 text-bone-dim transition-colors hover:text-bone"
        >
          Close
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={photo.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: ease.cinematic }}
            drag
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.5}
            onDragEnd={onDragEnd}
            onTap={() => setChrome((c) => !c)}
            className="absolute inset-0 flex touch-none items-center justify-center px-2 py-2 sm:px-20 md:px-28"
          >
            <img
              src={src(photo, 1600)}
              srcSet={srcSet(photo)}
              sizes="(min-width: 768px) calc(100vw - 14rem), 100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              draggable={false}
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <NavButton side="prev" onClick={() => go(-1)} visible={chrome} />
            <NavButton side="next" onClick={() => go(1)} visible={chrome} />
          </>
        )}
      </div>

      {/* Caption */}
      <div
        className={`page-x flex flex-col gap-1 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] transition-opacity duration-300 sm:flex-row sm:items-end sm:justify-between ${chrome ? 'opacity-100' : 'opacity-0'}`}
      >
        <div>
          <h2 className="font-display text-2xl leading-tight md:text-3xl">{photo.title}</h2>
          <p className="eyebrow mt-1 text-mute">{category?.title}</p>
        </div>
        {exifLine && (
          <p className="text-xs tracking-wide text-mute tabular-nums">
            {exif?.camera && <span className="mr-3 text-bone-dim">{exif.camera}</span>}
            {exifLine}
          </p>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {total}: {photo.title}. {photo.alt}
      </p>
    </motion.div>,
    document.body,
  )
}

function NavButton({ side, onClick, visible }: { side: 'prev' | 'next'; onClick: () => void; visible: boolean }) {
  const isPrev = side === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Previous photo' : 'Next photo'}
      className={`group absolute top-1/2 z-10 hidden h-24 w-20 -translate-y-1/2 items-center justify-center text-bone-dim transition-[color,opacity] duration-300 hover:text-bone sm:flex md:w-28 ${
        isPrev ? 'left-0' : 'right-0'
      } ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <svg
        viewBox="0 0 24 12"
        className={`h-3 w-8 transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          isPrev ? 'rotate-180 group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'
        }`}
        aria-hidden="true"
      >
        <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </button>
  )
}
