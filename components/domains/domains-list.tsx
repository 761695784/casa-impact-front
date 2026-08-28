"use client"

import { LayoutGrid } from "lucide-react"
import { useDomains } from "@/hooks/use-content"
import { DomainCard } from "@/components/cards/domain-card"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { EmptyState } from "@/components/ui/empty-state"

export function DomainsList() {
  const { data, isLoading, isError } = useDomains()

  if (isLoading) return <CardGridSkeleton count={6} />

  if (isError) {
    return (
      <EmptyState
        icon={<LayoutGrid className="size-8" />}
        title="Impossible de charger les domaines"
        description="Une erreur est survenue. Veuillez réessayer ultérieurement."
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<LayoutGrid className="size-8" />}
        title="Aucun domaine disponible"
        description="Les domaines d'intervention seront publiés prochainement."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((domain) => (
        <DomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  )
}
