import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaobabMark } from "@/components/brand/baobab-mark"

interface CtaAction {
  label: string
  href?: string
  onClick?: () => void
}

export function CtaBand({
  title = "Prêt à faire partie du changement en Casamance ?",
  description = "Rejoignez une organisation de jeunes, d'entrepreneurs et d'acteurs engagés pour trois régions, une vision, un impact.",
  primary = { label: "Nous rejoindre", href: "/adherer" },
  secondary = { label: "Voir les opportunités", href: "/opportunites" },
}: {
  title?: string
  description?: string
  primary?: CtaAction
  secondary?: CtaAction
}) {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-earth via-earth to-forest px-8 py-16 text-earth-foreground shadow-2xl md:px-16 md:py-20">
        
        {/* Ambient watermark & glow */}
        <BaobabMark
          variant="white"
          size={420}
          className="pointer-events-none absolute -right-12 -top-12 hidden w-[260px] opacity-[0.12] sm:block md:w-[340px]"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm border border-white/15">
            <Sparkles className="size-3.5 text-accent" />
            <span>Passer à l'action</span>
          </div>

          <h2 className="mt-5 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-white/90">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {primary.onClick ? (
              <Button
                onClick={primary.onClick}
                size="lg"
                className="h-13 rounded-full bg-accent px-8 font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-forest hover:text-white hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  {primary.label}
                  <ArrowRight className="size-4" />
                </span>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full bg-accent px-8 font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-forest hover:text-white hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href={primary.href || "#"} className="flex items-center gap-2">
                  {primary.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}

            {secondary.onClick ? (
              <Button
                onClick={secondary.onClick}
                size="lg"
                className="h-13 rounded-full border border-white/40 bg-white/10 px-7 font-medium text-white backdrop-blur-md transition-all hover:bg-white/25 hover:text-white hover:border-white/60"
              >
                {secondary.label}
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full border border-white/40 bg-white/10 px-7 font-medium text-white backdrop-blur-md transition-all hover:bg-white/25 hover:text-white hover:border-white/60"
              >
                <Link href={secondary.href || "#"}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
