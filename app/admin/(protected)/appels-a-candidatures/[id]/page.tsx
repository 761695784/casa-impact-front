"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Megaphone,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Compass,
  FileCheck,
  FileText,
  Clock,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from "lucide-react"
import {
  useApplicationCall,
  useUpdateApplicationCall,
  useDeleteApplicationCall,
} from "@/hooks/use-application-calls"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { AppelFormDialog } from "@/components/admin/appels/appel-form-dialog"
import { AppelPreviewModal } from "@/components/admin/appels/appel-preview-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"

export default function AppelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false)

  const { data: call, isLoading, isError, error, refetch } = useApplicationCall(id)
  const updateMutation = useUpdateApplicationCall()
  const deleteMutation = useDeleteApplicationCall()

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

  if (isError || !call) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/appels-a-candidatures">
            <ArrowLeft className="size-4" />
            <span>Retour aux appels</span>
          </Link>
        </Button>
        <ErrorState
          title="Appel à candidatures introuvable"
          message={error instanceof Error ? error.message : "Cet appel n'existe pas ou a été supprimé."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(call.id)
    router.push("/admin/appels-a-candidatures")
  }

  const handleToggleStatus = async () => {
    const nextStatus = call.statut === "publie" ? "ferme" : "publie"
    await updateMutation.mutateAsync({
      id: call.id,
      payload: { statut: nextStatus },
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
            <Link href="/admin/appels-a-candidatures">
              <ArrowLeft className="size-4" />
              <span>Retour à tous les appels</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-full text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              <span>Supprimer</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={call.statut} />
              {call.programme && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                  <Compass className="size-3" />
                  <span>{call.programme.titre}</span>
                </span>
              )}
              {call.region && (
                <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                  {REGION_LABELS[call.region] || call.region}
                </span>
              )}
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {call.titre}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Identifiant slug : <span className="font-mono text-foreground font-medium">{call.slug}</span>
              {call.updated_at && (
                <span> • Dernière modification le {formatDate(call.updated_at)}</span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="rounded-full gap-1.5 border-border bg-card hover:bg-secondary text-xs"
            >
              <Eye className="size-3.5 text-forest" />
              <span>Prévisualisation</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsToggleStatusOpen(true)}
              className="rounded-full gap-1.5 text-xs font-medium"
            >
              {call.statut === "publie" ? "Clôturer l'appel" : "Publier l'appel"}
            </Button>

            <Button
              onClick={() => setIsEditOpen(true)}
              size="sm"
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5 shadow-xs"
            >
              <Edit className="size-3.5" />
              <span>Modifier l'appel</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Colonne Gauche (8 cols) : Description, Calendrier & Documents */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Présentation & Description */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Présentation de l'Opportunité
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Contexte & Objectifs
              </h2>
            </div>

            {call.resume && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Résumé accrocheur
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium bg-secondary/30 rounded-2xl p-4 border border-border/50">
                  {call.resume}
                </p>
              </div>
            )}

            {call.description && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description détaillée
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/20 rounded-2xl p-4 border border-border/40">
                  {call.description}
                </p>
              </div>
            )}
          </div>

          {/* Documents Requis pour les Candidats */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Dossier de Candidature
                </span>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                  Pièces demandées aux candidats
                </h2>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {call.documents_requis?.length || 0} document{call.documents_requis && call.documents_requis.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {call.documents_requis && call.documents_requis.length > 0 ? (
                call.documents_requis.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 transition-colors"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest mt-0.5">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {doc.libelle}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.requis
                              ? "bg-rose-500/10 text-rose-700"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {doc.requis ? "Obligatoire" : "Optionnel"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Formats : {doc.formats?.join(", ") || "Tous"} • Max {doc.taille_max || 5} Mo
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-xs text-muted-foreground">
                  Aucune pièce spécifique n'est exigée pour cet appel.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Colonne Droite (4 cols) : Calendrier, Places & Candidatures */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Suivi des Candidatures */}
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-card to-card p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Participation
              </span>
              <FileCheck className="size-5 text-sky-600" />
            </div>

            <div>
              <p className="font-display text-3xl font-bold text-foreground">
                {call.candidatures_count || 0}
              </p>
              <p className="text-xs font-semibold text-sky-900/80 mt-0.5">
                Candidatures enregistrées à ce jour
              </p>
            </div>

            <Button
              asChild
              className="w-full rounded-full bg-sky-700 text-white hover:bg-sky-800 text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Link href="/admin/candidatures">
                <FolderOpen className="size-3.5" />
                <span>Consulter les candidatures</span>
              </Link>
            </Button>
          </div>

          {/* Calendrier & Logistique */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Informations Pratiques
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Date Limite de Dépôt
                </span>
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                  <Calendar className="size-4 text-forest" />
                  <span>{call.date_limite ? formatDate(call.date_limite) : "Illimitée"}</span>
                </span>
              </div>

              {call.date_ouverture && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Ouverture des Inscriptions
                  </span>
                  <span className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{formatDate(call.date_ouverture)}</span>
                  </span>
                </div>
              )}

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Capacité de la Cohorte
                </span>
                <span className="font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                  <Users className="size-4 text-forest" />
                  <span>{call.nombre_places ? `${call.nombre_places} lauréats retenus` : "Non limité"}</span>
                </span>
              </div>

              {call.localisation && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Lieu & Territoire
                  </span>
                  <span className="font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="size-4 text-forest" />
                    <span>{call.localisation}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lien Public */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">
              Intégration Site Public
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cet appel alimente la page publique des opportunités et le formulaire de candidature en ligne.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
            >
              <Link href={`/opportunites/${call.slug}`} target="_blank">
                <ExternalLink className="size-3.5 text-forest" />
                <span>Ouvrir sur le site public</span>
              </Link>
            </Button>
          </div>

        </div>

      </div>

      {/* Formulaire Modal (Édition) */}
      <AppelFormDialog
        applicationCall={call}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Prévisualisation Modal */}
      <AppelPreviewModal
        applicationCall={call}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />

      {/* Confirmation Statut (Publier / Clôturer) */}
      <ConfirmDialog
        open={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        title={
          call.statut === "publie"
            ? "Clôturer cet appel à candidatures"
            : "Publier cet appel à candidatures"
        }
        description={
          call.statut === "publie"
            ? `Êtes-vous sûr de vouloir clôturer l'appel « ${call.titre} » ? Les candidats ne pourront plus soumettre de dossier.`
            : `Êtes-vous sûr de vouloir publier l'appel « ${call.titre} » ? Il sera immédiatement ouvert aux candidats sur le site public.`
        }
        confirmText={call.statut === "publie" ? "Clôturer l'appel" : "Publier l'appel"}
        variant={call.statut === "publie" ? "warning" : "default"}
        isLoading={updateMutation.isPending}
        onConfirm={handleToggleStatus}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer cet appel"
        description={`Êtes-vous sûr de vouloir supprimer définitivement l'appel « ${call.titre} » ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
