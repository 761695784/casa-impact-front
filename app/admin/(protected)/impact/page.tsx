"use client"

import React, { useState } from "react"
import { Plus, BarChart3, TrendingUp } from "lucide-react"
import {
  useImpactIndicators,
  useDeleteImpactIndicator,
} from "@/hooks/use-impact"
import { ImpactKpiCards } from "@/components/admin/impact/impact-kpi-cards"
import { ImpactFilterBar } from "@/components/admin/impact/impact-filter-bar"
import { ImpactIndicatorsTable } from "@/components/admin/impact/impact-indicators-table"
import { ImpactIndicatorFormDialog } from "@/components/admin/impact/impact-indicator-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ImpactIndicator } from "@/types/models"

export default function ImpactDashboardPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [domaineId, setDomaineId] = useState("all")

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedIndicatorForEdit, setSelectedIndicatorForEdit] =
    useState<ImpactIndicator | null>(null)
  const [selectedIndicatorForDelete, setSelectedIndicatorForDelete] =
    useState<ImpactIndicator | null>(null)

  const {
    data: indicators = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useImpactIndicators({
    search,
    statut,
    domaine_id: domaineId,
  })

  const deleteMutation = useDeleteImpactIndicator()

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setDomaineId("all")
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <TrendingUp className="size-3.5" />
            <span>Mesure & Transformation Territoriale</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Indicateurs & Tableau de Bord d'Impact
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Pilotez les résultats quantitatifs et vérifiables des programmes Casa Impact en Casamance.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Nouvel indicateur</span>
        </Button>
      </div>

      {/* 2. Synthèse KPI Dynamique (Calculée à partir des données) */}
      {!isLoading && !isError && indicators.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Aperçu des Résultats Clés
          </h2>
          <ImpactKpiCards indicators={indicators} />
        </div>
      )}

      {/* 3. Barre de Filtres */}
      <ImpactFilterBar
        search={search}
        statut={statut}
        domaineId={domaineId}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onDomaineIdChange={setDomaineId}
        onReset={handleResetFilters}
        totalCount={indicators.length}
      />

      {/* 4. Contenu Principal */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2">
                <Skeleton className="h-6 w-56 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-6 w-28 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement des indicateurs"
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer les indicateurs d'impact."
          }
          onRetry={() => refetch()}
        />
      ) : indicators.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <BarChart3 className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun indicateur d'impact trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || domaineId !== "all"
              ? "Aucun indicateur ne correspond à vos filtres actuels."
              : "Ajoutez le premier indicateur d'impact de Casa Impact."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-5 rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
          >
            <Plus className="size-4" />
            <span>Créer un indicateur</span>
          </Button>
        </div>
      ) : (
        <ImpactIndicatorsTable
          indicators={indicators}
          onEdit={(ind) => setSelectedIndicatorForEdit(ind)}
          onDelete={(ind) => setSelectedIndicatorForDelete(ind)}
        />
      )}

      {/* 5. Formulaire Modal */}
      <ImpactIndicatorFormDialog
        indicator={selectedIndicatorForEdit}
        open={isCreateOpen || !!selectedIndicatorForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedIndicatorForEdit(null)
          }
        }}
      />

      {/* 6. Confirmation Suppression */}
      <ConfirmDialog
        open={!!selectedIndicatorForDelete}
        onOpenChange={(open) => !open && setSelectedIndicatorForDelete(null)}
        title="Supprimer cet indicateur"
        description={`Êtes-vous certain de vouloir supprimer l'indicateur « ${selectedIndicatorForDelete?.libelle} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedIndicatorForDelete) {
            await deleteMutation.mutateAsync(selectedIndicatorForDelete.id)
          }
        }}
      />

    </div>
  )
}
