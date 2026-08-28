import { cn } from "@/lib/utils"

type SectionTone = "default" | "muted" | "dark" | "earth"

const toneClassName: Record<SectionTone, string> = {
  default: "",
  muted: "bg-secondary/60",
  dark: "bg-forest text-forest-foreground",
  earth: "bg-earth text-earth-foreground",
}

export function Section({
  children,
  className,
  containerClassName,
  as: Tag = "section",
  id,
  tone,
  muted = false,
  title,
  eyebrow,
  description,
  align = "left",
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  as?: React.ElementType
  id?: string
  /** Background/foreground treatment for the whole band. */
  tone?: SectionTone
  /** Shorthand for tone="muted" (kept for call-site brevity). */
  muted?: boolean
  /** When provided, renders a SectionHeading above the children automatically. */
  title?: string
  eyebrow?: string
  description?: string
  align?: "left" | "center"
}) {
  const resolvedTone: SectionTone = tone ?? (muted ? "muted" : "default")

  return (
    <Tag id={id} className={cn("py-16 md:py-24", toneClassName[resolvedTone], className)}>
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {title && (
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            align={align}
            invert={resolvedTone === "dark" || resolvedTone === "earth"}
            className="mb-12"
          />
        )}
        {children}
      </div>
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  invert = false,
  index,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
  invert?: boolean
  /** Optional editorial numeral (e.g. "01") for genuinely sequential content. */
  index?: string
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {(eyebrow || index) && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]",
            invert ? "text-accent" : "text-primary",
          )}
        >
          {index && <span className="tabular-nums">{index}</span>}
          <span className={cn("h-px w-6", invert ? "bg-accent" : "bg-primary")} aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-3 text-pretty font-display text-3xl font-semibold leading-[1.08] md:text-4xl",
          invert ? "text-current" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            invert ? "text-current/80" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
