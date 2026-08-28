"use client"

import React, { useState } from "react"
import { Plus, FileText } from "lucide-react"
import { usePages, useDeletePage } from "@/hooks/use-pages"
import { PagesFilterBar } from "@/components/admin/pages/pages-filter-bar"
import { PagesTable } from "@/components/admin/pages/pages-table"
import { PageFormDialog } from "@/components/admin/pages/page-form-dialog"
import { PagePreviewModal } from "@/components/admin/pages/page-preview-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Page } from "@/types/models"

export default function PagesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPageForEdit, setSelectedPageForEdit] = useState<Page | null>(null)
  const [selectedPageForPreview, setSelectedPageForPreview] = useState<Page | null>(null)
  const [selectedPageForDelete, setSelectedPageForDelete] = useState<Page | null>(null)

  const { data: pages = [], isLoading, isError, error, refetch } = usePages({
    search,
    statut,
  })

  const deleteMutation = useDeletePage()

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <FileText className="size-3.5" />
            <span>Contenus Institutionnels & Légal</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Pages Institutionnelles
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Administrez les pages de présentation, mentions légales, politiques de confidentialité et sections d'impact.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Nouvelle page</span>
        </Button>
      </div>

      {/* 2. Barre de Filtres */}
      <PagesFilterBar
        search={search}
        statut={statut}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
        onReset={handleResetFilters}
        totalCount={pages.length}
      />

      {/* 3. Contenu Principal */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2">
                <Skeleton className="h-6 w-56 rounded-lg" />
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement des pages"
          message={error instanceof Error ? error.message : "Impossible de récupérer les pages institutionnelles."}
          onRetry={() => refetch()}
        />
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <FileText className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucune page trouvée
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all"
              ? "Aucune page ne correspond à vos filtres actuels."
              : "Créez votre première page institutionnelle."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-5 rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
          >
            <Plus className="size-4" />
            <span>Créer une page</span>
          </Button>
        </div>
      ) : (
        <PagesTable
          pages={pages}
          onEdit={(p) => setSelectedPageForEdit(p)}
          onPreview={(p) => setSelectedPageForPreview(p)}
          onDelete={(p) => setSelectedPageForDelete(p)}
        />
      )}

      {/* 4. Formulaire Modal */}
      <PageFormDialog
        page={selectedPageForEdit}
        open={isCreateOpen || !!selectedPageForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedPageForEdit(null)
          }
        }}
      />

      {/* 5. Prévisualisation */}
      <PagePreviewModal
        page={selectedPageForPreview}
        open={!!selectedPageForPreview}
        onOpenChange={(open) => !open && setSelectedPageForPreview(null)}
      />

      {/* 6. Confirmation Suppression */}
      <ConfirmDialog
        open={!!selectedPageForDelete}
        onOpenChange={(open) => !open && setSelectedPageForDelete(null)}
        title="Supprimer cette page"
        description={`Êtes-vous certain de vouloir supprimer la page « ${selectedPageForDelete?.titre} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedPageForDelete) {
            await deleteMutation.mutateAsync(selectedPageForDelete.id)
          }
        }}
      />

    </div>
  )
}
