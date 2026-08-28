"use client"

import React, { useState } from "react"
import { Layers, ShieldCheck } from "lucide-react"
import { useDomains, useUpdateDomain } from "@/hooks/use-domains"
import { DomainesFilterBar } from "@/components/admin/domaines/domaines-filter-bar"
import { DomainesGrid } from "@/components/admin/domaines/domaines-grid"
import { DomaineEditDialog } from "@/components/admin/domaines/domaine-edit-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { Domain } from "@/types/models"

export default function DomainesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")

  // Selected modals state
  const [selectedDomainForEdit, setSelectedDomainForEdit] = useState<Domain | null>(null)
  const [selectedDomainForToggle, setSelectedDomainForToggle] = useState<Domain | null>(null)

  const { data: domains = [], isLoading, isError, error, refetch } = useDomains({
    search,
    statut,
  })

  const updateMutation = useUpdateDomain()

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
            <Layers className="size-3.5" />
            <span>Nomenclature Institutionnelle Officielle</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Domaines d'Intervention
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Les 6 piliers stratégiques de Casa Impact pour la transformation et l'attractivité de la Casamance.
          </p>
        </div>
      </div>

      {/* 2. Barre de Recherche & Filtres */}
      <DomainesFilterBar
        search={search}
        statut={statut}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onReset={handleResetFilters}
        totalCount={domains.length}
      />

      {/* 3. Contenu : Loading / Error / Empty / Grid */}
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-6 space-y-4"
            >
              <div className="flex justify-between">
                <Skeleton className="size-7 rounded-xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-xl" />
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
          title="Erreur lors du chargement des domaines d'intervention"
          message={error instanceof Error ? error.message : "Impossible de récupérer les domaines."}
          onRetry={() => refetch()}
        />
      ) : domains.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Layers className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun domaine d'intervention trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all"
              ? "Aucun domaine ne correspond à vos critères de recherche."
              : "Les 6 domaines institutionnels ne sont pas encore configurés."}
          </p>
        </div>
      ) : (
        <DomainesGrid
          domains={domains}
          onEdit={(d) => setSelectedDomainForEdit(d)}
          onToggleStatus={(d) => setSelectedDomainForToggle(d)}
        />
      )}

      {/* 4. Modale de Modification */}
      <DomaineEditDialog
        domain={selectedDomainForEdit}
        open={!!selectedDomainForEdit}
        onOpenChange={(open) => !open && setSelectedDomainForEdit(null)}
      />

      {/* 5. Confirmation d'Activation / Désactivation */}
      <ConfirmDialog
        open={!!selectedDomainForToggle}
        onOpenChange={(open) => !open && setSelectedDomainForToggle(null)}
        title={
          selectedDomainForToggle?.statut === "actif"
            ? "Désactiver ce domaine d'intervention"
            : "Activer ce domaine d'intervention"
        }
        description={
          selectedDomainForToggle?.statut === "actif"
            ? `Êtes-vous sûr de vouloir désactiver le domaine « ${selectedDomainForToggle?.nom} » ? Il sera masqué des sélections publiques sans être supprimé.`
            : `Êtes-vous sûr de vouloir réactiver le domaine « ${selectedDomainForToggle?.nom} » ?`
        }
        confirmText={
          selectedDomainForToggle?.statut === "actif"
            ? "Désactiver le domaine"
            : "Activer le domaine"
        }
        variant={selectedDomainForToggle?.statut === "actif" ? "warning" : "default"}
        isLoading={updateMutation.isPending}
        onConfirm={async () => {
          if (selectedDomainForToggle) {
            const nextStatut =
              selectedDomainForToggle.statut === "actif" ? "inactif" : "actif"
            await updateMutation.mutateAsync({
              id: selectedDomainForToggle.id,
              payload: { statut: nextStatut },
            })
          }
        }}
      />

    </div>
  )
}
