"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Sparkles, Rocket, Users, Award, MapPin } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"

interface Crumb {
  label: string
  href?: string
}

export function OpportunitiesHero({
  breadcrumbs = [{ label: "Accueil", href: "/" }, { label: "Opportunités & Candidatures" }],
}: {
  breadcrumbs?: Crumb[]
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-center">
      {/* Background Image with Ken Burns Zoom */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="relative h-full w-full animate-ken-burns">
          <Image
            src="/assets/hero/DSC08045%20copie.jpg"
            alt="Jeunes leaders et entrepreneurs de Casa Impact"
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

      {/* Baobab Ambient Watermark */}
      <BaobabMark
        variant="white"
        size={620}
        className="pointer-events-none absolute -bottom-28 -right-20 hidden opacity-[0.08] lg:block lg:w-[500px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-6">
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

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-md">
          <Sparkles className="size-3 text-accent" />
          <span>Tremplin Jeunesse, Entrepreneuriat & Innovation</span>
        </div>

        {/* Title */}
        <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
          Saisissez les Opportunités pour{" "}
          <span className="relative inline-block text-accent">
            Votre Avenir
            <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-accent/60" aria-hidden />
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl font-normal drop-shadow">
          Programmes d'incubation, cohortes d'académie du leadership, formations aux métiers d'avenir et financements de projets : découvrez les appels à candidatures ouverts à <strong>Ziguinchor</strong>, <strong>Kolda</strong> et <strong>Sédhiou</strong>.
        </p>

        {/* Quick Highlights */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/15">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <Rocket className="size-3.5 text-accent" />
            <span>Programmes 100% Financés & Accompagnés</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <Users className="size-3.5 text-accent" />
            <span>Cohortes Régionales & Mentorat d'Élite</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <Award className="size-3.5 text-accent" />
            <span>Certifications & Débouchés Concrets</span>
          </div>
        </div>
      </div>
    </section>
  )
}
