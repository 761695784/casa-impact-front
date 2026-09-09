"use client"

import { useMemo, useState } from "react"
import { GraduationCap, Search, X, SlidersHorizontal, RotateCcw } from "lucide-react"
import { usePrograms } from "@/hooks/use-content"
import { REGION_LABELS, type Region } from "@/types/enums"
import { ProgramCard } from "@/components/cards/program-card"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const REGIONS: Region[] = ["ziguinchor", "sedhiou", "kolda"]

export function ProgramsList() {
  const { data: programs, isLoading, isError } = usePrograms()
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Extract available unique program types
  const availableTypes = useMemo(() => {
    if (!programs) return []
    const typeMap = new Map<string, string>()
    programs.forEach((p) => {
      if (p.type) {
        typeMap.set(p.type.slug, p.type.nom)
      }
    })
    return Array.from(typeMap.entries()).map(([slug, nom]) => ({ slug, nom }))
  }, [programs])

  // Multi-criteria filtering
  const filtered = useMemo(() => {
    if (!programs) return []
    return programs.filter((p) => {
      // Region filter
      if (selectedRegion !== "all" && p.region !== selectedRegion) {
        return false
      }
      // Type filter
      if (selectedType !== "all" && p.type?.slug !== selectedType) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = p.titre.toLowerCase().includes(query)
        const matchResume = p.resume?.toLowerCase().includes(query) ?? false
        const matchLoc = p.localisation?.toLowerCase().includes(query) ?? false
        const matchDomaine = p.domaine?.nom.toLowerCase().includes(query) ?? false
        if (!matchTitle && !matchResume && !matchLoc && !matchDomaine) {
          return false
        }
      }
      return true
    })
  }, [programs, selectedRegion, selectedType, searchQuery])

  const hasActiveFilters = selectedRegion !== "all" || selectedType !== "all" || searchQuery.trim() !== ""

  const handleResetFilters = () => {
    setSelectedRegion("all")
    setSelectedType("all")
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="mb-8 h-12 w-full max-w-md animate-pulse rounded-2xl bg-secondary" />
        <CardGridSkeleton count={6} />
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        icon={<GraduationCap className="size-8" />}
        title="Impossible de charger les programmes"
        description="Une erreur de connexion est survenue. Veuillez réessayer ultérieurement."
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Control Bar: Search & Filter Chips */}
      <div className="space-y-4 rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          {/* Search Input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un programme, mot-clé, domaine, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-2xl border-border bg-secondary/40 pl-10 pr-10 text-sm focus-visible:bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Type Filter Pill Dropdown or Reset Button */}
          <div className="flex flex-wrap items-center gap-2">
            {availableTypes.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-11 rounded-2xl border border-border bg-secondary/40 px-3.5 text-xs sm:text-sm font-medium text-foreground transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Filtrer par type de programme"
              >
                <option value="all">Tous les formats d'action</option>
                {availableTypes.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.nom}
                  </option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-11 rounded-2xl gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                <span>Réinitialiser</span>
              </Button>
            )}
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
            Régions :
          </span>
          <FilterChip
            active={selectedRegion === "all"}
            onClick={() => setSelectedRegion("all")}
          >
            Toutes les régions
          </FilterChip>
          {REGIONS.map((r) => (
            <FilterChip
              key={r}
              active={selectedRegion === r}
              onClick={() => setSelectedRegion(r)}
            >
              {REGION_LABELS[r]}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Result Count and Active Stats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground px-1">
        <p>
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          {filtered.length > 1 ? "programmes disponibles" : "programme disponible"}
        </p>
        {selectedRegion !== "all" && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Région : {REGION_LABELS[selectedRegion]}
          </span>
        )}
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <GraduationCap className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun programme ne correspond à vos critères
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Essayez de modifier vos filtres de région, de type ou d'élargir votre recherche.
          </p>
          {hasActiveFilters && (
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="mt-6 rounded-full"
            >
              Voir tous les programmes
            </Button>
          )}
        </div>
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
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm scale-[1.02]"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
