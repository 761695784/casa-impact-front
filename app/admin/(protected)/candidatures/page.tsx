"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Inbox,
  Filter,
  Plus,
  ArrowUpDown,
  FileCheck2,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  History,
} from "lucide-react"
import {
  useApplications,
  useDeleteApplication,
  usePendingNotificationsCount,
  useNotifyPendingApplications,
} from "@/hooks/use-applications"
import { CandidaturesFilterBar } from "@/components/admin/candidatures/candidatures-filter-bar"
import { CandidaturesTable } from "@/components/admin/candidatures/candidatures-table"
import { CandidaturesMobileList } from "@/components/admin/candidatures/candidatures-mobile-list"
import { CandidatureStatusModal } from "@/components/admin/candidatures/candidature-status-modal"
import { CandidaturePromoteModal } from "@/components/admin/candidatures/candidature-promote-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { PaginationBar } from "@/components/admin/ui/pagination-bar"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { APPLICATION_STATUS_LABELS } from "@/types/enums"
import type { Application } from "@/types/models"
import type { ApplicationStatus } from "@/types/enums"

export default function CandidaturesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [region, setRegion] = useState("all")
  const [appelId, setAppelId] = useState("all")
  const [page, setPage] = useState(1)

  // Selected modals state
  const [selectedAppForStatus, setSelectedAppForStatus] = useState<Application | null>(null)
  const [selectedAppForPromote, setSelectedAppForPromote] = useState<Application | null>(null)
  const [selectedAppForDelete, setSelectedAppForDelete] = useState<Application | null>(null)
  const [isNotifyConfirmOpen, setIsNotifyConfirmOpen] = useState(false)

  const { data, isLoading, isError, error, refetch } = useApplications({
    search,
    statut,
    region,
    appel_id: appelId,
    page,
    per_page: 10,
  })

  const deleteMutation = useDeleteApplication()

  // Envoi groupé des emails "en attente" — accord du 2026-09-14 : on
  // n'envoie plus automatiquement à chaque changement de statut, l'admin
  // déclenche l'envoi des séries d'emails une fois tous les dossiers
  // tranchés. Scopé au filtre "appel" courant (comme l'export CSV) : sans
  // appel sélectionné, porte sur tous les appels confondus.
  const { data: pendingCount } = usePendingNotificationsCount(appelId)
  const notifyPendingMutation = useNotifyPendingApplications()
  const pendingTotal = pendingCount?.total ?? 0

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setRegion("all")
    setAppelId("all")
    setPage(1)
  }

  const applications = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0, per_page: 10 }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Header de la Page */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-700">
            <Inbox className="size-3.5" />
            <span>Module Recrutement & Sélection</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Candidatures aux Programmes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Examinez, évaluez et pilotez les dossiers déposés pour l'Académie du Leadership et les Incubateurs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingTotal > 0 && (
            <Button
              onClick={() => setIsNotifyConfirmOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5 font-semibold border-forest/40 text-forest hover:bg-forest/10"
            >
              <Send className="size-3.5" />
              <span>Envoyer les emails en attente ({pendingTotal})</span>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 border-border bg-card">
            <Link href="/admin/candidatures/historique">
              <History className="size-3.5" />
              <span>Historique</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 border-border bg-card">
            <Link href="/admin/appels-a-candidatures">
              <span>Voir les appels ouverts</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Barre de Recherche & Filtres */}
      <CandidaturesFilterBar
        search={search}
        statut={statut}
        region={region}
        appelId={appelId}
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
        onAppelIdChange={(val) => {
          setAppelId(val)
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
          title="Erreur lors du chargement des candidatures"
          message={error instanceof Error ? error.message : "Impossible de récupérer la liste des candidatures."}
          onRetry={() => refetch()}
        />
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Inbox className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucune candidature trouvée
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || region !== "all" || appelId !== "all"
              ? "Aucun résultat ne correspond à vos critères de recherche actuels."
              : "Aucune candidature n'a encore été enregistrée pour ce programme."}
          </p>
          {(search || statut !== "all" || region !== "all" || appelId !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="mt-5 rounded-full text-xs"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table */}
          <div className="hidden md:block">
            <CandidaturesTable
              applications={applications}
              onOpenStatusModal={(app) => setSelectedAppForStatus(app)}
              onOpenPromoteModal={(app) => setSelectedAppForPromote(app)}
              onDeleteApplication={(app) => setSelectedAppForDelete(app)}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden">
            <CandidaturesMobileList
              applications={applications}
              onOpenStatusModal={(app) => setSelectedAppForStatus(app)}
              onOpenPromoteModal={(app) => setSelectedAppForPromote(app)}
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

      {/* 4. Modales de Gestion */}
      <CandidatureStatusModal
        application={selectedAppForStatus}
        open={!!selectedAppForStatus}
        onOpenChange={(open) => !open && setSelectedAppForStatus(null)}
      />

      <CandidaturePromoteModal
        application={selectedAppForPromote}
        open={!!selectedAppForPromote}
        onOpenChange={(open) => !open && setSelectedAppForPromote(null)}
      />

      <ConfirmDialog
        open={!!selectedAppForDelete}
        onOpenChange={(open) => !open && setSelectedAppForDelete(null)}
        title="Supprimer la candidature"
        description={`Êtes-vous certain de vouloir supprimer la candidature ${selectedAppForDelete?.reference} (${selectedAppForDelete?.candidat_nom}) ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedAppForDelete) {
            await deleteMutation.mutateAsync(selectedAppForDelete.id)
          }
        }}
      />

      {/* Envoi groupé des emails en attente — accord du 2026-09-14 :
          "on etudie on voit si c'est bon on fait retenue mais on envoie
          pas encore de mail, apres si on finit de choisir on envoie les
          series d'emails par statut". Scopé au filtre "appel" courant
          (comme l'export CSV) ; ne renvoie jamais deux fois le même email
          pour un même statut (dédoublonnage côté serveur via l'historique). */}
      <ConfirmDialog
        open={isNotifyConfirmOpen}
        onOpenChange={setIsNotifyConfirmOpen}
        title="Envoyer les emails en attente ?"
        description={
          `${pendingTotal} candidat(s) ` +
          (appelId !== "all" ? "de cet appel " : "") +
          `n'ont pas encore reçu l'email correspondant à leur statut actuel` +
          (pendingCount?.par_statut && Object.keys(pendingCount.par_statut).length > 0
            ? ` (${Object.entries(pendingCount.par_statut)
                .map(([statut, n]) => `${n} ${APPLICATION_STATUS_LABELS[statut as ApplicationStatus] ?? statut}`)
                .join(", ")})`
            : "") +
          `. Chacun recevra l'email contextuel de son statut actuel.`
        }
        confirmText="Envoyer les emails"
        variant="default"
        isLoading={notifyPendingMutation.isPending}
        onConfirm={async () => {
          await notifyPendingMutation.mutateAsync(appelId)
          setIsNotifyConfirmOpen(false)
        }}
      />

    </div>
  )
}
