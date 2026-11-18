import type { Photo } from '@/data/photos'

export const IMAGE_WIDTHS = [480, 960, 1600, 2400] as const

export const srcSet = (p: Pick<Photo, 'path' | 'width'>) =>
  IMAGE_WIDTHS.filter((w, i) => w <= p.width || i === 0 || IMAGE_WIDTHS[i - 1] < p.width)
    .map((w) => `${p.path}-${w}.webp ${Math.min(w, p.width)}w`)
    .join(', ')

export const src = (p: Pick<Photo, 'path'>, width: (typeof IMAGE_WIDTHS)[number] = 1600) => `${p.path}-${width}.webp`

export const isPortrait = (p: Pick<Photo, 'width' | 'height'>) => p.height > p.width
