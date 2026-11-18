import { useState, type CSSProperties } from 'react'
import type { Photo as PhotoData } from '@/data/photos'
import { srcSet, src } from '@/lib/image'

interface Props {
  photo: PhotoData
  /** The `sizes` attribute — how wide the image renders at each breakpoint. */
  sizes: string
  /** Fill the parent (object-cover) instead of keeping the natural aspect ratio. */
  fill?: boolean
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
}

/**
 * Responsive WebP image with a blurred placeholder that dissolves once the
 * real image has decoded. Lazy-loads by default; `priority` for LCP images.
 */
export function Photo({ photo, sizes, fill, priority, className = '', imgClassName = '', style }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative overflow-hidden ${fill ? 'h-full w-full' : ''} ${className}`}
      style={{
        aspectRatio: fill ? undefined : `${photo.width} / ${photo.height}`,
        backgroundColor: photo.color,
        ...style,
      }}
    >
      <img
        src={photo.blur}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectPosition: photo.focus }}
      />
      <img
        src={src(photo, 1600)}
        srcSet={srcSet(photo)}
        sizes={sizes}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          // Cached images can finish before React attaches onLoad
          if (el?.complete && el.naturalWidth) setLoaded(true)
        }}
        className={`relative h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-[var(--ease-out-expo)] ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        style={{ objectPosition: photo.focus }}
      />
    </div>
  )
}
