"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, MessageSquareHeart, ArrowRight, Star, Users, MapPin, Award } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { Button } from "@/components/ui/button"

interface TestimonialsHeroProps {
  onOpenSubmitModal?: () => void
}

export function TestimonialsHero({ onOpenSubmitModal }: TestimonialsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest text-forest-foreground min-h-[380px] lg:min-h-[420px] flex items-center">
      {/* Background Hero Image with rich gradient overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero/casamance-landscape.png"
          alt="Casamance - Casa Impact"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transform motion-safe:animate-subtle-zoom"
        />
        {/* Multilayered rich forest green overlay for optimal legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/98 via-forest/92 to-forest/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
      </div>

      {/* Decorative Brand Elements */}
      <BaobabMark
        variant="white"
        size={460}
        className="pointer-events-none absolute -bottom-16 -right-10 w-[240px] opacity-[0.07] md:w-[360px] z-1"
      />
      <div className="pointer-events-none absolute -top-24 left-1/4 size-96 rounded-full bg-accent/15 blur-3xl z-1" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:pt-10 md:pb-18 lg:px-8 w-full">
        {/* Top Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent backdrop-blur-md shadow-sm">
          <Sparkles className="size-3.5 text-accent animate-pulse" />
          <span>Paroles du Terrain • Récits d'Impact</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl text-white drop-shadow-sm">
              La Casamance en mouvement à travers{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-accent">
                leurs voix
              </span>
            </h1>
            <p className="mt-5 text-balance text-base sm:text-lg leading-relaxed text-forest-foreground/90 font-sans max-w-2xl">
              Jeunes leaders, entrepreneures rurales, artisans et acteurs communautaires :
              découvrez les histoires concrètes et inspirantes de celles et ceux qui vivent et façonnent
              l'organisation Casa Impact au quotidien.
            </p>

            {/* Badges des 3 régions officielles */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="text-accent font-bold">Ancrage territorial :</span>
              {["Ziguinchor", "Sédhiou", "Kolda"].map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-white border border-white/20 backdrop-blur-md shadow-xs hover:bg-black/60 transition-colors"
                >
                  <MapPin className="size-3 text-accent" />
                  {region}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {onOpenSubmitModal && (
                <Button
                  onClick={onOpenSubmitModal}
                  size="lg"
                  className="rounded-full bg-accent text-forest hover:bg-accent/90 font-bold px-7 shadow-xl shadow-accent/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquareHeart className="mr-2 size-5" />
                  Partager mon témoignage
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/30 bg-black/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-md font-semibold px-6 shadow-md"
              >
                <Link href="/programmes">
                  Découvrir nos programmes
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column / High-impact stats banner */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 rounded-3xl border border-white/20 bg-black/35 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
              <div className="rounded-2xl bg-black/30 p-4 border border-white/10 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-accent">
                  <Star className="size-5 fill-accent" />
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white">98%</span>
                </div>
                <p className="mt-1 text-xs text-white/85 font-medium leading-snug">
                  Satisfaction & recommandation des bénéficiaires
                </p>
              </div>

              <div className="rounded-2xl bg-black/30 p-4 border border-white/10 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-accent">
                  <Users className="size-5" />
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white">+300</span>
                </div>
                <p className="mt-1 text-xs text-white/85 font-medium leading-snug">
                  Jeunes et femmes formés et accompagnés
                </p>
              </div>

              <div className="rounded-2xl bg-black/30 p-4 border border-white/10 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-accent">
                  <MapPin className="size-5" />
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white">3</span>
                </div>
                <p className="mt-1 text-xs text-white/85 font-medium leading-snug">
                  Régions unies : Ziguinchor, Sédhiou, Kolda
                </p>
              </div>

              <div className="rounded-2xl bg-black/30 p-4 border border-white/10 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2 text-accent">
                  <Award className="size-5" />
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white">100%</span>
                </div>
                <p className="mt-1 text-xs text-white/85 font-medium leading-snug">
                  Récits authentiques et vérifiés du terrain
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
