"use client"

import React from "react"
import {
  Users,
  CreditCard,
  MapPin,
  Compass,
  Rocket,
  Building2,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useImpactIndicators } from "@/hooks/use-content"

export function ImpactOverviewStats() {
  const { data: indicators } = useImpactIndicators()

  const impactesCount = (() => {
    const ind = indicators?.find((i) =>
      i.libelle.toLowerCase().includes("impact") || i.id === 1
    )
    if (ind && ind.valeurs && ind.valeurs.length > 0) {
      return ind.valeurs.reduce((acc, v) => acc + (v.valeur || 0), 0)
    }
    return 300
  })()

  const adherentsCount = (() => {
    const ind = indicators?.find((i) =>
      i.libelle.toLowerCase().includes("adhérent") ||
      i.libelle.toLowerCase().includes("membre") ||
      i.id === 2
    )
    if (ind && ind.valeurs && ind.valeurs.length > 0) {
      return ind.valeurs.reduce((acc, v) => acc + (v.valeur || 0), 0)
    }
    return 130
  })()

  const regionsCount = (() => {
    const ind = indicators?.find((i) => i.id === 3)
    if (ind && ind.valeurs && ind.valeurs.length > 0) {
      return ind.valeurs[ind.valeurs.length - 1].valeur || 3
    }
    return 3
  })()

  const domainesCount = (() => {
    const ind = indicators?.find((i) => i.id === 4)
    if (ind && ind.valeurs && ind.valeurs.length > 0) {
      return ind.valeurs[ind.valeurs.length - 1].valeur || 6
    }
    return 6
  })()

  const projetsCount = (() => {
    const ind = indicators?.find((i) => i.id === 5)
    if (ind && ind.valeurs && ind.valeurs.length > 0) {
      return ind.valeurs[ind.valeurs.length - 1].valeur || 24
    }
    return 24
  })()

  const communesCount = (() => {
    const ind = indicators?.find((i) => i.id === 6)
    if (ind && ind.valeurs && ind.valeurs.length > 0) {
      return ind.valeurs[ind.valeurs.length - 1].valeur || 18
    }
    return 18
  })()

  const kpis = [
    {
      id: "impactes",
      value: impactesCount,
      suffix: "+",
      label: "Personnes Impactées",
      description: "Bénéficiaires directs de formations, mentorat et caravanes",
      icon: Users,
      badgeColor: "bg-forest/10 text-forest",
      border: "hover:border-forest/50",
      color: "text-forest",
    },
    {
      id: "adherents",
      value: adherentsCount,
      suffix: "",
      label: "Adhérents & Membres",
      description: "Jeunes et cadres engagés avec carte officielle cotisée",
      icon: CreditCard,
      badgeColor: "bg-accent/20 text-accent-foreground",
      border: "hover:border-accent/60",
      color: "text-earth",
    },
    {
      id: "regions",
      value: regionsCount,
      suffix: "",
      label: "Régions Fédérées",
      description: "Ziguinchor, Sédhiou et Kolda sous une même gouvernance",
      icon: MapPin,
      badgeColor: "bg-primary/10 text-primary",
      border: "hover:border-primary/50",
      color: "text-primary",
    },
    {
      id: "domaines",
      value: domainesCount,
      suffix: "",
      label: "Domaines Stratégiques",
      description: "Leadership, Entrepreneuriat, Culture, Sport, Tourisme & Diaspora",
      icon: Compass,
      badgeColor: "bg-forest/10 text-forest",
      border: "hover:border-forest/50",
      color: "text-forest",
    },
    {
      id: "projets",
      value: projetsCount,
      suffix: "",
      label: "Projets Accompagnés",
      description: "Initiatives locales soutenues et structurées",
      icon: Rocket,
      badgeColor: "bg-accent/20 text-accent-foreground",
      border: "hover:border-accent/60",
      color: "text-earth",
    },
    {
      id: "communes",
      value: communesCount,
      suffix: "",
      label: "Communes Touchées",
      description: "Collectivités ayant accueilli des sessions ou ateliers",
      icon: Building2,
      badgeColor: "bg-primary/10 text-primary",
      border: "hover:border-primary/50",
      color: "text-primary",
    },
  ]

  return (
    <Section tone="muted" className="relative py-16 sm:py-24 border-b border-border/70">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Tableau de Bord Global"
          title="Les Chiffres Clés de Notre Action"
          description="Chaque chiffre affiché est le reflet d'une action concrète menée sur le terrain en Casamance."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${kpi.border}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-2xl ${kpi.badgeColor} transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="size-2.5 text-accent" />
                      Vérifié
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className={`font-display text-4xl sm:text-5xl font-bold tracking-tight ${kpi.color}`}>
                      <AnimatedCounter
                        value={kpi.value}
                        duration={2000}
                        suffix={kpi.suffix}
                      />
                    </p>

                    <h3 className="mt-2.5 text-base sm:text-lg font-bold text-foreground leading-snug">
                      {kpi.label}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {kpi.description}
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
