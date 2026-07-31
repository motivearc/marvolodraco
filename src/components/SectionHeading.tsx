type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-10 md:mb-14 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}
    >
      {eyebrow ? (
        <p
          className={`mb-3 text-xs font-medium tracking-[0.22em] uppercase ${
            light ? 'text-sand' : 'text-stone'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display text-4xl leading-[1.1] font-medium tracking-tight md:text-5xl ${
          light ? 'text-cream' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed md:text-lg ${
            light ? 'text-sand' : 'text-ink-soft/80'
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
