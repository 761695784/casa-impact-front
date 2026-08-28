"use client"

import React, { useState, useMemo } from "react"
import { MapPin, Compass, Sparkles, Building2 } from "lucide-react"
import { CartographyFilterBar } from "@/components/admin/cartography/cartography-filter-bar"
import { CartographyMapView } from "@/components/admin/cartography/cartography-map-view"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useCartographyPoints } from "@/hooks/use-cartography"

export default function AdminCartographiePage() {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [region, setRegion] = useState("all")

  const {
    data: points = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCartographyPoints({ search, type, region })

  const handleReset = () => {
    setSearch("")
    setType("all")
    setRegion("all")
  }

  // Summary counts
  const counts = useMemo(() => {
    return {
      total: points.length,
      ziguinchor: points.filter((p) => p.region === "ziguinchor").length,
      kolda: points.filter((p) => p.region === "kolda").length,
      sedhiou: points.filter((p) => p.region === "sedhiou").length,
    }
  }, [points])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <MapPin className="size-3.5" />
            <span>Implantation & Maillage Territorial</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Cartographie Territoriale
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Visualisation géographique des programmes actifs, cohortes d'appels, talents et points relais à travers la Casamance.
          </p>
        </div>
      </div>

      {/* 2. KPI Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <MapPin className="size-4 text-forest" />
            <span>Total Points Référencés</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {counts.total}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Building2 className="size-4 text-emerald-600" />
            <span>Pôle Ziguinchor</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {counts.ziguinchor}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Building2 className="size-4 text-blue-600" />
            <span>Pôle Kolda</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-blue-600">
            {counts.kolda}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Building2 className="size-4 text-amber-600" />
            <span>Pôle Sédhiou</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600">
            {counts.sedhiou}
          </p>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <CartographyFilterBar
        search={search}
        type={type}
        region={region}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onRegionChange={setRegion}
        onReset={handleReset}
        totalCount={points.length}
      />

      {/* 4. Content */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[480px] w-full rounded-3xl" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Impossible de charger la cartographie"
          message={
            error instanceof Error
              ? error.message
              : "Erreur lors de la récupération des coordonnées géographiques."
          }
          onRetry={() => refetch()}
        />
      ) : points.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <MapPin className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun point cartographique trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || type !== "all" || region !== "all"
              ? "Aucune action ne correspond aux filtres appliqués."
              : "Aucune coordonnée territoriale n'est encore enregistrée."}
          </p>
          {(search || type !== "all" || region !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="mt-4 rounded-full"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <CartographyMapView points={points} />
      )}
    </div>
  )
}
