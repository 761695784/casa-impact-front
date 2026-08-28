"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Compass,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  Tag,
  MapPin,
  Calendar,
  Megaphone,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { useProgram, useDeleteProgram } from "@/hooks/use-programs"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { ProgrammeFormDialog } from "@/components/admin/programmes/programme-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import { mockApplicationCalls } from "@/lib/mock/application-calls.mock"

export default function ProgrammeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: program, isLoading, isError, error, refetch } = useProgram(id)
  const deleteMutation = useDeleteProgram()

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

  if (isError || !program) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/programmes">
            <ArrowLeft className="size-4" />
            <span>Retour aux programmes</span>
          </Link>
        </Button>
        <ErrorState
          title="Programme introuvable"
          message={error instanceof Error ? error.message : "Ce programme n'existe pas ou n'a pas pu être chargé."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  // Related calls linked to this program
  const relatedCalls = mockApplicationCalls.filter(
    (call) => call.programme_id === program.id || call.programme?.id === program.id
  )

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(program.id)
    router.push("/admin/programmes")
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
            <Link href="/admin/programmes">
              <ArrowLeft className="size-4" />
              <span>Retour à tous les programmes</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href={`/programmes/${program.slug}`} target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir la page publique</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-forest/15 font-mono text-xs font-bold text-forest">
                #{program.id}
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                /{program.slug}
              </span>
              <StatusBadge status={program.statut} />
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {program.titre}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Dispositif opérationnel de Casa Impact.
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
              <span>Modifier le programme</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Présentation & Appels à candidatures liés */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Contenu Éditorial */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Présentation Opérationnelle
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Description & Objectifs du Programme
              </h2>
            </div>

            {program.resume && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Synthèse / Résumé d'accroche
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium bg-secondary/30 rounded-2xl p-4 border border-border/50">
                  {program.resume}
                </p>
              </div>
            )}

            {program.description && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description institutionnelle détaillée
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/20 rounded-2xl p-4 border border-border/40">
                  {program.description}
                </p>
              </div>
            )}
          </div>

          {/* Appels à candidatures associés */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Recrutement & Opportunités
                </span>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                  Appels à candidatures associés
                </h2>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {relatedCalls.length} appel{relatedCalls.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {relatedCalls.length > 0 ? (
                relatedCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 transition-colors hover:border-forest/40"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Megaphone className="size-4 text-forest shrink-0" />
                        <p className="font-bold text-sm text-foreground truncate">
                          {call.titre}
                        </p>
                        <StatusBadge status={call.statut} />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {call.resume || call.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                        <span>{call.candidatures_count || 0} candidatures reçues</span>
                        {call.date_limite && (
                          <span>Clôture : {formatDate(call.date_limite)}</span>
                        )}
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs text-primary shrink-0 self-end sm:self-center gap-1"
                    >
                      <Link href={`/admin/appels-a-candidatures/${call.id}`}>
                        <span>Gérer l'appel</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  Aucun appel à candidatures n'est actuellement rattaché à ce programme.
                </div>
              )}

              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full text-xs gap-1.5 border-dashed"
                >
                  <Link href="/admin/appels-a-candidatures">
                    <Megaphone className="size-3.5 text-forest" />
                    <span>Accéder au module complet des Appels à candidatures</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) : Rattachements & Données Opérationnelles */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Rattachements Stratégiques */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Classification
            </h3>

            <div className="space-y-4 text-xs">
              {/* Domaine */}
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Domaine d'Intervention
                </span>
                {program.domaine ? (
                  <Link
                    href={`/admin/domaines/${program.domaine.id}`}
                    className="mt-1.5 inline-flex items-center gap-1.5 rounded-xl bg-forest/10 px-3 py-2 text-xs font-bold text-forest hover:bg-forest/20 transition-colors w-full"
                  >
                    <Layers className="size-3.5 shrink-0" />
                    <span className="truncate">{program.domaine.nom}</span>
                    <ArrowRight className="size-3 ml-auto shrink-0" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground mt-1 block">Non renseigné</span>
                )}
              </div>

              {/* Type */}
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Type de Programme
                </span>
                {program.type ? (
                  <Link
                    href={`/admin/types-de-programme/${program.type.id}`}
                    className="mt-1.5 inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors w-full"
                  >
                    <Tag className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{program.type.nom}</span>
                    <ArrowRight className="size-3 ml-auto shrink-0" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground mt-1 block">Non renseigné</span>
                )}
              </div>
            </div>
          </div>

          {/* Déploiement & Calendrier */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Cadre Opérationnel
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Zone d'Intervention
                </span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">
                  {program.region ? REGION_LABELS[program.region] : "Multi-régional / Tout territoire"}
                </span>
                {program.localisation && (
                  <span className="text-xs text-muted-foreground mt-0.5 block">
                    {program.localisation}
                  </span>
                )}
              </div>

              {(program.date_debut || program.date_fin) && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Période de Déploiement
                  </span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {program.date_debut ? formatDate(program.date_debut) : "—"} au{" "}
                    {program.date_fin ? formatDate(program.date_fin) : "—"}
                  </span>
                </div>
              )}

              {program.beneficiaires_count !== undefined && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Bénéficiaires Accompagnés
                  </span>
                  <span className="font-bold text-base text-forest mt-0.5 block font-mono">
                    {program.beneficiaires_count} bénéficiaires
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Formulaire Modal */}
      <ProgrammeFormDialog
        program={program}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer ce programme d'action"
        description={`Êtes-vous certain de vouloir supprimer le programme « ${program.titre} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
