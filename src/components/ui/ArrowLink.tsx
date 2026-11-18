import { Link, type LinkProps } from 'react-router-dom'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" fill="none" aria-hidden="true" className={`h-3 w-6 ${className}`}>
      <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

const base =
  'group inline-flex items-center gap-4 eyebrow text-bone transition-colors duration-300 hover:text-brass focus-visible:text-brass'
const arrow = 'transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2'

/** Text link with a sliding arrow — the site's primary call-to-action style. */
export function ArrowLink({ children, className = '', ...props }: LinkProps & { children: ReactNode }) {
  return (
    <Link className={`${base} ${className}`} {...props}>
      <span className="link-draw pb-1">{children}</span>
      <Arrow className={arrow} />
    </Link>
  )
}

export function ArrowAnchor({
  children,
  className = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a className={`${base} ${className}`} {...props}>
      <span className="link-draw pb-1">{children}</span>
      <Arrow className={arrow} />
    </a>
  )
}
