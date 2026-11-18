/**
 * Single source of truth for brand details. Edit here — every page reads from it.
 */
declare const __SITE_URL__: string

export const site = {
  name: 'Shot by Gidikovv',
  shortName: 'Gidikovv',
  photographer: 'Martin Gidikovv',
  location: 'Bulgaria',
  url: __SITE_URL__,
  email: 'shot.by.gidikovv@gmail.com',
  instagram: {
    handle: '@shot.by.gidikovv',
    url: 'https://www.instagram.com/shot.by.gidikovv/',
  },
  /** Free key from https://web3forms.com — set VITE_WEB3FORMS_ACCESS_KEY in .env */
  formAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined,
} as const

export const nav = [
  { to: '/', label: 'Index' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const
