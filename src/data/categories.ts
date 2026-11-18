export const CATEGORY_SLUGS = ['automotive', 'street', 'nature', 'portraits', 'events'] as const
export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export interface Category {
  slug: CategorySlug
  title: string
  /** One line, editorial voice — shown on the homepage index and gallery headers. */
  blurb: string
  /** Photo id used as the category's cover image. */
  cover?: string
}

export const categories: Category[] = [
  {
    slug: 'automotive',
    title: 'Automotive',
    blurb: 'Machines, light and motion — rolling shots, details and night sessions.',
  },
  {
    slug: 'street',
    title: 'Street',
    blurb: 'The city after dark, abandoned places and the quiet geometry in between.',
    cover: 'street-pl-3',
  },
  {
    slug: 'nature',
    title: 'Nature',
    blurb: 'High ridges, cold water and forest light from the Bulgarian mountains.',
    cover: 'nature-img-1991',
  },
  {
    slug: 'portraits',
    title: 'Portraits',
    blurb: 'People as they are — by the sea, against a wall, in the middle of a crowd.',
    cover: 'portraits-img-6100',
  },
  {
    slug: 'events',
    title: 'Events',
    blurb: 'Stage light, sweat and haze. Concerts, festivals and fashion shows.',
    cover: 'events-img-4826',
  },
]

export const getCategory = (slug: string | undefined) => categories.find((c) => c.slug === slug)
