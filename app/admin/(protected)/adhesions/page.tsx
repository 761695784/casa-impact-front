"use client"

import React, { useState } from "react"
import { Users, UserCheck, Clock, UserX, CreditCard, UserPlus, FileSpreadsheet, FileDown, BellRing } from "lucide-react"
import { AdhesionsFilterBar } from "@/components/admin/adhesions/adhesions-filter-bar"
import { AdhesionsTable } from "@/components/admin/adhesions/adhesions-table"
import { AdhesionsMobileList } from "@/components/admin/adhesions/adhesions-mobile-list"
import { MembershipFormDialog } from "@/components/admin/adhesions/membership-form-dialog"
import { LegacyImportDialog } from "@/components/admin/adhesions/legacy-import-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { PaginationBar } from "@/components/admin/ui/pagination-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  useMemberships,
  useMembershipStats,
  useValidateMembership,
  useRejectMembership,
  useDeleteMembership,
  useSendPaymentReminders,
  useExportMembershipsPdf,
} from "@/hooks/use-memberships"
import type { Membership } from "@/types/models"

/** Pagination de la liste après 20 lignes (accord explicite du 2026-09-11). */
const PER_PAGE = 20

export default function AdminAdhesionsPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [region, setRegion] = useState("all")
  const [page, setPage] = useState(1)

  // Modal dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [validatingMembership, setValidatingMembership] =
    useState<Membership | null>(null)
  const [rejectingMembership, setRejectingMembership] =
    useState<Membership | null>(null)
  const [deletingMembership, setDeletingMembership] =
    useState<Membership | null>(null)
  const [isReminderConfirmOpen, setIsReminderConfirmOpen] = useState(false)

  // Changer un filtre revient toujours à la page 1 — sinon on peut se
  // retrouver sur une page qui n'existe plus pour le nouveau filtre.
  const updateSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }
  const updateStatut = (val: string) => {
    setStatut(val)
    setPage(1)
  }
  const updateRegion = (val: string) => {
    setRegion(val)
    setPage(1)
  }

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useMemberships({
    search,
    statut,
    region,
    page,
    per_page: PER_PAGE,
  })

  const memberships = data?.data ?? []
  const meta = data?.meta

  // Compteurs globaux (voir useMembershipStats) — indépendants de la page
  // et des filtres courants, lus sur meta.total côté serveur : c'est le
  // vrai total, pas juste la longueur de la page affichée (bug corrigé le
  // 2026-09-11 : ça affichait 100 au lieu de 171 après l'import historique).
  const { data: stats } = useMembershipStats()
  const counts = {
    total: stats?.total ?? 0,
    validees: stats?.validees ?? 0,
    enAttente: stats?.enAttente ?? 0,
    refusees: stats?.refusees ?? 0,
  }

  const validateMutation = useValidateMembership()
  const rejectMutation = useRejectMembership()
  const deleteMutation = useDeleteMembership()
  const sendRemindersMutation = useSendPaymentReminders()
  const exportPdfMutation = useExportMembershipsPdf()

  const handleReset = () => {
    setSearch("")
    setStatut("all")
    setRegion("all")
    setPage(1)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Page Header */}
      {/* flex-wrap + lg:flex-row (accord du 2026-09-16 : le bloc de 4
          boutons — rappel/import/export PDF/ajouter — débordait hors
          écran en sm:flex-row, la ligne ne repassant jamais à la ligne
          suivante faute de largeur disponible pour le bloc). Le bloc
          d'actions passe désormais SOUS le titre tant que l'écran n'est
          pas assez large (lg, ≥1024px), et peut encore se scinder sur
          plusieurs lignes lui-même si besoin (flex-wrap sur les deux
          niveaux) plutôt que de provoquer un scroll horizontal de page. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between flex-wrap border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <CreditCard className="size-3.5" />
            <span>Membres & Adhérents</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Gestion des Adhésions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Suivi des demandes d'adhésion, cotisations (1 000 FCFA) et attribution des cartes de membre officielles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {counts.enAttente > 0 && (
            <Button
              onClick={() => setIsReminderConfirmOpen(true)}
              variant="outline"
              className="rounded-full font-semibold gap-2 border-forest/40 text-forest hover:bg-forest/10"
            >
              <BellRing className="size-4" />
              <span>Envoyer un rappel de paiement</span>
            </Button>
          )}
          <Button
            onClick={() => setIsImportOpen(true)}
            variant="outline"
            className="rounded-full font-semibold gap-2 border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-500"
          >
            <FileSpreadsheet className="size-4" />
            <span>Importer l'historique (Excel)</span>
          </Button>
          <Button
            onClick={() => exportPdfMutation.mutate({ search, statut, region })}
            disabled={exportPdfMutation.isPending}
            variant="outline"
            className="rounded-full font-semibold gap-2 border-forest/40 text-forest hover:bg-forest/10"
          >
            <FileDown className="size-4" />
            <span>
              {exportPdfMutation.isPending ? "Génération du PDF..." : "Exporter en PDF"}
            </span>
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
          >
            <UserPlus className="size-4" />
            <span>Ajouter un membre</span>
          </Button>
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
        onSearchChange={updateSearch}
        onStatutChange={updateStatut}
        onRegionChange={updateRegion}
        onReset={handleReset}
        totalCount={meta?.total ?? memberships.length}
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
            {search || statut !== "all" || region !== "all"
              ? "Aucun résultat ne correspond aux filtres appliqués."
              : "Aucune demande d'adhésion n'a été enregistrée pour l'instant."}
          </p>
          {search || statut !== "all" || region !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="mt-4 rounded-full"
            >
              Réinitialiser les filtres
            </Button>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <Button
                onClick={() => setIsImportOpen(true)}
                variant="outline"
                size="sm"
                className="rounded-full font-semibold gap-1.5 border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-500"
              >
                <FileSpreadsheet className="size-4" />
                <span>Importer l'historique (Excel)</span>
              </Button>
              <Button
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
              >
                <UserPlus className="size-4" />
                <span>Ajouter un membre</span>
              </Button>
            </div>
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

          {/* Pagination (20 par page) */}
          {meta && (
            <PaginationBar
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={setPage}
              disabled={isLoading}
              itemLabel="membre"
            />
          )}
        </div>
      )}

      {/* Formulaire d'ajout manuel (membre historique) */}
      <MembershipFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {/* Import en masse de l'historique (fichier Excel) */}
      <LegacyImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />

      {/* Validation Confirmation Dialog */}
      <ConfirmDialog
        open={!!validatingMembership}
        onOpenChange={(open) => !open && setValidatingMembership(null)}
        title="Valider cette adhésion ?"
        description={`Confirmez-vous la réception du règlement (1 000 FCFA) et l'activation du statut de membre officiel pour ${validatingMembership?.nom_complet} (${validatingMembership?.numero_membre}) ?`}
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

      {/* Rappel de paiement — accord du 2026-09-11, cible tous les membres
          en_attente_paiement (recalculé côté serveur au moment de l'envoi). */}
      <ConfirmDialog
        open={isReminderConfirmOpen}
        onOpenChange={setIsReminderConfirmOpen}
        title="Envoyer un rappel de paiement ?"
        description={`${counts.enAttente} membre(s) n'ont pas encore finalisé leur adhésion (paiement en attente). Ils recevront un email de rappel avec les instructions de paiement Wave.`}
        confirmText="Envoyer les rappels"
        variant="default"
        isLoading={sendRemindersMutation.isPending}
        onConfirm={async () => {
          await sendRemindersMutation.mutateAsync()
          setIsReminderConfirmOpen(false)
        }}
      />

      {/* Deletion Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingMembership}
        onOpenChange={(open) => !open && setDeletingMembership(null)}
        title="Supprimer définitivement cette adhésion ?"
        description={`Cette action est irréversible. La demande de ${deletingMembership?.nom_complet} (${deletingMembership?.numero_membre}) sera effacée de la base.`}
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
