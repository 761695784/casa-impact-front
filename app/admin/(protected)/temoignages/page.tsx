"use client"

import React, { useState } from "react"
import { Plus, Quote } from "lucide-react"
import {
  useTestimonials,
  useDeleteTestimonial,
  useUpdateTestimonial,
} from "@/hooks/use-testimonials"
import { TemoignagesFilterBar } from "@/components/admin/temoignages/temoignages-filter-bar"
import { TemoignagesGrid } from "@/components/admin/temoignages/temoignages-grid"
import { TemoignageFormDialog } from "@/components/admin/temoignages/temoignage-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Testimonial } from "@/types/models"

export default function TemoignagesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [programmeId, setProgrammeId] = useState("all")

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedTestimonialForEdit, setSelectedTestimonialForEdit] =
    useState<Testimonial | null>(null)
  const [selectedTestimonialForDelete, setSelectedTestimonialForDelete] =
    useState<Testimonial | null>(null)
  const [selectedTestimonialForToggle, setSelectedTestimonialForToggle] =
    useState<Testimonial | null>(null)

  const {
    data: testimonials = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTestimonials({
    search,
    statut,
    programme_id: programmeId,
  })

  const deleteMutation = useDeleteTestimonial()
  const updateMutation = useUpdateTestimonial()

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setProgrammeId("all")
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Quote className="size-3.5" />
            <span>Retours d'Expérience & Voix du Terrain</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Témoignages & Récits d'Impact
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Administrez les témoignages de lauréats, bénéficiaires et partenaires affichés sur le portail public.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Nouveau témoignage</span>
        </Button>
      </div>

      {/* 2. Barre de Filtres */}
      <TemoignagesFilterBar
        search={search}
        statut={statut}
        programmeId={programmeId}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onProgrammeIdChange={setProgrammeId}
        onReset={handleResetFilters}
        totalCount={testimonials.length}
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
                <Skeleton className="size-12 rounded-full" />
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
          title="Erreur lors du chargement des témoignages"
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer les témoignages."
          }
          onRetry={() => refetch()}
        />
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Quote className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun témoignage trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || programmeId !== "all"
              ? "Aucun témoignage ne correspond à vos critères de recherche."
              : "Ajoutez le premier récit d'impact de Casa Impact."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-5 rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
          >
            <Plus className="size-4" />
            <span>Ajouter un témoignage</span>
          </Button>
        </div>
      ) : (
        <TemoignagesGrid
          testimonials={testimonials}
          onEdit={(t) => setSelectedTestimonialForEdit(t)}
          onToggleStatus={(t) => setSelectedTestimonialForToggle(t)}
          onDelete={(t) => setSelectedTestimonialForDelete(t)}
        />
      )}

      {/* 4. Formulaire Modal */}
      <TemoignageFormDialog
        testimonial={selectedTestimonialForEdit}
        open={isCreateOpen || !!selectedTestimonialForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedTestimonialForEdit(null)
          }
        }}
      />

      {/* 5. Confirmation d'Activation / Statut */}
      <ConfirmDialog
        open={!!selectedTestimonialForToggle}
        onOpenChange={(open) => !open && setSelectedTestimonialForToggle(null)}
        title={
          selectedTestimonialForToggle?.statut === "archive"
            ? "Publier ce témoignage"
            : "Archiver ce témoignage"
        }
        description={
          selectedTestimonialForToggle?.statut === "archive"
            ? `Êtes-vous sûr de vouloir publier le témoignage de « ${selectedTestimonialForToggle?.auteur} » ? Il sera affiché sur le site public.`
            : `Êtes-vous sûr de vouloir archiver le témoignage de « ${selectedTestimonialForToggle?.auteur} » ? Il ne sera plus visible sur le site public.`
        }
        confirmText={
          selectedTestimonialForToggle?.statut === "archive"
            ? "Publier le témoignage"
            : "Archiver le témoignage"
        }
        variant={
          selectedTestimonialForToggle?.statut === "archive" ? "default" : "warning"
        }
        isLoading={updateMutation.isPending}
        onConfirm={async () => {
          if (selectedTestimonialForToggle) {
            const nextStatut =
              selectedTestimonialForToggle.statut === "archive"
                ? "publie"
                : "archive"
            await updateMutation.mutateAsync({
              id: selectedTestimonialForToggle.id,
              payload: { statut: nextStatut },
            })
          }
        }}
      />

      {/* 6. Confirmation de Suppression */}
      <ConfirmDialog
        open={!!selectedTestimonialForDelete}
        onOpenChange={(open) => !open && setSelectedTestimonialForDelete(null)}
        title="Supprimer ce témoignage"
        description={`Êtes-vous certain de vouloir supprimer le témoignage de « ${selectedTestimonialForDelete?.auteur} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedTestimonialForDelete) {
            await deleteMutation.mutateAsync(selectedTestimonialForDelete.id)
          }
        }}
      />

    </div>
  )
}
