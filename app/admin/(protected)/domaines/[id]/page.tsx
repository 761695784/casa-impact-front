"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Layers,
  Edit,
  Power,
  Compass,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { useDomain, useUpdateDomain } from "@/hooks/use-domains"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { DomaineEditDialog } from "@/components/admin/domaines/domaine-edit-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { mockPrograms } from "@/lib/mock/programs.mock"

export default function DomaineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false)

  const { data: domain, isLoading, isError, error, refetch } = useDomain(id)
  const updateMutation = useUpdateDomain()

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
            <Skeleton className="h-72 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !domain) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/domaines">
            <ArrowLeft className="size-4" />
            <span>Retour aux domaines d'intervention</span>
          </Link>
        </Button>
        <ErrorState
          title="Domaine d'intervention introuvable"
          message={error instanceof Error ? error.message : "Ce domaine n'existe pas ou n'a pas pu être chargé."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  // Related programs matching this domain
  const associatedPrograms = mockPrograms.filter(
    (p) => p.domaine?.id === domain.id || p.domaine?.slug === domain.slug
  )

  const handleToggleStatus = async () => {
    const nextStatut = domain.statut === "actif" ? "inactif" : "actif"
    await updateMutation.mutateAsync({
      id: domain.id,
      payload: { statut: nextStatut },
    })
  }

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
            <Link href="/admin/domaines">
              <ArrowLeft className="size-4" />
              <span>Retour à tous les domaines</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href={`/domaines/${domain.slug}`} target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir la page publique</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-forest/15 font-mono text-xs font-bold text-forest">
                0{domain.ordre || domain.id}
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                /{domain.slug}
              </span>
              <StatusBadge status={domain.statut} />
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {domain.nom}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Pilier institutionnel officiel de Casa Impact pour la Casamance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsToggleStatusOpen(true)}
              className="rounded-full gap-1.5 text-xs font-medium"
            >
              <Power className="size-3.5" />
              <span>{domain.statut === "actif" ? "Désactiver" : "Activer"}</span>
            </Button>

            <Button
              onClick={() => setIsEditOpen(true)}
              size="sm"
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5 shadow-xs"
            >
              <Edit className="size-3.5" />
              <span>Modifier les textes</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Textes Institutionnels & Programmes Rattachés */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Contenu Éditorial Officiel */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Orientations Stratégiques
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Textes et Présentation Institutionnelle
              </h2>
            </div>

            {domain.resume && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Résumé succinct / Accroche
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium bg-secondary/30 rounded-2xl p-4 border border-border/50">
                  {domain.resume}
                </p>
              </div>
            )}

            {domain.description && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description détaillée des objectifs
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/20 rounded-2xl p-4 border border-border/40">
                  {domain.description}
                </p>
              </div>
            )}
          </div>

          {/* Programmes Rattachés au Domaine */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Dispositifs Opérationnels
                </span>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                  Programmes associés à ce domaine
                </h2>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {associatedPrograms.length} programme{associatedPrograms.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {associatedPrograms.length > 0 ? (
                associatedPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 transition-colors hover:border-forest/40"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Compass className="size-4 text-forest shrink-0" />
                        <p className="font-bold text-sm text-foreground truncate">
                          {prog.titre}
                        </p>
                        {prog.type && (
                          <span className="rounded-md bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest">
                            {prog.type.nom}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {prog.resume || prog.description}
                      </p>
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs text-forest hover:bg-forest/10 shrink-0 self-end sm:self-center"
                    >
                      <Link href={`/programmes/${prog.slug}`} target="_blank">
                        <span>Voir page publique</span>
                        <ExternalLink className="size-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  Aucun programme spécifique n'est encore rattaché à ce domaine.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) : Paramètres & Métadonnées */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Fiche Technique */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Informations Techniques
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Ordre d'Affichage
                </span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">
                  Position n°{domain.ordre || domain.id} sur 6
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Statut Administratif
                </span>
                <div className="mt-1">
                  <StatusBadge status={domain.statut} />
                </div>
              </div>

              {domain.updated_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Dernière Mise à Jour
                  </span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {formatDate(domain.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Règle Institutionnelle */}
          <div className="rounded-3xl border border-forest/20 bg-forest/5 p-6 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-forest font-bold text-xs">
              <ShieldCheck className="size-4" />
              <span>Nomenclature Fixe</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Les 6 domaines d'intervention sont les piliers statutaires et institutionnels de Casa Impact. Ils ne peuvent être ni supprimés ni renommés arbitrairement.
            </p>
          </div>

        </div>

      </div>

      {/* Formulaire Modal (Édition) */}
      <DomaineEditDialog
        domain={domain}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Confirmation Statut (Activer / Désactiver) */}
      <ConfirmDialog
        open={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        title={
          domain.statut === "actif"
            ? "Désactiver ce domaine d'intervention"
            : "Activer ce domaine d'intervention"
        }
        description={
          domain.statut === "actif"
            ? `Êtes-vous sûr de vouloir désactiver le domaine « ${domain.nom} » ? Il ne sera plus proposé sur le site public mais sera conservé dans l'administration.`
            : `Êtes-vous sûr de vouloir réactiver le domaine « ${domain.nom} » ?`
        }
        confirmText={
          domain.statut === "actif" ? "Désactiver le domaine" : "Activer le domaine"
        }
        variant={domain.statut === "actif" ? "warning" : "default"}
        isLoading={updateMutation.isPending}
        onConfirm={handleToggleStatus}
      />

    </div>
  )
}
