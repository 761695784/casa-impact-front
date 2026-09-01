"use client"

import React from "react"
import { MapPin, Users, CreditCard, Phone, ArrowUpRight } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { AnimatedCounter } from "@/components/ui/animated-counter"

const regionsData = [
  {
    nom: "Ziguinchor",
    role: "Cœur historique & Littoral",
    impactes: 150,
    adherents: 65,
    pourcentage: 50,
    coordonnateur: "Adama Sankharé",
    telephone: "+221 78 125 06 08",
    color: "text-forest",
    badgeBg: "bg-forest/10 text-forest border-forest/20",
    barColor: "bg-forest",
    border: "hover:border-forest/50",
    accentGlow: "from-forest/10 via-transparent to-transparent",
    description:
      "Premier pôle de déploiement de Casa Impact : cohortes d'incubation, mentorat des jeunes talents et dynamiques associatives littorales.",
  },
  {
    nom: "Sédhiou",
    role: "Traditions & Terroirs d'Avenir",
    impactes: 80,
    adherents: 35,
    pourcentage: 27,
    coordonnateur: "Abdou Khadre Djitté",
    telephone: "+221 78 416 17 00",
    color: "text-earth",
    badgeBg: "bg-earth/10 text-earth border-earth/20",
    barColor: "bg-earth",
    border: "hover:border-earth/50",
    accentGlow: "from-earth/10 via-transparent to-transparent",
    description:
      "Territoire riche de son patrimoine et de ses opportunités : ateliers d'entrepreneuriat culturel, formation aux compétences d'avenir et caravanes citoyennes.",
  },
  {
    nom: "Kolda",
    role: "Agro-écologie & Jeunesse",
    impactes: 70,
    adherents: 30,
    pourcentage: 23,
    coordonnateur: "Pascaline Santos",
    telephone: "+221 78 247 42 22",
    color: "text-accent-foreground",
    badgeBg: "bg-accent/20 text-accent-foreground border-accent/30",
    barColor: "bg-accent",
    border: "hover:border-accent/50",
    accentGlow: "from-accent/15 via-transparent to-transparent",
    description:
      "Bassin à fort potentiel agro-économique et humain : accompagnement des jeunes agri-preneurs, valorisation des filières locales et leadership féminin.",
  },
]

export function ImpactRegionalBreakdown() {
  return (
    <Section className="py-16 sm:py-24 border-b border-border/70">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Ancrage dans les Terroirs"
          title="Répartition Régionale de Notre Impact"
          description="L'impact de Casa Impact se déploie équitablement dans les trois régions administratives de la Casamance."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {regionsData.map((reg, i) => (
            <div
              key={reg.nom}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${reg.border}`}
            >
              {/* Corner subtle gradient */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${reg.accentGlow} opacity-60`}
                aria-hidden
              />

              <div className="relative">
                {/* Header with region name and order */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${reg.badgeBg}`}>
                      <MapPin className="size-3.5" />
                      {reg.nom}
                    </span>
                  </div>
                  <span className="font-display text-xl font-bold text-muted-foreground/50">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  {reg.role}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {reg.description}
                </p>

                {/* Progress Bar of total impact */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Part de l'impact global</span>
                    <span className="font-bold text-foreground">{reg.pourcentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${reg.barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${reg.pourcentage}%` }}
                    />
                  </div>
                </div>

                {/* Key stats row */}
                <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
                  <div className="rounded-2xl bg-secondary/50 p-3.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
                      <Users className="size-3.5 text-forest" />
                      <span>Impactés</span>
                    </div>
                    <p className="mt-1 font-display text-2xl font-bold text-foreground">
                      <AnimatedCounter value={reg.impactes} suffix="+" />
                    </p>
                  </div>

                  <div className="rounded-2xl bg-secondary/50 p-3.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
                      <CreditCard className="size-3.5 text-earth" />
                      <span>Adhérents</span>
                    </div>
                    <p className="mt-1 font-display text-2xl font-bold text-foreground">
                      <AnimatedCounter value={reg.adherents} />
                    </p>
                  </div>
                </div>
              </div>

              {/* Regional Coordinator Contact */}
              <div className="relative mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Coordination
                  </span>
                  <span className="font-semibold text-foreground">{reg.coordonnateur}</span>
                </div>
                <a
                  href={`tel:${reg.telephone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center gap-1 font-semibold text-forest hover:underline"
                  title={`Appeler ${reg.coordonnateur}`}
                >
                  <Phone className="size-3" />
                  <span>{reg.telephone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
