"use client"

import React, { useState } from "react"
import {
  Megaphone,
  Plus,
  Compass,
} from "lucide-react"
import {
  useApplicationCalls,
  useUpdateApplicationCall,
  useDeleteApplicationCall,
} from "@/hooks/use-application-calls"
import { AppelsFilterBar } from "@/components/admin/appels/appels-filter-bar"
import { AppelsTable } from "@/components/admin/appels/appels-table"
import { AppelsMobileList } from "@/components/admin/appels/appels-mobile-list"
import { AppelFormDialog } from "@/components/admin/appels/appel-form-dialog"
import { AppelPreviewModal } from "@/components/admin/appels/appel-preview-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { PaginationBar } from "@/components/admin/ui/pagination-bar"
import { ErrorState } from "@/components/admin/ui/error-state"
import { PermissionGate } from "@/components/admin/permission-gate"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { ApplicationCall } from "@/types/models"

export default function AppelsListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [region, setRegion] = useState("all")
  const [programmeId, setProgrammeId] = useState("all")
  const [page, setPage] = useState(1)

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCallForEdit, setSelectedCallForEdit] = useState<ApplicationCall | null>(null)
  const [selectedCallForPreview, setSelectedCallForPreview] = useState<ApplicationCall | null>(null)
  const [selectedCallForToggle, setSelectedCallForToggle] = useState<ApplicationCall | null>(null)
  const [selectedCallForDelete, setSelectedCallForDelete] = useState<ApplicationCall | null>(null)

  const { data, isLoading, isError, error, refetch } = useApplicationCalls({
    search,
    statut,
    region,
    programme_id: programmeId,
    page,
    per_page: 10,
  })

  const updateMutation = useUpdateApplicationCall()
  const deleteMutation = useDeleteApplicationCall()

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setRegion("all")
    setProgrammeId("all")
    setPage(1)
  }

  const handleOpenCreate = () => {
    setSelectedCallForEdit(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (call: ApplicationCall) => {
    setSelectedCallForEdit(call)
    setIsFormOpen(true)
  }

  const applicationCalls = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0, per_page: 10 }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Header de la Page */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Megaphone className="size-3.5" />
            <span>Module Recrutement & Cohortes</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Appels à Candidatures
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Publiez, pilotez et clôturez les opportunités d'accompagnement et d'incubation de l'organisation.
          </p>
        </div>

        <PermissionGate permission="appels:write">
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="size-4" />
            <span>Nouvel appel</span>
          </Button>
        </PermissionGate>
      </div>

      {/* 2. Barre de Recherche & Filtres */}
      <AppelsFilterBar
        search={search}
        statut={statut}
        region={region}
        programmeId={programmeId}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onStatutChange={(val) => {
          setStatut(val)
          setPage(1)
        }}
        onRegionChange={(val) => {
          setRegion(val)
          setPage(1)
        }}
        onProgrammeIdChange={(val) => {
          setProgrammeId(val)
          setPage(1)
        }}
        onReset={handleResetFilters}
        totalCount={meta.total}
      />

      {/* 3. Contenu : Loading / Error / Empty / Data */}
      {isLoading ? (
        <div className="space-y-3 rounded-3xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement des appels à candidatures"
          message={error instanceof Error ? error.message : "Impossible de récupérer la liste des appels."}
          onRetry={() => refetch()}
        />
      ) : applicationCalls.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Megaphone className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun appel à candidatures trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || region !== "all" || programmeId !== "all"
              ? "Aucun appel ne correspond aux filtres sélectionnés."
              : "Aucun appel à candidatures n'est encore configuré."}
          </p>
          <PermissionGate permission="appels:write">
            <Button
              onClick={handleOpenCreate}
              size="sm"
              className="mt-5 rounded-full bg-forest text-white gap-1.5 text-xs font-semibold"
            >
              <Plus className="size-3.5" />
              <span>Créer le premier appel</span>
            </Button>
          </PermissionGate>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table */}
          <div className="hidden md:block">
            <AppelsTable
              applicationCalls={applicationCalls}
              onEdit={handleOpenEdit}
              onPreview={(call) => setSelectedCallForPreview(call)}
              onToggleStatus={(call) => setSelectedCallForToggle(call)}
              onDelete={(call) => setSelectedCallForDelete(call)}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden">
            <AppelsMobileList
              applicationCalls={applicationCalls}
              onEdit={handleOpenEdit}
              onPreview={(call) => setSelectedCallForPreview(call)}
            />
          </div>

          {/* Pagination */}
          <PaginationBar
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            perPage={meta.per_page}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* 4. Formulaire Modal (Création / Modification) */}
      <AppelFormDialog
        applicationCall={selectedCallForEdit}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      {/* 5. Prévisualisation Modal */}
      <AppelPreviewModal
        applicationCall={selectedCallForPreview}
        open={!!selectedCallForPreview}
        onOpenChange={(open) => !open && setSelectedCallForPreview(null)}
      />

      {/* 6. Confirmation de Changement de Statut (Publier / Clôturer) */}
      <ConfirmDialog
        open={!!selectedCallForToggle}
        onOpenChange={(open) => !open && setSelectedCallForToggle(null)}
        title={
          selectedCallForToggle?.statut === "publie"
            ? "Clôturer cet appel à candidatures"
            : "Publier cet appel à candidatures"
        }
        description={
          selectedCallForToggle?.statut === "publie"
            ? `Êtes-vous sûr de vouloir clôturer l'appel « ${selectedCallForToggle?.titre} » ? Les candidats ne pourront plus soumettre de dossier sur le site public.`
            : `Êtes-vous sûr de vouloir publier l'appel « ${selectedCallForToggle?.titre} » ? Il sera immédiatement visible sur le site public et ouvert aux candidatures.`
        }
        confirmText={selectedCallForToggle?.statut === "publie" ? "Clôturer l'appel" : "Publier l'appel"}
        variant={selectedCallForToggle?.statut === "publie" ? "warning" : "default"}
        isLoading={updateMutation.isPending}
        onConfirm={async () => {
          if (selectedCallForToggle) {
            const nextStatus = selectedCallForToggle.statut === "publie" ? "ferme" : "publie"
            await updateMutation.mutateAsync({
              id: selectedCallForToggle.id,
              payload: { statut: nextStatus },
            })
          }
        }}
      />

      {/* 7. Confirmation de Suppression */}
      <ConfirmDialog
        open={!!selectedCallForDelete}
        onOpenChange={(open) => !open && setSelectedCallForDelete(null)}
        title="Supprimer l'appel à candidatures"
        description={`Êtes-vous sûr de vouloir supprimer l'appel « ${selectedCallForDelete?.titre} » ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedCallForDelete) {
            await deleteMutation.mutateAsync(selectedCallForDelete.id)
          }
        }}
      />

    </div>
  )
}
