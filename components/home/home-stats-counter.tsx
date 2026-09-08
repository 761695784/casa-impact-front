"use client"

import React from "react"
import Link from "next/link"
import {
  Users,
  CreditCard,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Section } from "@/components/layout/section"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Button } from "@/components/ui/button"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { useImpactIndicators } from "@/hooks/use-content"

export function HomeStatsCounter() {
  const { data: indicators } = useImpactIndicators()

  // Calcul dynamique ou fallback officiel (300 personnes impactées, 130 adhérents)
  // Le tableau de valeurs réel est `values` (pas `valeurs`), et chaque entrée
  // est `{valeur, periode?, region?}` — pas de champ `cible` côté API.
  // NB : `values[]` peut contenir plusieurs entrées par indicateur (par
  // période et/ou par région) ; l'API ne précise pas si elles doivent être
  // sommées ou lues individuellement. On conserve ici la somme pour les
  // compteurs cumulatifs (personnes/adhérents) et la dernière entrée pour
  // les compteurs "état actuel" (régions/domaines), comme dans le code
  // existant — à confirmer côté métier si ambigu.
  const impactesCount = (() => {
    const ind = indicators?.find((i) =>
      i.libelle.toLowerCase().includes("impact") || i.id === 1
    )
    if (ind && ind.values && ind.values.length > 0) {
      return ind.values.reduce((acc, v) => acc + (v.valeur || 0), 0)
    }
    return 300
  })()

  const adherentsCount = (() => {
    const ind = indicators?.find((i) =>
      i.libelle.toLowerCase().includes("adhérent") ||
      i.libelle.toLowerCase().includes("membre") ||
      i.id === 2
    )
    if (ind && ind.values && ind.values.length > 0) {
      return ind.values.reduce((acc, v) => acc + (v.valeur || 0), 0)
    }
    return 130
  })()

  const regionsCount = (() => {
    const ind = indicators?.find((i) => i.id === 3)
    if (ind && ind.values && ind.values.length > 0) {
      return ind.values[ind.values.length - 1].valeur || 3
    }
    return 3
  })()

  const domainesCount = (() => {
    const ind = indicators?.find((i) => i.id === 4)
    if (ind && ind.values && ind.values.length > 0) {
      return ind.values[ind.values.length - 1].valeur || 6
    }
    return 6
  })()

  const stats = [
    {
      id: "impactes",
      value: impactesCount,
      suffix: "+",
      label: "Personnes & Jeunes Impactés",
      description: "Bénéficiaires de formations, mentorat et caravanes",
      icon: Users,
      iconColor: "text-accent",
      iconBg: "bg-accent/20 border-accent/30",
      border: "border-white/15 hover:border-accent/60",
    },
    {
      id: "adherents",
      value: adherentsCount,
      suffix: "",
      label: "Adhérents & Membres Actifs",
      description: "Jeunes et cadres engagés avec carte officielle (1 000 FCFA)",
      icon: CreditCard,
      iconColor: "text-accent",
      iconBg: "bg-accent/20 border-accent/30",
      border: "border-white/15 hover:border-accent/60",
    },
    {
      id: "regions",
      value: regionsCount,
      suffix: "",
      label: "Régions Naturelles Fédérées",
      description: "Ziguinchor, Sédhiou et Kolda sous une même vision",
      icon: MapPin,
      iconColor: "text-white",
      iconBg: "bg-white/20 border-white/30",
      border: "border-white/15 hover:border-white/40",
    },
    {
      id: "domaines",
      value: domainesCount,
      suffix: "",
      label: "Domaines d'Intervention",
      description: "Leadership, Entrepreneuriat, Culture, Sport & Diaspora",
      icon: Compass,
      iconColor: "text-accent",
      iconBg: "bg-accent/20 border-accent/30",
      border: "border-white/15 hover:border-accent/60",
    },
  ]

  return (
    <Section tone="dark" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-[#024424] via-forest to-[#012d17] text-white">
      {/* Baobab Ambient Watermark */}
      <BaobabMark
        variant="white"
        size={520}
        className="pointer-events-none absolute -bottom-24 -right-16 hidden opacity-[0.07] sm:block md:w-[420px]"
      />

      {/* Ambient Lighting Orbs */}
      <div
        className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 size-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-0 size-80 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16 border-b border-white/15 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-md shadow-sm">
              <TrendingUp className="size-3.5" />
              <span>Nos Chiffres Clés</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl drop-shadow-sm">
              L'impact de notre organisation en{" "}
              <span className="text-accent relative inline-block">
                chiffres
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-accent/60" aria-hidden />
              </span>
            </h2>
            <p className="mt-2 text-sm text-white/80 max-w-2xl">
              Des données réelles, mesurées et vérifiables sur l'ensemble de la Casamance naturelle.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="self-start sm:self-auto rounded-full text-xs font-semibold gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-md shadow-sm transition-all"
          >
            <Link href="/impact">
              <span>Consulter le rapport d'impact</span>
              <ArrowRight className="size-3.5 text-accent" />
            </Link>
          </Button>
        </div>

        {/* 4 Stats Counters Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white/10 p-6 sm:p-7 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/15 ${item.border}`}
              >
                {/* Ambient glow in card */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden
                />

                <div className="relative">
                  {/* Icon & Status Tag */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-2xl border ${item.iconBg} ${item.iconColor} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent border border-white/10 backdrop-blur-xs">
                      <Sparkles className="size-2.5 text-accent" />
                      Actif
                    </span>
                  </div>

                  {/* Animated Counter */}
                  <div className="mt-6">
                    <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-accent drop-shadow-xs">
                      <AnimatedCounter
                        value={item.value}
                        duration={2000}
                        suffix={item.suffix}
                      />
                    </p>

                    <h3 className="mt-2.5 text-base font-bold text-white leading-snug">
                      {item.label}
                    </h3>

                    <p className="mt-2 text-xs text-white/75 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </Section>
  )
}
