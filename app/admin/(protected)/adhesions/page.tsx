"use client"

import React, { useState, useMemo } from "react"
import { Users, UserCheck, Clock, UserX, CreditCard } from "lucide-react"
import { AdhesionsFilterBar } from "@/components/admin/adhesions/adhesions-filter-bar"
import { AdhesionsTable } from "@/components/admin/adhesions/adhesions-table"
import { AdhesionsMobileList } from "@/components/admin/adhesions/adhesions-mobile-list"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  useMemberships,
  useValidateMembership,
  useRejectMembership,
  useDeleteMembership,
} from "@/hooks/use-memberships"
import type { Membership } from "@/types/models"

export default function AdminAdhesionsPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [region, setRegion] = useState("all")
  const [paiementStatut, setPaiementStatut] = useState("all")

  // Modal dialog states
  const [validatingMembership, setValidatingMembership] =
    useState<Membership | null>(null)
  const [rejectingMembership, setRejectingMembership] =
    useState<Membership | null>(null)
  const [deletingMembership, setDeletingMembership] =
    useState<Membership | null>(null)

  const {
    data: memberships = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMemberships({
    search,
    statut,
    region,
    paiement_statut: paiementStatut,
  })

  const validateMutation = useValidateMembership()
  const rejectMutation = useRejectMembership()
  const deleteMutation = useDeleteMembership()

  const handleReset = () => {
    setSearch("")
    setStatut("all")
    setRegion("all")
    setPaiementStatut("all")
  }

  // Summary counts computed dynamically
  const counts = useMemo(() => {
    return {
      total: memberships.length,
      validees: memberships.filter((m) => m.statut === "validee").length,
      enAttente: memberships.filter(
        (m) => m.statut === "en_attente_paiement"
      ).length,
      refusees: memberships.filter((m) => m.statut === "refusee").length,
    }
  }, [memberships])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <CreditCard className="size-3.5" />
            <span>Mouvement & Adhérents</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Gestion des Adhésions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Suivi des demandes d'adhésion, cotisations (1 000 FCFA) et attribution des cartes de membre officielles.
          </p>
        </div>
      </div>

      {/* 2. KPI Counters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Users className="size-4 text-forest" />
            <span>Total Demandes</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {counts.total}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <UserCheck className="size-4 text-emerald-600" />
            <span>Membres Validés</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {counts.validees}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Clock className="size-4 text-amber-600" />
            <span>En attente de cotisation</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600">
            {counts.enAttente}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <UserX className="size-4 text-rose-600" />
            <span>Refusées / Sans suite</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600">
            {counts.refusees}
          </p>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <AdhesionsFilterBar
        search={search}
        statut={statut}
        region={region}
        paiementStatut={paiementStatut}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onRegionChange={setRegion}
        onPaiementStatutChange={setPaiementStatut}
        onReset={handleReset}
        totalCount={memberships.length}
      />

      {/* 4. Content State */}
      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Impossible de charger les demandes d'adhésion"
          message={
            error instanceof Error ? error.message : "Erreur de connexion."
          }
          onRetry={() => refetch()}
        />
      ) : memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Users className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucune demande d'adhésion trouvée
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search ||
            statut !== "all" ||
            region !== "all" ||
            paiementStatut !== "all"
              ? "Aucun résultat ne correspond aux filtres appliqués."
              : "Aucune demande d'adhésion n'a été enregistrée pour l'instant."}
          </p>
          {(search ||
            statut !== "all" ||
            region !== "all" ||
            paiementStatut !== "all") && (
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
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <AdhesionsTable
              memberships={memberships}
              onValidate={(m) => setValidatingMembership(m)}
              onReject={(m) => setRejectingMembership(m)}
              onDelete={(m) => setDeletingMembership(m)}
            />
          </div>

          {/* Mobile Cards View */}
          <AdhesionsMobileList
            memberships={memberships}
            onValidate={(m) => setValidatingMembership(m)}
            onReject={(m) => setRejectingMembership(m)}
            onDelete={(m) => setDeletingMembership(m)}
          />
        </div>
      )}

      {/* Validation Confirmation Dialog */}
      <ConfirmDialog
        open={!!validatingMembership}
        onOpenChange={(open) => !open && setValidatingMembership(null)}
        title="Valider cette adhésion ?"
        description={`Confirmez-vous la réception du règlement (1 000 FCFA) et l'activation du statut de membre officiel pour ${validatingMembership?.nom_complet} (${validatingMembership?.reference}) ?`}
        confirmText="Valider l'adhésion"
        variant="default"
        isLoading={validateMutation.isPending}
        onConfirm={async () => {
          if (validatingMembership) {
            await validateMutation.mutateAsync(validatingMembership.id)
            setValidatingMembership(null)
          }
        }}
      />

      {/* Rejection Confirmation Dialog */}
      <ConfirmDialog
        open={!!rejectingMembership}
        onOpenChange={(open) => !open && setRejectingMembership(null)}
        title="Refuser cette demande d'adhésion ?"
        description={`Êtes-vous certain de vouloir marquer comme refusée la demande de ${rejectingMembership?.nom_complet} ?`}
        confirmText="Refuser"
        variant="destructive"
        isLoading={rejectMutation.isPending}
        onConfirm={async () => {
          if (rejectingMembership) {
            await rejectMutation.mutateAsync(rejectingMembership.id)
            setRejectingMembership(null)
          }
        }}
      />

      {/* Deletion Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingMembership}
        onOpenChange={(open) => !open && setDeletingMembership(null)}
        title="Supprimer définitivement cette adhésion ?"
        description={`Cette action est irréversible. La demande de ${deletingMembership?.nom_complet} (${deletingMembership?.reference}) sera effacée de la base.`}
        confirmText="Supprimer"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deletingMembership) {
            await deleteMutation.mutateAsync(deletingMembership.id)
            setDeletingMembership(null)
          }
        }}
      />
    </div>
  )
}
