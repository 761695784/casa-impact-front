"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart3,
  Edit,
  Trash2,
  TrendingUp,
  ExternalLink,
  Layers,
  Compass,
  MapPin,
  Calendar,
} from "lucide-react"
import {
  useImpactIndicator,
  useDeleteImpactIndicator,
} from "@/hooks/use-impact"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { ImpactIndicatorFormDialog } from "@/components/admin/impact/impact-indicator-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"

export default function ImpactIndicatorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const {
    data: indicator,
    isLoading,
    isError,
    error,
    refetch,
  } = useImpactIndicator(id)
  const deleteMutation = useDeleteImpactIndicator()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in-50">
        <Skeleton className="h-6 w-44 rounded-lg" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !indicator) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/impact">
            <ArrowLeft className="size-4" />
            <span>Retour aux indicateurs</span>
          </Link>
        </Button>
        <ErrorState
          title="Indicateur introuvable"
          message={
            error instanceof Error
              ? error.message
              : "Cet indicateur d'impact n'existe pas ou n'a pas pu être chargé."
          }
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(indicator.id)
    router.push("/admin/impact")
  }

  const currentVal =
    indicator.valeurs && indicator.valeurs.length > 0
      ? indicator.valeurs.reduce((acc, v) => acc + (v.valeur || 0), 0)
      : 0
  const progress = indicator.cible
    ? Math.min(100, Math.round((currentVal / indicator.cible) * 100))
    : null

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* 1. Top Navigation & Action Header */}
      <div className="space-y-4 border-b border-border/80 pb-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2"
          >
            <Link href="/admin/impact">
              <ArrowLeft className="size-4" />
              <span>Retour à tous les indicateurs</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href="/impact" target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir la section publique Impact</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-forest/10 px-2.5 py-0.5 font-bold text-forest text-xs uppercase tracking-wider">
                {indicator.categorie || "Indicateur Clé"}
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                Rang #{indicator.ordre || indicator.id}
              </span>
              <StatusBadge status={indicator.statut || "actif"} />
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {indicator.libelle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Indicateur de mesure et d'impact territorial Casa Impact.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-full gap-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:border-destructive/30"
            >
              <Trash2 className="size-3.5" />
              <span>Supprimer</span>
            </Button>

            <Button
              onClick={() => setIsEditOpen(true)}
              size="sm"
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5 shadow-xs"
            >
              <Edit className="size-3.5" />
              <span>Modifier l'indicateur</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Description & Historique */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Définition */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Définition & Méthode
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Périmètre de Mesure
              </h2>
            </div>

            {indicator.description ? (
              <p className="text-sm sm:text-base leading-relaxed text-foreground bg-secondary/30 rounded-2xl p-5 border border-border/50">
                {indicator.description}
              </p>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Aucune description spécifique renseignée pour cet indicateur.
              </p>
            )}
          </div>

          {/* Découpage Temporel & Régional */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground border-b border-border/80 pb-3">
              Historique des Mesures Enregistrées
            </h3>

            {indicator.valeurs && indicator.valeurs.length > 0 ? (
              <div className="divide-y divide-border/60">
                {indicator.valeurs.map((val) => (
                  <div
                    key={val.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-semibold text-foreground bg-secondary px-2.5 py-1 rounded-md">
                        {val.periode}
                      </span>
                      {val.region && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="size-3 text-forest" />
                          <span>{REGION_LABELS[val.region] || val.region}</span>
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-bold text-sm text-foreground">
                      {formatNumber(val.valeur)} {indicator.unite || ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Aucune mesure enregistrée pour le moment.
              </p>
            )}
          </div>

          {/* Rattachements Domaine / Programme */}
          {(indicator.domaine || indicator.programme) && (
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
              <h3 className="font-display text-lg font-bold text-foreground border-b border-border/80 pb-3">
                Rattachement Stratégique
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {indicator.domaine && (
                  <Link
                    href={`/admin/domaines/${indicator.domaine.id}`}
                    className="rounded-2xl bg-secondary/30 p-4 border border-border/60 hover:bg-forest/5 hover:border-forest/30 transition-all flex items-start gap-3"
                  >
                    <Layers className="size-5 text-forest mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Domaine d'Intervention
                      </span>
                      <span className="font-bold text-sm text-foreground block truncate mt-0.5">
                        {indicator.domaine.nom}
                      </span>
                    </div>
                  </Link>
                )}

                {indicator.programme && (
                  <Link
                    href={`/admin/programmes/${indicator.programme.id}`}
                    className="rounded-2xl bg-secondary/30 p-4 border border-border/60 hover:bg-forest/5 hover:border-forest/30 transition-all flex items-start gap-3"
                  >
                    <Compass className="size-5 text-forest mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Programme Associé
                      </span>
                      <span className="font-bold text-sm text-foreground block truncate mt-0.5">
                        {indicator.programme.titre}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 cols) : Chiffres Clés & Métadonnées */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Synthèse Chiffrée */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Mesure & Objectif
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Valeur Mesurée
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {formatNumber(currentVal)}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {indicator.unite}
                  </span>
                </div>
              </div>

              {indicator.cible && (
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Objectif Territorial</span>
                    <span className="font-mono font-bold text-foreground">
                      {formatNumber(indicator.cible)} {indicator.unite}
                    </span>
                  </div>

                  {progress !== null && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-forest">Taux d'atteinte</span>
                        <span className="font-bold text-forest">{progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-forest transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Paramètres & Suivi */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Suivi Administratif
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Catégorie
                </span>
                <span className="font-medium text-foreground mt-0.5 block">
                  {indicator.categorie || "Général"}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Statut
                </span>
                <div className="mt-1">
                  <StatusBadge status={indicator.statut || "actif"} />
                </div>
              </div>

              {indicator.updated_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Dernière Actualisation
                  </span>
                  <span className="font-medium text-muted-foreground mt-0.5 block">
                    {formatDate(indicator.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Formulaire Modal */}
      <ImpactIndicatorFormDialog
        indicator={indicator}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer cet indicateur"
        description={`Êtes-vous certain de vouloir supprimer l'indicateur « ${indicator.libelle} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
