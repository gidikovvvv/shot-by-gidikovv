import type { Photo as PhotoData } from '@/data/photos'
import { categories } from '@/data/categories'
import { Photo } from '@/components/media/Photo'

interface Props {
  photos: PhotoData[]
  onOpen: (id: string) => void
  showCategory?: boolean
}

/**
 * Justified rows: every row is the same height and fills the width exactly,
 * so mixed portrait/landscape frames sit together like a contact sheet.
 * Pure CSS (flex-grow ∝ aspect ratio) — DOM order, visual order, tab order
 * and lightbox order are all the same.
 */
export function JustifiedGallery({ photos, onOpen, showCategory }: Props) {
  return (
    <ul
      className="flex flex-wrap gap-2 [--row:clamp(13rem,34vw,18rem)] sm:gap-3 md:[--row:clamp(18rem,30vw,30rem)]"
      aria-label="Photographs"
    >
      {photos.map((p, i) => {
        const ratio = p.width / p.height
        return (
          <li
            key={p.id}
            className="relative"
            style={{ flexGrow: ratio * 100, flexBasis: `calc(var(--row) * ${ratio})` }}
          >
            <button
              type="button"
              onClick={() => onOpen(p.id)}
              className="group relative block w-full cursor-zoom-in overflow-hidden text-left"
              aria-label={`Open “${p.title}” — ${p.alt}`}
            >
              <Photo
                photo={p}
                sizes={`(min-width: 768px) ${Math.round(ratio * 30)}vw, ${Math.round(ratio * 50)}vw`}
                priority={i < 3}
                imgClassName="group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="font-display text-xl leading-none">{p.title}</span>
                {showCategory && (
                  <span className="eyebrow text-bone-dim">{categories.find((c) => c.slug === p.category)?.title}</span>
                )}
              </span>
            </button>
          </li>
        )
      })}
      {/* Filler stops the last row from stretching to absurd sizes */}
      <li aria-hidden="true" className="h-0 grow-[10000]" />
    </ul>
  )
}
