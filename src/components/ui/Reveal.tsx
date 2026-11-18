import { motion, type HTMLMotionProps } from 'framer-motion'
import { fadeUp, maskLine } from '@/lib/motion'

/** Fades children up once when they scroll into view. */
export function Reveal({ children, delay = 0, ...rest }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * Headline whose lines slide up from behind a mask. Pass lines as an array so
 * the break points are deliberate rather than left to the browser.
 */
export function MaskHeading({
  lines,
  as: Tag = 'h2',
  className = '',
  animateOnMount = false,
  delay = 0,
  id,
}: {
  id?: string
  lines: React.ReactNode[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  animateOnMount?: boolean
  delay?: number
}) {
  const trigger = animateOnMount
    ? { initial: 'hidden', animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span className="block" variants={maskLine} custom={i + delay / 0.08} {...trigger}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
