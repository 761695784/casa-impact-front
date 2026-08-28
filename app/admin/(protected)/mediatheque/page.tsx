"use client"

import React, { useState, useMemo } from "react"
import { Image as ImageIcon, FileText, HardDrive, Layers } from "lucide-react"
import { MediaFilterBar } from "@/components/admin/media/media-filter-bar"
import { MediaGrid } from "@/components/admin/media/media-grid"
import { MediaPreviewDialog } from "@/components/admin/media/media-preview-dialog"
import { MediaEditDialog } from "@/components/admin/media/media-edit-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  useMedia,
  useUpdateMedia,
  useDeleteMedia,
} from "@/hooks/use-media"
import type { Media } from "@/types/models"

function formatTotalBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export default function AdminMediathequePage() {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [categorie, setCategorie] = useState("all")

  // Modals state
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null)
  const [editingMedia, setEditingMedia] = useState<Media | null>(null)
  const [deletingMedia, setDeletingMedia] = useState<Media | null>(null)

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMedia({ search, type, categorie })

  const updateMutation = useUpdateMedia()
  const deleteMutation = useDeleteMedia()

  const handleResetFilters = () => {
    setSearch("")
    setType("all")
    setCategorie("all")
  }

  // Summary counts
  const stats = useMemo(() => {
    const totalBytes = items.reduce((acc, m) => acc + (m.taille || 0), 0)
    return {
      total: items.length,
      images: items.filter((m) => m.type === "image").length,
      documents: items.filter((m) => m.type === "document").length,
      totalWeight: formatTotalBytes(totalBytes),
    }
  }, [items])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <ImageIcon className="size-3.5" />
            <span>Ressources & Visuels Officiels</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Médiathèque
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Gestion centralisée des photos, affiches de programmes, logos partenaires et documents téléchargeables.
          </p>
        </div>
      </div>

      {/* 2. KPI Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <ImageIcon className="size-4 text-forest" />
            <span>Total Médias</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {stats.total}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Layers className="size-4 text-emerald-600" />
            <span>Images & Visuels</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {stats.images}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <FileText className="size-4 text-blue-600" />
            <span>Documents PDF</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-blue-600">
            {stats.documents}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <HardDrive className="size-4 text-amber-600" />
            <span>Espace Utilisé</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600">
            {stats.totalWeight}
          </p>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <MediaFilterBar
        search={search}
        type={type}
        categorie={categorie}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onCategorieChange={setCategorie}
        onReset={handleResetFilters}
        totalCount={items.length}
      />

      {/* 4. Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-3 space-y-3"
            >
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement de la médiathèque"
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer les fichiers médias."
          }
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <ImageIcon className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun média trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || type !== "all" || categorie !== "all"
              ? "Aucun fichier ne correspond aux critères appliqués."
              : "La médiathèque ne contient aucun média pour le moment."}
          </p>
          {(search || type !== "all" || categorie !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="mt-4 rounded-full"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <MediaGrid
          items={items}
          onPreview={(m) => setPreviewMedia(m)}
          onEdit={(m) => setEditingMedia(m)}
          onDelete={(m) => setDeletingMedia(m)}
        />
      )}

      {/* Preview Dialog */}
      <MediaPreviewDialog
        media={previewMedia}
        open={!!previewMedia}
        onOpenChange={(open) => !open && setPreviewMedia(null)}
      />

      {/* Edit Dialog */}
      <MediaEditDialog
        media={editingMedia}
        open={!!editingMedia}
        onOpenChange={(open) => !open && setEditingMedia(null)}
        onSubmit={async (id, payload) => {
          await updateMutation.mutateAsync({ id, payload })
        }}
        loading={updateMutation.isPending}
      />

      {/* Deletion Dialog */}
      <ConfirmDialog
        open={!!deletingMedia}
        onOpenChange={(open) => !open && setDeletingMedia(null)}
        title="Supprimer ce média ?"
        description={`Confirmez-vous la suppression de ${deletingMedia?.nom || deletingMedia?.nom_fichier} ? Cette action retirera le fichier de la médiathèque.`}
        confirmText="Supprimer"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deletingMedia) {
            await deleteMutation.mutateAsync(deletingMedia.id)
            setDeletingMedia(null)
          }
        }}
      />
    </div>
  )
}
