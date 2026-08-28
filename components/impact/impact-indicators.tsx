"use client"

import { BarChart3 } from "lucide-react"
import { useImpactIndicators } from "@/hooks/use-content"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

export function ImpactIndicators() {
  const { data, isLoading, isError } = useImpactIndicators()

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !data || data.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="size-8" />}
        title="Nos indicateurs d'impact seront publiés ici"
        description="Casa Impact s'engage à mesurer et publier son impact réel de façon transparente. Aucune statistique n'est communiquée tant qu'elle n'a pas été mesurée sur le terrain."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((indicator) => {
        const latest = indicator.valeurs?.[indicator.valeurs.length - 1]
        return (
          <div key={indicator.id} className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-4xl font-bold text-primary">
              {latest?.valeur ?? "—"}
              {indicator.unite ? <span className="ml-1 text-lg text-muted-foreground">{indicator.unite}</span> : null}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{indicator.libelle}</p>
            {indicator.description ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{indicator.description}</p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
