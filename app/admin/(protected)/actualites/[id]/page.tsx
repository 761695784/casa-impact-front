"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Newspaper,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  User,
  Sparkles,
  BarChart2,
} from "lucide-react"
import { useNewsItem, useDeleteNews, useUpdateNews } from "@/hooks/use-news"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { ActualiteFormDialog } from "@/components/admin/actualites/actualite-form-dialog"
import { ActualitePreviewModal } from "@/components/admin/actualites/actualite-preview-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { NEWS_TYPE_LABELS, NEWS_STATUS_LABELS } from "@/types/enums"
import type { NewsStatus } from "@/types/enums"

export default function ActualiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: news, isLoading, isError, error, refetch } = useNewsItem(id)
  const deleteMutation = useDeleteNews()
  const updateMutation = useUpdateNews()

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

  if (isError || !news) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/actualites">
            <ArrowLeft className="size-4" />
            <span>Retour aux actualités</span>
          </Link>
        </Button>
        <ErrorState
          title="Publication introuvable"
          message={error instanceof Error ? error.message : "Cet article n'existe pas ou n'a pas pu être chargé."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(news.id)
    router.push("/admin/actualites")
  }

  const handleStatusChange = async (nextStatut: NewsStatus) => {
    await updateMutation.mutateAsync({
      id: news.id,
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
            <Link href="/admin/actualites">
              <ArrowLeft className="size-4" />
              <span>Retour à toutes les publications</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href={`/actualites/${news.slug}`} target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir la page publique</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-forest/10 px-2.5 py-0.5 font-bold text-forest text-xs uppercase tracking-wider">
                {NEWS_TYPE_LABELS[news.type] || news.type}
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                /{news.slug}
              </span>
              {news.a_la_une && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 font-semibold text-foreground text-[10px]">
                  <Sparkles className="size-3 text-accent" />
                  <span>À la une</span>
                </span>
              )}
              <StatusBadge status={news.statut} />
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {news.titre}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Publication éditoriale officielle de Casa Impact.
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
              <span>Modifier l'article</span>
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
                Contenu Rédigé
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Corps de la Publication
              </h2>
            </div>

            {news.extrait && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Extrait / Chapeau
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium bg-secondary/30 rounded-2xl p-4 border border-border/50 italic">
                  {news.extrait}
                </p>
              </div>
            )}

            {news.contenu ? (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Texte Intégral
                </h3>
                <div className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/20 rounded-2xl p-5 border border-border/40 space-y-4">
                  {news.contenu}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Aucun contenu détaillé n'a encore été saisi pour cette publication.
              </p>
            )}
          </div>

        </div>

        {/* Right Column (4 cols) : Métadonnées Éditoriales */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Fiche Technique */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Informations Éditoriales
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Catégorie
                </span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">
                  {NEWS_TYPE_LABELS[news.type] || news.type}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Auteur / Pôle Émetteur
                </span>
                <span className="font-medium text-foreground mt-0.5 block">
                  {news.auteur || "Coordination Casa Impact"}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Date de Publication
                </span>
                <span className="font-medium text-foreground mt-0.5 block">
                  {news.date_publication ? formatDate(news.date_publication) : "Non publiée"}
                </span>
              </div>

              {news.vues_count !== undefined && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Audience & Lectures
                  </span>
                  <span className="font-bold text-base text-forest mt-0.5 block font-mono">
                    {news.vues_count} vue{news.vues_count > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {news.updated_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Dernière Modification
                  </span>
                  <span className="font-medium text-muted-foreground mt-0.5 block">
                    {formatDate(news.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Workflow de Statut */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Statut Éditorial
            </h3>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Statut actuel : <strong>{NEWS_STATUS_LABELS[news.statut] || news.statut}</strong>
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {news.statut !== "publie" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange("publie")}
                    disabled={updateMutation.isPending}
                    className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Publier l'article
                  </Button>
                )}

                {news.statut === "publie" && (
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
      <ActualiteFormDialog
        news={news}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Prévisualisation */}
      <ActualitePreviewModal
        news={news}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer cette publication"
        description={`Êtes-vous certain de vouloir supprimer l'article « ${news.titre} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
