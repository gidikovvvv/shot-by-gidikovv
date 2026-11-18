import type { Transition, Variants } from 'framer-motion'

/** Animation tokens — mirror the CSS tokens in styles/index.css. */
export const ease = {
  cinematic: [0.22, 1, 0.36, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
}

export const duration = {
  quick: 0.2,
  base: 0.5,
  slow: 0.9,
  epic: 1.4,
}

export const transition = {
  base: { duration: duration.base, ease: ease.cinematic } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.cinematic } satisfies Transition,
  epic: { duration: duration.epic, ease: ease.outExpo } satisfies Transition,
}

/** Fade + short rise. Used by <Reveal>. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transition.slow },
}

/** Line-by-line mask reveal for large headlines. */
export const maskLine: Variants = {
  hidden: { y: '110%' },
  visible: (i: number = 0) => ({ y: '0%', transition: { ...transition.epic, delay: 0.08 * i } }),
}

export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
})

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: duration.base, ease: ease.cinematic } },
  exit: { opacity: 0, transition: { duration: duration.quick, ease: ease.inOut } },
}
