"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Globe,
} from "lucide-react"
import { usePage, useDeletePage, useUpdatePage } from "@/hooks/use-pages"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { PageFormDialog } from "@/components/admin/pages/page-form-dialog"
import { PagePreviewModal } from "@/components/admin/pages/page-preview-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { PAGE_STATUS_LABELS } from "@/types/enums"
import type { PageStatus } from "@/types/enums"

export default function PageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: page, isLoading, isError, error, refetch } = usePage(id)
  const deleteMutation = useDeletePage()
  const updateMutation = useUpdatePage()

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

  if (isError || !page) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/pages">
            <ArrowLeft className="size-4" />
            <span>Retour aux pages institutionnelles</span>
          </Link>
        </Button>
        <ErrorState
          title="Page introuvable"
          message={error instanceof Error ? error.message : "Cette page n'existe pas ou n'a pas pu être chargée."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(page.id)
    router.push("/admin/pages")
  }

  const handleStatusChange = async (nextStatut: PageStatus) => {
    await updateMutation.mutateAsync({
      id: page.id,
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
            <Link href="/admin/pages">
              <ArrowLeft className="size-4" />
              <span>Retour à toutes les pages</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href={`/${page.slug}`} target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir la page publique</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                /{page.slug}
              </span>
              <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-md">
                Rang #{page.ordre || page.id}
              </span>
              <StatusBadge status={page.statut} />
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {page.titre}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Page de présentation institutionnelle de Casa Impact.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="rounded-full gap-1.5 text-xs text-primary font-medium"
            >
              <Eye className="size-3.5" />
              <span>Prévisualiser</span>
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
              <span>Modifier la page</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Contenu Rédigé */}
        <div className="space-y-8 lg:col-span-8">
          
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Contenu Institutionnel
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Corps de la Page
              </h2>
            </div>

            {page.resume && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Résumé / Chapeau
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium bg-secondary/30 rounded-2xl p-4 border border-border/50 italic">
                  {page.resume}
                </p>
              </div>
            )}

            {page.contenu ? (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Texte Intégral
                </h3>
                <div className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/20 rounded-2xl p-5 border border-border/40 space-y-4">
                  {page.contenu}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Aucun contenu saisi pour cette page.
              </p>
            )}
          </div>

        </div>

        {/* Right Column (4 cols) : Métadonnées */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Informations Techniques */}
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
                  Rang n°{page.ordre || page.id}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Statut
                </span>
                <div className="mt-1">
                  <StatusBadge status={page.statut} />
                </div>
              </div>

              {page.meta_description && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Meta Description (SEO)
                  </span>
                  <p className="text-xs text-foreground/80 mt-1 bg-secondary/30 p-2.5 rounded-xl border border-border/40">
                    {page.meta_description}
                  </p>
                </div>
              )}

              {page.updated_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Dernière Modification
                  </span>
                  <span className="font-medium text-muted-foreground mt-0.5 block">
                    {formatDate(page.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Statut */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Statut de Publication
            </h3>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Statut actuel : <strong>{PAGE_STATUS_LABELS[page.statut] || page.statut}</strong>
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {page.statut !== "publie" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange("publie")}
                    disabled={updateMutation.isPending}
                    className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Publier la page
                  </Button>
                )}

                {page.statut === "publie" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("archive")}
                    disabled={updateMutation.isPending}
                    className="flex-1 rounded-full text-xs font-medium"
                  >
                    Archiver
                  </Button>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Formulaire Modal */}
      <PageFormDialog
        page={page}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Prévisualisation */}
      <PagePreviewModal
        page={page}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer cette page"
        description={`Êtes-vous certain de vouloir supprimer la page « ${page.titre} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
