"use client"

import React from "react"
import {
  Users,
  Building2,
  Briefcase,
  Sparkles,
  Coins,
  MapPin,
} from "lucide-react"
import { formatNumber } from "@/lib/format"
import type { ImpactIndicator } from "@/types/models"

interface ImpactKpiCardsProps {
  indicators: ImpactIndicator[]
}

export function ImpactKpiCards({ indicators }: ImpactKpiCardsProps) {
  // Calcul dynamique des métriques à partir des indicateurs réels ou mockés.
  // Le champ des points de mesure s'appelle `values` (pas `valeurs`) sur la
  // ressource réelle ; il n'y a pas de `cible` côté backend, donc plus de
  // barre de progression / objectif ici — uniquement la valeur mesurée.
  const getLatestValue = (indicator?: ImpactIndicator): number => {
    if (!indicator || !indicator.values || indicator.values.length === 0) return 0
    return indicator.values.reduce((acc, v) => acc + (v.valeur || 0), 0)
  }

  const beneficiaireInd = indicators.find(
    (i) => i.id === 1 || i.libelle.toLowerCase().includes("formé")
  )
  const startupsInd = indicators.find(
    (i) => i.id === 2 || i.libelle.toLowerCase().includes("incubé") || i.libelle.toLowerCase().includes("projet")
  )
  const emploisInd = indicators.find(
    (i) => i.id === 3 || i.libelle.toLowerCase().includes("emploi")
  )
  const talentsInd = indicators.find(
    (i) => i.id === 4 || i.libelle.toLowerCase().includes("talent")
  )
  const fondsInd = indicators.find(
    (i) => i.id === 5 || i.libelle.toLowerCase().includes("fond") || i.libelle.toLowerCase().includes("diaspora")
  )
  const communesInd = indicators.find(
    (i) => i.id === 6 || i.libelle.toLowerCase().includes("commune")
  )

  const kpis = [
    {
      label: "Bénéficiaires Formés",
      valeur: beneficiaireInd ? getLatestValue(beneficiaireInd) : 0,
      unite: beneficiaireInd?.unite || "jeunes",
      icon: Users,
      color: "text-forest bg-forest/10",
    },
    {
      label: "Startups & Projets Incubés",
      valeur: startupsInd ? getLatestValue(startupsInd) : 0,
      unite: startupsInd?.unite || "entreprises",
      icon: Building2,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Emplois Générés",
      valeur: emploisInd ? getLatestValue(emploisInd) : 0,
      unite: emploisInd?.unite || "postes",
      icon: Briefcase,
      color: "text-amber-700 bg-amber-500/10",
    },
    {
      label: "Talents & Champions Révélés",
      valeur: talentsInd ? getLatestValue(talentsInd) : 0,
      unite: talentsInd?.unite || "talents",
      icon: Sparkles,
      color: "text-indigo-700 bg-indigo-500/10",
    },
    {
      label: "Fonds Mobilisés Diaspora",
      valeur: fondsInd ? getLatestValue(fondsInd) : 0,
      unite: fondsInd?.unite || "FCFA",
      isCurrency: true,
      icon: Coins,
      color: "text-emerald-700 bg-emerald-500/10",
    },
    {
      label: "Communes d'Intervention",
      valeur: communesInd ? getLatestValue(communesInd) : 0,
      unite: communesInd?.unite || "communes",
      icon: MapPin,
      color: "text-rose-700 bg-rose-500/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="rounded-3xl border border-border bg-card p-5 shadow-2xs space-y-3 transition-all hover:border-forest/30"
        >
          <div className="flex items-center justify-between">
            <div className={`flex size-10 items-center justify-center rounded-2xl ${kpi.color}`}>
              <kpi.icon className="size-5" />
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground block">
              {kpi.label}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                {formatNumber(kpi.valeur)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {kpi.unite}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
