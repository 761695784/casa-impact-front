"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Sparkles, GraduationCap, MapPin, Users, Target } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"

export function ProgramsHero() {
  return (
    <section className="relative isolate min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex items-center bg-forest text-forest-foreground overflow-hidden pt-6 sm:pt-8 md:pt-10 pb-10">
      {/* Background Image with subtle Ken Burns effect */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="relative h-full w-full animate-ken-burns">
          <Image
            src="/assets/hero/DSC08048%20copie.jpg"
            alt="Programmes et formations Casa Impact en Casamance"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Multi-layered Cinematic Forest Green Gradient Overlays */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/98 via-forest/90 to-forest/75 md:from-forest/95 md:via-forest/85 md:to-forest/50"
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
        size={560}
        className="pointer-events-none absolute -bottom-24 -right-16 hidden opacity-[0.08] lg:block lg:w-[460px] -z-10"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Fil d'Ariane" className="mb-4">
          <ol className="flex items-center gap-1.5 text-xs text-white/70">
            <li>
              <Link href="/" className="transition-colors hover:text-accent">
                Accueil
              </Link>
            </li>
            <li>
              <ChevronRight className="size-3 text-white/40" />
            </li>
            <li className="font-medium text-white">Programmes & Activités</li>
          </ol>
        </nav>

        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
          <Sparkles className="size-3 text-accent" />
          <span>Formations & Accompagnements Territoriaux</span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
          Programmes & Activités de Terrain
        </h1>

        {/* Lead Text */}
        <p className="mt-3 max-w-2xl text-balance text-sm leading-relaxed text-white/90 sm:text-base font-normal drop-shadow">
          Des parcours d'excellence, dispositifs d'incubation, tremplins culturels et initiatives
          citoyennes pour révéler le potentiel de la jeunesse et bâtir un avenir prospère à Ziguinchor, Sédhiou et Kolda.
        </p>

        {/* Quick Stats Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-3xl">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 p-3 backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <span className="block font-display text-lg font-bold text-white">6+</span>
              <span className="block text-[11px] text-white/75">Programmes actifs</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 p-3 backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-accent">
              <Users className="size-5" />
            </div>
            <div>
              <span className="block font-display text-lg font-bold text-white">+400</span>
              <span className="block text-[11px] text-white/75">Bénéficiaires formés</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 p-3 backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-earth/40 text-accent">
              <MapPin className="size-5" />
            </div>
            <div>
              <span className="block font-display text-lg font-bold text-white">3</span>
              <span className="block text-[11px] text-white/75">Régions unies</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 p-3 backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <Target className="size-5" />
            </div>
            <div>
              <span className="block font-display text-lg font-bold text-white">100%</span>
              <span className="block text-[11px] text-white/75">Impact territorial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
