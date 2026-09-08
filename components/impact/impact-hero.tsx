"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Sparkles, TrendingUp, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"

interface Crumb {
  label: string
  href?: string
}

export function ImpactHero({
  breadcrumbs = [{ label: "Accueil", href: "/" }, { label: "Notre impact" }],
}: {
  breadcrumbs?: Crumb[]
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
      {/* Background Image with Ken Burns Zoom */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="relative h-full w-full animate-ken-burns">
          <Image
            src="/assets/hero/DSC08045%20copie.jpg"
            alt="Impact de Casa Impact sur la jeunesse et les terroirs de Casamance"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Multi-layered Cinematic Gradient Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/55 md:from-forest/95 md:via-forest/80 md:to-forest/45"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/50"
        aria-hidden
      />

      {/* Baobab Ambient Watermark */}
      <BaobabMark
        variant="white"
        size={600}
        className="pointer-events-none absolute -bottom-24 -right-16 hidden opacity-[0.08] lg:block lg:w-[480px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 lg:px-8">
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

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-md shadow-sm">
          <TrendingUp className="size-3.5" />
          <span>Mesure & Transformation Vérifiable</span>
        </div>

        {/* Title */}
        <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
          L'Impact Territorial de{" "}
          <span className="relative inline-block text-accent">
            Casa Impact
            <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-accent/60" aria-hidden />
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl font-normal drop-shadow">
          Mesurer pour progresser. Découvrez les résultats concrets de nos actions menées au plus près des communautés de <strong>Ziguinchor</strong>, <strong>Sédhiou</strong> et <strong>Kolda</strong>.
        </p>

        {/* Quick Highlights / Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/15">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <ShieldCheck className="size-3.5 text-accent" />
            <span>Données 100% Mesurées sur le Terrain</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <MapPin className="size-3.5 text-accent" />
            <span>Ancrage 3 Régions (Ziguinchor, Sédhiou, Kolda)</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="size-3.5 text-accent" />
            <span>Transparence & Zéro Statistique Fictive</span>
          </div>
        </div>
      </div>
    </section>
  )
}
