"use client"

import React, { useState } from "react"
import { Tag } from "lucide-react"
import { useProgramTypes, useUpdateProgramType } from "@/hooks/use-program-types"
import { ProgramTypesFilterBar } from "@/components/admin/program-types/program-types-filter-bar"
import { ProgramTypesGrid } from "@/components/admin/program-types/program-types-grid"
import { ProgramTypeEditDialog } from "@/components/admin/program-types/program-type-edit-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProgramType } from "@/types/models"

export default function ProgramTypesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")

  const [selectedTypeForEdit, setSelectedTypeForEdit] = useState<ProgramType | null>(null)
  const [selectedTypeForToggle, setSelectedTypeForToggle] = useState<ProgramType | null>(null)

  const { data: programTypes = [], isLoading, isError, error, refetch } = useProgramTypes({
    search,
    statut,
  })

  const updateMutation = useUpdateProgramType()

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Header de la Page */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Tag className="size-3.5" />
            <span>Modalités & Typologies d'Action</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Types de Programme
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Consultez et configurez les formats d'intervention de Casa Impact (Formation, Accompagnement, Événements, Bourses).
          </p>
        </div>
      </div>

      {/* 2. Barre de Filtres */}
      <ProgramTypesFilterBar
        search={search}
        statut={statut}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onReset={handleResetFilters}
        totalCount={programTypes.length}
      />

      {/* 3. Contenu : Loading / Error / Empty / Grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-6 space-y-4"
            >
              <div className="flex justify-between">
                <Skeleton className="size-7 rounded-xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement des types de programme"
          message={error instanceof Error ? error.message : "Impossible de récupérer les typologies."}
          onRetry={() => refetch()}
        />
      ) : programTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Tag className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun type de programme trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all"
              ? "Aucune typologie ne correspond à vos filtres actuels."
              : "Aucune modalité de programme n'est configurée."}
          </p>
        </div>
      ) : (
        <ProgramTypesGrid
          programTypes={programTypes}
          onEdit={(t) => setSelectedTypeForEdit(t)}
          onToggleStatus={(t) => setSelectedTypeForToggle(t)}
        />
      )}

      {/* 4. Modale de Modification */}
      <ProgramTypeEditDialog
        programType={selectedTypeForEdit}
        open={!!selectedTypeForEdit}
        onOpenChange={(open) => !open && setSelectedTypeForEdit(null)}
      />

      {/* 5. Confirmation d'Activation / Désactivation */}
      <ConfirmDialog
        open={!!selectedTypeForToggle}
        onOpenChange={(open) => !open && setSelectedTypeForToggle(null)}
        title={
          selectedTypeForToggle?.statut === "inactif"
            ? "Activer ce type de programme"
            : "Désactiver ce type de programme"
        }
        description={
          selectedTypeForToggle?.statut === "inactif"
            ? `Êtes-vous sûr de vouloir réactiver la modalité « ${selectedTypeForToggle?.nom} » ?`
            : `Êtes-vous sûr de vouloir désactiver la modalité « ${selectedTypeForToggle?.nom} » ? Elle ne sera plus proposée lors de la création de nouveaux programmes.`
        }
        confirmText={
          selectedTypeForToggle?.statut === "inactif"
            ? "Activer la modalité"
            : "Désactiver la modalité"
        }
        variant={selectedTypeForToggle?.statut === "inactif" ? "default" : "warning"}
        isLoading={updateMutation.isPending}
        onConfirm={async () => {
          if (selectedTypeForToggle) {
            const nextStatut =
              selectedTypeForToggle.statut === "inactif" ? "actif" : "inactif"
            await updateMutation.mutateAsync({
              id: selectedTypeForToggle.id,
              payload: { statut: nextStatut },
            })
          }
        }}
      />

    </div>
  )
}
