"use client"

import React, { useState } from "react"
import { Plus, Sparkles } from "lucide-react"
import {
  useTalents,
  useDeleteTalent,
  useUpdateTalent,
} from "@/hooks/use-talents"
import { TalentsFilterBar } from "@/components/admin/talents/talents-filter-bar"
import { TalentsGrid } from "@/components/admin/talents/talents-grid"
import { TalentFormDialog } from "@/components/admin/talents/talent-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Talent } from "@/types/models"

export default function TalentsListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [region, setRegion] = useState("all")
  const [domaineId, setDomaineId] = useState("all")

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedTalentForEdit, setSelectedTalentForEdit] =
    useState<Talent | null>(null)
  const [selectedTalentForDelete, setSelectedTalentForDelete] =
    useState<Talent | null>(null)
  const [selectedTalentForToggle, setSelectedTalentForToggle] =
    useState<Talent | null>(null)

  const {
    data: talents = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTalents({
    search,
    statut,
    region,
    domain_id: domaineId,
  })

  const deleteMutation = useDeleteTalent()
  const updateMutation = useUpdateTalent()

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setRegion("all")
    setDomaineId("all")
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Sparkles className="size-3.5" />
            <span>Excellence Territoriale & Champions</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Mur des Talents
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Gérez les profils des entrepreneurs, artistes, sportifs et leaders qui incarnent l'excellence de la Casamance.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Nouveau talent</span>
        </Button>
      </div>

      {/* 2. Barre de Filtres */}
      <TalentsFilterBar
        search={search}
        statut={statut}
        region={region}
        domaineId={domaineId}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onRegionChange={setRegion}
        onDomaineIdChange={setDomaineId}
        onReset={handleResetFilters}
        totalCount={talents.length}
      />

      {/* 3. Contenu Principal */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-6 space-y-4"
            >
              <div className="flex justify-between">
                <Skeleton className="size-7 rounded-xl" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="size-14 rounded-2xl" />
                <Skeleton className="h-6 flex-1 rounded-lg" />
              </div>
              <Skeleton className="h-20 w-full rounded-2xl" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement des talents"
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer les profils de talents."
          }
          onRetry={() => refetch()}
        />
      ) : talents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Sparkles className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun talent trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || region !== "all" || domaineId !== "all"
              ? "Aucun profil ne correspond à vos critères de recherche."
              : "Ajoutez le premier talent au Mur de Casa Impact."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-5 rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
          >
            <Plus className="size-4" />
            <span>Ajouter un talent</span>
          </Button>
        </div>
      ) : (
        <TalentsGrid
          talents={talents}
          onEdit={(t) => setSelectedTalentForEdit(t)}
          onToggleStatus={(t) => setSelectedTalentForToggle(t)}
          onDelete={(t) => setSelectedTalentForDelete(t)}
        />
      )}

      {/* 4. Formulaire Modal */}
      <TalentFormDialog
        talent={selectedTalentForEdit}
        open={isCreateOpen || !!selectedTalentForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedTalentForEdit(null)
          }
        }}
      />

      {/* 5. Confirmation Statut */}
      <ConfirmDialog
        open={!!selectedTalentForToggle}
        onOpenChange={(open) => !open && setSelectedTalentForToggle(null)}
        title={
          selectedTalentForToggle?.statut === "archive"
            ? "Publier ce talent"
            : "Archiver ce talent"
        }
        description={
          selectedTalentForToggle?.statut === "archive"
            ? `Êtes-vous sûr de vouloir publier le profil de « ${selectedTalentForToggle?.nom} » ? Il sera visible sur le Mur des Talents public.`
            : `Êtes-vous sûr de vouloir archiver le profil de « ${selectedTalentForToggle?.nom} » ? Il ne sera plus affiché sur le site public.`
        }
        confirmText={
          selectedTalentForToggle?.statut === "archive"
            ? "Publier le talent"
            : "Archiver le talent"
        }
        variant={
          selectedTalentForToggle?.statut === "archive" ? "default" : "warning"
        }
        isLoading={updateMutation.isPending}
        onConfirm={async () => {
          if (selectedTalentForToggle) {
            const nextStatut =
              selectedTalentForToggle.statut === "archive"
                ? "publie"
                : "archive"
            await updateMutation.mutateAsync({
              id: selectedTalentForToggle.id,
              payload: { statut: nextStatut },
            })
          }
        }}
      />

      {/* 6. Confirmation Suppression */}
      <ConfirmDialog
        open={!!selectedTalentForDelete}
        onOpenChange={(open) => !open && setSelectedTalentForDelete(null)}
        title="Supprimer ce talent"
        description={`Êtes-vous certain de vouloir supprimer le profil de « ${selectedTalentForDelete?.nom} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedTalentForDelete) {
            await deleteMutation.mutateAsync(selectedTalentForDelete.id)
          }
        }}
      />

    </div>
  )
}
