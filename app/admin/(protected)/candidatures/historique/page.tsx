"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  History,
  ArrowLeft,
  Download,
  Loader2,
  Mail,
  RefreshCcw,
  ArrowRight,
  User,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { PaginationBar } from "@/components/admin/ui/pagination-bar"
import { ErrorState } from "@/components/admin/ui/error-state"
import { useApplicationHistory, useExportApplicationHistory } from "@/hooks/use-applications"
import { useApplicationCalls } from "@/hooks/use-application-calls"
import { APPLICATION_STATUS_LABELS } from "@/types/enums"
import type { ApplicationStatus } from "@/types/enums"

const PER_PAGE = 20

/**
 * Page dédiée à l'historique persistant des candidatures (accord du
 * 2026-09-14 : "aussi une page ou un export pour l'historiques
 * persistant") — regroupe à plat les changements de statut et les emails
 * envoyés (groupés ou manuels), toutes candidatures confondues, pour
 * pouvoir être présentée telle quelle à un partenaire.
 */
export default function CandidaturesHistoriquePage() {
  const [appelId, setAppelId] = useState("all")
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)

  const { data: applicationCallsData } = useApplicationCalls({ per_page: 100 })
  const applicationCalls = applicationCallsData?.data || []

  const { data, isLoading, isError, error, refetch } = useApplicationHistory({
    application_call_id: appelId,
    type,
    page,
    per_page: PER_PAGE,
  })

  const exportMutation = useExportApplicationHistory()

  const entries = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0, per_page: PER_PAGE }

  const handleExport = () => {
    exportMutation.mutate({
      application_call_id: appelId !== "all" ? appelId : undefined,
      type: type !== "all" ? type : undefined,
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <Link
            href="/admin/candidatures"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Retour aux candidatures</span>
          </Link>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-700">
            <History className="size-3.5" />
            <span>Historique persistant</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Historique des Candidatures
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Traçabilité complète des décisions et des emails envoyés — pour présenter aux partenaires ce qui a été fait.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            disabled={exportMutation.isPending}
            onClick={handleExport}
            className="rounded-full gap-1.5 border-border bg-card"
          >
            {exportMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin text-primary" />
            ) : (
              <Download className="size-3.5 text-forest" />
            )}
            <span>Exporter CSV</span>
          </Button>
        </div>
      </div>

      {/* 2. Filtres */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
        <div className="w-[220px]">
          <Select
            value={appelId}
            onValueChange={(val) => {
              setAppelId(val || "all")
              setPage(1)
            }}
          >
            <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
              <SelectValue placeholder="Tous les appels" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl text-xs max-w-xs">
              <SelectItem value="all">Tous les appels</SelectItem>
              {applicationCalls.map((call) => (
                <SelectItem key={call.id} value={String(call.id)}>
                  {call.titre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Select
            value={type}
            onValueChange={(val) => {
              setType(val || "all")
              setPage(1)
            }}
          >
            <SelectTrigger className="h-10 rounded-full text-xs bg-background">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl text-xs">
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="statut_change">Changements de statut</SelectItem>
              <SelectItem value="email_envoye">Emails envoyés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto text-xs text-muted-foreground">
          {meta.total} entrée{meta.total > 1 ? "s" : ""}
        </div>
      </div>

      {/* 3. Contenu */}
      {isLoading ? (
        <div className="space-y-3 rounded-3xl border border-border bg-card p-6">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement de l'historique"
          message={error instanceof Error ? error.message : "Impossible de récupérer l'historique."}
          onRetry={() => refetch()}
        />
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <History className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucune entrée d'historique
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {appelId !== "all" || type !== "all"
              ? "Aucun résultat ne correspond aux filtres appliqués."
              : "Aucun changement de statut ni email n'a encore été enregistré."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-2xs">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Candidat</th>
                  <th className="px-4 py-3 font-semibold">Appel</th>
                  <th className="px-4 py-3 font-semibold">Détail</th>
                  <th className="px-4 py-3 font-semibold">Effectué par</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {entry.created_at
                        ? new Date(entry.created_at).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {entry.type === "email_envoye" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-700">
                          <Mail className="size-3" />
                          <span>Email envoyé</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 font-semibold text-sky-700">
                          <RefreshCcw className="size-3" />
                          <span>Changement de statut</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">
                        {entry.application?.candidat_nom || "—"}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        {entry.application?.reference || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[180px] truncate text-muted-foreground">
                      {entry.application?.application_call?.titre || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {entry.type === "email_envoye" ? (
                        <span className="text-muted-foreground">
                          {entry.sujet_email ||
                            (entry.nouveau_statut
                              ? `Email « ${APPLICATION_STATUS_LABELS[entry.nouveau_statut as ApplicationStatus] ?? entry.nouveau_statut} »`
                              : "—")}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {entry.ancien_statut ? (
                            <StatusBadge status={entry.ancien_statut} />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                          <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                          {entry.nouveau_statut ? (
                            <StatusBadge status={entry.nouveau_statut} />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {entry.user?.name ? (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="size-3" />
                          <span>{entry.user.name}</span>
                        </span>
                      ) : (
                        "Système"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationBar
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            perPage={meta.per_page}
            onPageChange={setPage}
            disabled={isLoading}
            itemLabel="entrée"
          />
        </div>
      )}
    </div>
  )
}
