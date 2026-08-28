"use client"

import React, { useState } from "react"
import { Plus, Handshake } from "lucide-react"
import { usePartners, useDeletePartner, useUpdatePartner } from "@/hooks/use-partners"
import { PartenairesFilterBar } from "@/components/admin/partenaires/partenaires-filter-bar"
import { PartenairesGrid } from "@/components/admin/partenaires/partenaires-grid"
import { PartenaireFormDialog } from "@/components/admin/partenaires/partenaire-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Partner } from "@/types/models"

export default function PartenairesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [type, setType] = useState("all")

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPartnerForEdit, setSelectedPartnerForEdit] = useState<Partner | null>(null)
  const [selectedPartnerForDelete, setSelectedPartnerForDelete] = useState<Partner | null>(null)
  const [selectedPartnerForToggle, setSelectedPartnerForToggle] = useState<Partner | null>(null)

  const { data: partners = [], isLoading, isError, error, refetch } = usePartners({
    search,
    statut,
    type,
  })

  const deleteMutation = useDeletePartner()
  const updateMutation = useUpdatePartner()

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setType("all")
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Handshake className="size-3.5" />
            <span>Écosystème & Alliances Stratégiques</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Partenaires & Alliances
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Gérez les organisations partenaires institutionnelles, financières, techniques et médiatiques de Casa Impact.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Nouveau partenaire</span>
        </Button>
      </div>

      {/* 2. Barre de Filtres */}
      <PartenairesFilterBar
        search={search}
        statut={statut}
        type={type}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onTypeChange={setType}
        onReset={handleResetFilters}
        totalCount={partners.length}
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
                <Skeleton className="size-12 rounded-2xl" />
                <Skeleton className="h-6 flex-1 rounded-lg" />
              </div>
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
          title="Erreur lors du chargement des partenaires"
          message={error instanceof Error ? error.message : "Impossible de récupérer les organisations."}
          onRetry={() => refetch()}
        />
      ) : partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Handshake className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun partenaire trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || type !== "all"
              ? "Aucune organisation ne correspond à vos critères de recherche."
              : "Ajoutez le premier partenaire de l'écosystème Casa Impact."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-5 rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
          >
            <Plus className="size-4" />
            <span>Ajouter un partenaire</span>
          </Button>
        </div>
      ) : (
        <PartenairesGrid
          partners={partners}
          onEdit={(p) => setSelectedPartnerForEdit(p)}
          onToggleStatus={(p) => setSelectedPartnerForToggle(p)}
          onDelete={(p) => setSelectedPartnerForDelete(p)}
        />
      )}

      {/* 4. Formulaire Modal (Création / Modification) */}
      <PartenaireFormDialog
        partner={selectedPartnerForEdit}
        open={isCreateOpen || !!selectedPartnerForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedPartnerForEdit(null)
          }
        }}
      />

      {/* 5. Confirmation d'Activation / Désactivation */}
      <ConfirmDialog
        open={!!selectedPartnerForToggle}
        onOpenChange={(open) => !open && setSelectedPartnerForToggle(null)}
        title={
          selectedPartnerForToggle?.statut === "inactif"
            ? "Activer ce partenaire"
            : "Désactiver ce partenaire"
        }
        description={
          selectedPartnerForToggle?.statut === "inactif"
            ? `Êtes-vous sûr de vouloir réactiver le partenaire « ${selectedPartnerForToggle?.nom} » ? Son logo réapparaîtra sur le site public.`
            : `Êtes-vous sûr de vouloir désactiver le partenaire « ${selectedPartnerForToggle?.nom} » ? Son logo sera masqué de la page partenaires publique.`
        }
        confirmText={
          selectedPartnerForToggle?.statut === "inactif"
            ? "Activer le partenaire"
            : "Désactiver le partenaire"
        }
        variant={selectedPartnerForToggle?.statut === "inactif" ? "default" : "warning"}
        isLoading={updateMutation.isPending}
        onConfirm={async () => {
          if (selectedPartnerForToggle) {
            const nextStatut =
              selectedPartnerForToggle.statut === "inactif" ? "actif" : "inactif"
            await updateMutation.mutateAsync({
              id: selectedPartnerForToggle.id,
              payload: { statut: nextStatut },
            })
          }
        }}
      />

      {/* 6. Confirmation de Suppression */}
      <ConfirmDialog
        open={!!selectedPartnerForDelete}
        onOpenChange={(open) => !open && setSelectedPartnerForDelete(null)}
        title="Supprimer ce partenaire"
        description={`Êtes-vous certain de vouloir supprimer le partenaire « ${selectedPartnerForDelete?.nom} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedPartnerForDelete) {
            await deleteMutation.mutateAsync(selectedPartnerForDelete.id)
          }
        }}
      />

    </div>
  )
}
