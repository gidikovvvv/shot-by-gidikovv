/** Magazine-style section marker: (02) Selected work ———— */
export function SectionLabel({ index, children, className = '' }: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-4 text-mute ${className}`}>
      <span className="tabular-nums">({index})</span>
      <span className="text-bone-dim">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </p>
  )
}
