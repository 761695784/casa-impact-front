"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Sparkles,
  Edit,
  Trash2,
  Power,
  MapPin,
  Compass,
  Layers,
  ExternalLink,
  Globe,
  Calendar,
} from "lucide-react"
import {
  useTalent,
  useDeleteTalent,
  useUpdateTalent,
} from "@/hooks/use-talents"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { TalentFormDialog } from "@/components/admin/talents/talent-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"

export default function TalentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: talent, isLoading, isError, error, refetch } = useTalent(id)
  const deleteMutation = useDeleteTalent()
  const updateMutation = useUpdateTalent()

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

  if (isError || !talent) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/talents">
            <ArrowLeft className="size-4" />
            <span>Retour au Mur des talents</span>
          </Link>
        </Button>
        <ErrorState
          title="Talent introuvable"
          message={
            error instanceof Error
              ? error.message
              : "Ce profil de talent n'existe pas ou n'a pas pu être chargé."
          }
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(talent.id)
    router.push("/admin/talents")
  }

  const handleToggleStatus = async () => {
    const nextStatut = talent.statut === "archive" ? "publie" : "archive"
    await updateMutation.mutateAsync({
      id: talent.id,
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
            <Link href="/admin/talents">
              <ArrowLeft className="size-4" />
              <span>Retour à tous les talents</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href="/talents" target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir sur le Mur public</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary flex items-center justify-center font-bold text-forest font-display text-xl shadow-xs">
              {talent.photo ? (
                <Image
                  src={talent.photo}
                  alt={talent.nom}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span>{talent.nom.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {talent.region && (
                  <span className="rounded-md bg-forest/10 px-2.5 py-0.5 font-bold text-forest text-xs uppercase tracking-wider">
                    {REGION_LABELS[talent.region] || talent.region}
                  </span>
                )}
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                  Rang #{talent.ordre || talent.id}
                </span>
                <StatusBadge status={talent.statut} />
              </div>

              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {talent.nom}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-forest">
                {talent.domaine_activite} {talent.localisation ? `• ${talent.localisation}` : ""}
              </p>
            </div>
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
              <span>{talent.statut === "archive" ? "Publier" : "Archiver"}</span>
            </Button>

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
              <span>Modifier le profil</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Bio & Parcours */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Bio & Parcours */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Présentation
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Parcours & Réalisations
              </h2>
            </div>

            {talent.bio && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Synthèse
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium bg-secondary/30 rounded-2xl p-4 border border-border/50">
                  {talent.bio}
                </p>
              </div>
            )}

            {talent.parcours ? (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Récit Détaillé
                </h3>
                <div className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/20 rounded-2xl p-5 border border-border/40 space-y-4">
                  {talent.parcours}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Aucun parcours détaillé renseigné pour le moment.
              </p>
            )}

            {/* Liens externes */}
            {talent.liens && talent.liens.length > 0 && (
              <div className="pt-3 border-t border-border/40 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Liens & Références Web
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {talent.liens.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3.5 py-1 text-xs font-medium text-foreground hover:bg-forest/10 hover:text-forest transition-colors border border-border"
                    >
                      <Globe className="size-3.5" />
                      <span>{l.label}</span>
                      <ExternalLink className="size-2.5 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rattachements Casa Impact */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground border-b border-border/80 pb-3">
              Ancrage & Rattachement Institutionnel
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {talent.domaine && (
                <Link
                  href={`/admin/domaines/${talent.domaine.id}`}
                  className="rounded-2xl bg-secondary/30 p-4 border border-border/60 hover:bg-forest/5 hover:border-forest/30 transition-all flex items-start gap-3"
                >
                  <Layers className="size-5 text-forest mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Domaine d'Intervention
                    </span>
                    <span className="font-bold text-sm text-foreground block truncate mt-0.5">
                      {talent.domaine.nom}
                    </span>
                  </div>
                </Link>
              )}

              {talent.programme && (
                <Link
                  href={`/admin/programmes/${talent.programme.id}`}
                  className="rounded-2xl bg-secondary/30 p-4 border border-border/60 hover:bg-forest/5 hover:border-forest/30 transition-all flex items-start gap-3"
                >
                  <Compass className="size-5 text-forest mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Programme Rattaché
                    </span>
                    <span className="font-bold text-sm text-foreground block truncate mt-0.5">
                      {talent.programme.titre}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) : Fiche & Localisation */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Identité & Géographie */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Fiche du Champion
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Nom & Prénom
                </span>
                <span className="font-bold text-foreground mt-0.5 block text-sm">
                  {talent.nom}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Région Naturelle
                </span>
                <span className="font-semibold text-forest mt-0.5 block">
                  {talent.region ? REGION_LABELS[talent.region] : "Casamance"}
                </span>
              </div>

              {talent.localisation && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Commune / Ancrage
                  </span>
                  <span className="font-medium text-foreground mt-0.5 block flex items-center gap-1">
                    <MapPin className="size-3 text-muted-foreground" />
                    <span>{talent.localisation}</span>
                  </span>
                </div>
              )}

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Ordre d'Apparition
                </span>
                <span className="font-bold text-foreground mt-0.5 block">
                  Rang #{talent.ordre || talent.id}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Statut
                </span>
                <div className="mt-1">
                  <StatusBadge status={talent.statut} />
                </div>
              </div>

              {talent.updated_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Dernière Mise à Jour
                  </span>
                  <span className="font-medium text-muted-foreground mt-0.5 block">
                    {formatDate(talent.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Formulaire Modal */}
      <TalentFormDialog
        talent={talent}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Confirmation Statut */}
      <ConfirmDialog
        open={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        title={
          talent.statut === "archive"
            ? "Publier ce talent"
            : "Archiver ce talent"
        }
        description={
          talent.statut === "archive"
            ? `Êtes-vous sûr de vouloir publier le profil de « ${talent.nom} » ?`
            : `Êtes-vous sûr de vouloir archiver le profil de « ${talent.nom} » ? Il ne sera plus affiché sur le site public.`
        }
        confirmText={
          talent.statut === "archive"
            ? "Publier le talent"
            : "Archiver le talent"
        }
        variant={talent.statut === "archive" ? "default" : "warning"}
        isLoading={updateMutation.isPending}
        onConfirm={handleToggleStatus}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer ce talent"
        description={`Êtes-vous certain de vouloir supprimer le profil de « ${talent.nom} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
