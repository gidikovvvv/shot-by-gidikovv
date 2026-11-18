import { useLocation } from 'react-router-dom'
import { site } from '@/config/site'

interface Props {
  title?: string
  description: string
  image?: string
}

/**
 * Per-page metadata. React 19 hoists <title>/<meta>/<link> into <head>.
 */
export function Seo({ title, description, image = '/og-image.jpg' }: Props) {
  const { pathname } = useLocation()
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — Photography by ${site.photographer}`
  const url = `${site.url}${pathname === '/' ? '/' : pathname}`
  const img = image.startsWith('http') ? image : `${site.url}${image}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
    </>
  )
}
