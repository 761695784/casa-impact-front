import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { cn } from "@/lib/utils"

interface Crumb {
  label: string
  href?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  className?: string
}) {
  return (
    <section className={cn("relative overflow-hidden bg-forest text-forest-foreground", className)}>
      <BaobabMark
        variant="white"
        size={420}
        className="pointer-events-none absolute -bottom-14 right-0 w-[220px] opacity-[0.1] md:w-[300px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-current/70">
              {breadcrumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-current">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-current">{c.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <ChevronRight className="size-4 opacity-60" aria-hidden />}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-6 bg-accent" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-current/80">{description}</p>
        )}
      </div>
    </section>
  )
}
