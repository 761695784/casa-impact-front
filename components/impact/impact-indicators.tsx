"use client"

import React from "react"
import { BarChart3, Layers } from "lucide-react"
import { useImpactIndicators } from "@/hooks/use-content"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function ImpactIndicators() {
  const { data: indicators, isLoading, isError } = useImpactIndicators()

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-6">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="mt-4 h-6 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-6 h-2 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !indicators || indicators.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="size-8" />}
        title="Nos indicateurs d'impact seront publiés ici"
        description="Casa Impact s'engage à mesurer et publier son impact réel de façon transparente. Aucune statistique n'est communiquée tant qu'elle n'a pas été mesurée sur le terrain."
      />
    )
  }

  // Pas de champ `categorie` côté backend (ImpactIndicator) : le filtre par
  // catégorie n'a donc plus lieu d'être, on affiche tous les indicateurs
  // renvoyés par l'API, dans leur ordre d'origine.

  return (
    <div className="space-y-10">
      {/* Grid of Detailed Indicators */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((indicator) => {
          const totalVal =
            indicator.values && indicator.values.length > 0
              ? indicator.values.reduce((acc, v) => acc + (v.valeur || 0), 0)
              : 0

          return (
            <div
              key={indicator.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:border-forest/40 hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-forest">
                    <Layers className="size-3 text-forest" />
                    Indicateur Clé
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                    Vérifié
                  </span>
                </div>

                {/* Counter & Unit */}
                <div className="mt-5 flex items-baseline gap-2">
                  <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground group-hover:text-forest transition-colors">
                    <AnimatedCounter value={totalVal} duration={1800} />
                  </p>
                  {indicator.unite && (
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {indicator.unite}
                    </span>
                  )}
                </div>

                {/* Label */}
                <h3 className="mt-2.5 text-base font-bold text-foreground leading-snug">
                  {indicator.libelle}
                </h3>

                {/* Description */}
                {indicator.description && (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {indicator.description}
                  </p>
                )}

                {/* Regional Breakdown if available */}
                {indicator.values && indicator.values.length > 1 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
                    {indicator.values.map((val) => (
                      <span
                        key={val.id}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                      >
                        <span className="capitalize">{val.region || val.periode}</span>:{" "}
                        <strong>{val.valeur}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Pas de champ `cible` côté backend (ImpactIndicator) : plus de
                  barre de progression vers un objectif, on affiche uniquement
                  la valeur constatée ci-dessus. */}
            </div>
          )
        })}
      </div>
    </div>
  )
}
