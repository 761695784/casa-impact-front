"use client"

import React, { useState, useEffect } from "react"
import { Search, X, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ImpactFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

/**
 * Barre de filtres réduite à la recherche libre : l'indicateur d'impact
 * réel (voir types/models.ts) n'a ni `categorie`, ni `domaine`/`domaine_id`,
 * ni `programme`/`programme_id`, ni `statut` — ces filtres n'ont donc plus
 * d'équivalent côté backend et ont été retirés plutôt que laissés à filtrer
 * dans le vide.
 */
export function ImpactFilterBar({
  search,
  onSearchChange,
  onReset,
  totalCount,
}: ImpactFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, search, onSearchChange])

  const hasActiveFilters = search !== ""

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Search Input with Debounce */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher un indicateur par libellé ou description..."
            className="h-10 rounded-full pl-9 pr-9 text-xs sm:text-sm bg-background"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("")
                onSearchChange("")
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Effacer la recherche"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 rounded-full text-xs gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
          >
            <RotateCcw className="size-3.5" />
            <span>Réinitialiser</span>
          </Button>
        )}

      </div>
      {typeof totalCount === "number" && (
        <p className="text-[11px] text-muted-foreground">
          {totalCount} indicateur{totalCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
