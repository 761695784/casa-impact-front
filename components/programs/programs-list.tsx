"use client"

import { useMemo, useState } from "react"
import { GraduationCap } from "lucide-react"
import { usePrograms } from "@/hooks/use-content"
import { REGION_LABELS, type Region } from "@/types/enums"
import { ProgramCard } from "@/components/cards/program-card"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

const REGIONS: Region[] = ["ziguinchor", "kolda", "sedhiou"]

export function ProgramsList() {
  const { data, isLoading, isError } = usePrograms()
  const [region, setRegion] = useState<Region | "all">("all")

  const filtered = useMemo(() => {
    if (!data) return []
    return region === "all" ? data : data.filter((p) => p.region === region)
  }, [data, region])

  if (isLoading) return <CardGridSkeleton count={6} />

  if (isError) {
    return (
      <EmptyState
        icon={<GraduationCap className="size-8" />}
        title="Impossible de charger les programmes"
        description="Une erreur est survenue. Veuillez réessayer ultérieurement."
      />
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrer par région">
        <FilterChip active={region === "all"} onClick={() => setRegion("all")}>
          Toutes les régions
        </FilterChip>
        {REGIONS.map((r) => (
          <FilterChip key={r} active={region === r} onClick={() => setRegion(r)}>
            {REGION_LABELS[r]}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="size-8" />}
          title="Aucun programme dans cette région"
          description="De nouveaux programmes seront publiés prochainement."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
