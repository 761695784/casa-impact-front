"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Landmark, Building2, HeartHandshake, GraduationCap } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"

interface Crumb {
  label: string
  href?: string
}

export function PartnersHero({
  breadcrumbs = [{ label: "Accueil", href: "/" }, { label: "Partenaires" }],
}: {
  breadcrumbs?: Crumb[]
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
      {/* Background Image with Ken Burns Zoom */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="relative h-full w-full animate-ken-burns">
          <Image
            src="/assets/hero/DSC08011%20copie.jpg"
            alt="Alliances et partenaires engagés avec Casa Impact en Casamance"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Multi-layered Cinematic Gradient Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/50 md:from-forest/95 md:via-forest/80 md:to-forest/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/50"
        aria-hidden
      />

      {/* Ambient Accent Glow & Baobab Watermark */}
      <div className="pointer-events-none absolute -top-24 left-1/4 size-96 rounded-full bg-accent/15 blur-3xl -z-10" />
      <BaobabMark
        variant="white"
        size={600}
        className="pointer-events-none absolute -bottom-24 -right-16 hidden opacity-[0.08] lg:block lg:w-[480px] -z-10"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-3 pb-8 sm:px-6 sm:pt-4 sm:pb-12 md:pt-5 md:pb-14 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/75">
              {breadcrumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-accent transition-colors">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white font-semibold">{c.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && (
                    <ChevronRight className="size-3.5 text-white/40" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
          Nos Partenaires & Alliances{" "}
          <span className="relative inline-block text-accent">
            d'Impact
            <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-accent/60" aria-hidden />
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl font-normal drop-shadow">
          Casa Impact fédère des institutions publiques, des entreprises engagées, des ONG et des partenaires académiques pour démultiplier les opportunités et bâtir un avenir prospère en Casamance.
        </p>

        {/* Quick Regional & Partnership Indicators */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/15">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <Landmark className="size-3.5 text-accent" />
            <span>Institutions & Collectivités</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <Building2 className="size-3.5 text-accent" />
            <span>Entreprises & Bailleurs</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <HeartHandshake className="size-3.5 text-accent" />
            <span>ONG & Société Civile</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <GraduationCap className="size-3.5 text-accent" />
            <span>Académies & Pôles Techniques</span>
          </div>
        </div>
      </div>
    </section>
  )
}
