"use client"

import React, { useState } from "react"
import { Plus, Compass, Download } from "lucide-react"
import { usePrograms, useDeleteProgram } from "@/hooks/use-programs"
import { ProgrammesFilterBar } from "@/components/admin/programmes/programmes-filter-bar"
import { ProgrammesTable } from "@/components/admin/programmes/programmes-table"
import { ProgrammesMobileList } from "@/components/admin/programmes/programmes-mobile-list"
import { ProgrammeFormDialog } from "@/components/admin/programmes/programme-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { PaginationBar } from "@/components/admin/ui/pagination-bar"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Program } from "@/types/models"

export default function ProgrammesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [domaineId, setDomaineId] = useState("all")
  const [typeId, setTypeId] = useState("all")
  const [region, setRegion] = useState("all")
  const [page, setPage] = useState(1)
  const perPage = 8

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState<Program | null>(null)
  const [selectedProgramForDelete, setSelectedProgramForDelete] = useState<Program | null>(null)

  const { data, isLoading, isError, error, refetch } = usePrograms({
    search,
    statut,
    domaine_id: domaineId,
    type_id: typeId,
    region,
    page,
    per_page: perPage,
  })

  const deleteMutation = useDeleteProgram()

  const programs = data?.data || []
  const meta = data?.meta

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setDomaineId("all")
    setTypeId("all")
    setRegion("all")
    setPage(1)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Compass className="size-3.5" />
            <span>Dispositifs Opérationnels Territoriaux</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Programmes d'Action
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Planification, suivi opérationnel et articulation avec les opportunités d'appels à candidatures.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Nouveau programme</span>
        </Button>
      </div>

      {/* 2. Barre de Filtres & Recherche */}
      <ProgrammesFilterBar
        search={search}
        statut={statut}
        domaineId={domaineId}
        typeId={typeId}
        region={region}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onStatutChange={(val) => {
          setStatut(val)
          setPage(1)
        }}
        onDomaineIdChange={(val) => {
          setDomaineId(val)
          setPage(1)
        }}
        onTypeIdChange={(val) => {
          setTypeId(val)
          setPage(1)
        }}
        onRegionChange={(val) => {
          setRegion(val)
          setPage(1)
        }}
        onReset={handleResetFilters}
        totalCount={meta?.total}
      />

      {/* 3. Contenu Principal */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement des programmes"
          message={error instanceof Error ? error.message : "Impossible de récupérer les données."}
          onRetry={() => refetch()}
        />
      ) : programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Compass className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun programme trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || domaineId !== "all" || typeId !== "all" || region !== "all"
              ? "Aucun programme ne correspond à vos filtres actuels."
              : "Commencez par créer le premier programme de Casa Impact."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-5 rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
          >
            <Plus className="size-4" />
            <span>Créer un programme</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Desktop Table */}
          <div className="hidden md:block">
            <ProgrammesTable
              programs={programs}
              onEdit={(prog) => setSelectedProgramForEdit(prog)}
              onDelete={(prog) => setSelectedProgramForDelete(prog)}
            />
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden">
            <ProgrammesMobileList
              programs={programs}
              onEdit={(prog) => setSelectedProgramForEdit(prog)}
              onDelete={(prog) => setSelectedProgramForDelete(prog)}
            />
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="pt-2">
              <PaginationBar
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                total={meta.total}
                perPage={meta.per_page}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}

        </div>
      )}

      {/* 4. Formulaire Modal (Création / Modification) */}
      <ProgrammeFormDialog
        program={selectedProgramForEdit}
        open={isCreateOpen || !!selectedProgramForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedProgramForEdit(null)
          }
        }}
      />

      {/* 5. Confirmation de Suppression */}
      <ConfirmDialog
        open={!!selectedProgramForDelete}
        onOpenChange={(open) => !open && setSelectedProgramForDelete(null)}
        title="Supprimer ce programme d'action"
        description={`Êtes-vous sûr de vouloir supprimer définitivement le programme « ${selectedProgramForDelete?.titre} » ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedProgramForDelete) {
            await deleteMutation.mutateAsync(selectedProgramForDelete.id)
          }
        }}
      />

    </div>
  )
}
