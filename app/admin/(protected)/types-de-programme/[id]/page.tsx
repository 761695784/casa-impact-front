"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Tag,
  Edit,
  Power,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react"
import { useProgramType, useUpdateProgramType } from "@/hooks/use-program-types"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { ProgramTypeEditDialog } from "@/components/admin/program-types/program-type-edit-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { mockPrograms } from "@/lib/mock/programs.mock"

export default function ProgramTypeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false)

  const { data: programType, isLoading, isError, error, refetch } = useProgramType(id)
  const updateMutation = useUpdateProgramType()

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
            <Skeleton className="h-72 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !programType) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/types-de-programme">
            <ArrowLeft className="size-4" />
            <span>Retour aux types de programme</span>
          </Link>
        </Button>
        <ErrorState
          title="Type de programme introuvable"
          message={error instanceof Error ? error.message : "Cette typologie n'existe pas ou n'a pas pu être chargée."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  // Associated programs matching this program type
  const associatedPrograms = mockPrograms.filter(
    (p) => p.type_id === programType.id || p.type?.id === programType.id || p.type?.slug === programType.slug
  )

  const handleToggleStatus = async () => {
    const nextStatut = programType.statut === "inactif" ? "actif" : "inactif"
    await updateMutation.mutateAsync({
      id: programType.id,
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
            <Link href="/admin/types-de-programme">
              <ArrowLeft className="size-4" />
              <span>Retour à toutes les typologies</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href={`/admin/programmes?type_id=${programType.id}`}>
              <Compass className="size-3.5 text-forest" />
              <span>Voir les programmes associés ({associatedPrograms.length})</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-forest/15 font-mono text-xs font-bold text-forest">
                0{programType.ordre || programType.id}
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                /{programType.slug}
              </span>
              <StatusBadge status={programType.statut || "actif"} />
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {programType.nom}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Modalité et cadre d'intervention officiel pour les initiatives territoriales.
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
              <span>{programType.statut === "inactif" ? "Activer" : "Désactiver"}</span>
            </Button>

            <Button
              onClick={() => setIsEditOpen(true)}
              size="sm"
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5 shadow-xs"
            >
              <Edit className="size-3.5" />
              <span>Modifier la modalité</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Description & Programmes Liés */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Description */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Définition de la Typologie
            </span>
            <h2 className="font-display text-xl font-bold text-foreground">
              Objectifs et Formats d'Intervention
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/30 rounded-2xl p-5 border border-border/50">
              {programType.description || "Aucune description détaillée enregistrée pour cette typologie."}
            </p>
          </div>

          {/* Programmes Rattachés */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Déploiement Opérationnel
                </span>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                  Programmes utilisant ce format
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
                        {prog.domaine && (
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            {prog.domaine.nom}
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
                      className="rounded-full text-xs text-primary shrink-0 self-end sm:self-center gap-1"
                    >
                      <Link href={`/admin/programmes/${prog.id}`}>
                        <span>Fiche programme</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  Aucun programme n'utilise actuellement cette typologie d'intervention.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) : Métadonnées */}
        <div className="space-y-8 lg:col-span-4">
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
                  Position n°{programType.ordre || programType.id}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Statut
                </span>
                <div className="mt-1">
                  <StatusBadge status={programType.statut || "actif"} />
                </div>
              </div>

              {programType.updated_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Dernière Mise à Jour
                  </span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {formatDate(programType.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Formulaire Modal */}
      <ProgramTypeEditDialog
        programType={programType}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Confirmation Statut */}
      <ConfirmDialog
        open={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        title={
          programType.statut === "inactif"
            ? "Activer ce type de programme"
            : "Désactiver ce type de programme"
        }
        description={
          programType.statut === "inactif"
            ? `Êtes-vous sûr de vouloir réactiver la modalité « ${programType.nom} » ?`
            : `Êtes-vous sûr de vouloir désactiver la modalité « ${programType.nom} » ?`
        }
        confirmText={
          programType.statut === "inactif"
            ? "Activer la modalité"
            : "Désactiver la modalité"
        }
        variant={programType.statut === "inactif" ? "default" : "warning"}
        isLoading={updateMutation.isPending}
        onConfirm={handleToggleStatus}
      />

    </div>
  )
}
