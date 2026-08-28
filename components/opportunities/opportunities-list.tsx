"use client"

import { useState, useMemo } from "react"
import { Megaphone, Filter, Search, Sparkles } from "lucide-react"
import { useApplicationCalls } from "@/hooks/use-content"
import { OpportunityCard } from "@/components/cards/opportunity-card"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"

const REGION_FILTERS = [
  { key: "all", label: "Toutes les régions" },
  { key: "ziguinchor", label: "Ziguinchor" },
  { key: "kolda", label: "Kolda" },
  { key: "sedhiou", label: "Sédhiou" },
]

export function OpportunitiesList() {
  const { data, isLoading, isError } = useApplicationCalls()
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredCalls = useMemo(() => {
    if (!data) return []
    return data.filter((c) => {
      const matchRegion = selectedRegion === "all" || c.region === selectedRegion
      const matchSearch =
        searchQuery === "" ||
        c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.resume && c.resume.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchRegion && matchSearch
    })
  }, [data, selectedRegion, searchQuery])

  if (isLoading) return <CardGridSkeleton count={3} />

  if (isError) {
    return (
      <EmptyState
        icon={<Megaphone className="size-8" />}
        title="Impossible de charger les opportunités"
        description="Une erreur est survenue lors du chargement des appels à candidatures. Veuillez réessayer ultérieurement."
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone className="size-8" />}
        title="Aucun appel à candidatures actif pour le moment"
        description="De nouvelles cohortes et opportunités de formation seront ouvertes très prochainement. Restez connectés !"
      />
    )
  }

  const openCalls = filteredCalls.filter((c) => c.statut === "publie")
  const upcomingCalls = filteredCalls.filter((c) => c.statut !== "publie")

  return (
    <div className="space-y-12">
      {/* Search & Region Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {REGION_FILTERS.map((r) => {
            const isSelected = selectedRegion === r.key
            return (
              <button
                key={r.key}
                onClick={() => setSelectedRegion(r.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filtrer un programme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Filtered Content */}
      {filteredCalls.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun appel à candidatures ne correspond à ces critères.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSelectedRegion("all")
              setSearchQuery("")
            }}
            className="mt-2 text-primary"
          >
            Réinitialiser la recherche
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Open Application Calls */}
          {openCalls.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-display text-xl font-bold text-foreground">
                  Candidatures Ouvertes Actuellement ({openCalls.length})
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {openCalls.map((c) => (
                  <OpportunityCard key={c.id} call={c} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming & Archived Calls */}
          {upcomingCalls.length > 0 && (
            <div className="pt-8 border-t border-border">
              <h3 className="mb-6 font-display text-xl font-bold text-foreground">
                Prochaines Cohortes & Appels Clôturés ({upcomingCalls.length})
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingCalls.map((c) => (
                  <OpportunityCard key={c.id} call={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
