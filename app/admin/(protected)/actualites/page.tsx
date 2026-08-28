"use client"

import React, { useState } from "react"
import { Plus, Newspaper } from "lucide-react"
import { useNews, useDeleteNews } from "@/hooks/use-news"
import { ActualitesFilterBar } from "@/components/admin/actualites/actualites-filter-bar"
import { ActualitesTable } from "@/components/admin/actualites/actualites-table"
import { ActualitesMobileList } from "@/components/admin/actualites/actualites-mobile-list"
import { ActualiteFormDialog } from "@/components/admin/actualites/actualite-form-dialog"
import { ActualitePreviewModal } from "@/components/admin/actualites/actualite-preview-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { PaginationBar } from "@/components/admin/ui/pagination-bar"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { News } from "@/types/models"

export default function ActualitesListPage() {
  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)
  const perPage = 8

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedNewsForEdit, setSelectedNewsForEdit] = useState<News | null>(null)
  const [selectedNewsForPreview, setSelectedNewsForPreview] = useState<News | null>(null)
  const [selectedNewsForDelete, setSelectedNewsForDelete] = useState<News | null>(null)

  const { data, isLoading, isError, error, refetch } = useNews({
    search,
    statut,
    type,
    page,
    per_page: perPage,
  })

  const deleteMutation = useDeleteNews()

  const newsList = data?.data || []
  const meta = data?.meta

  const handleResetFilters = () => {
    setSearch("")
    setStatut("all")
    setType("all")
    setPage(1)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Newspaper className="size-3.5" />
            <span>Espace Éditorial & Publications</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Actualités & Médias
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Rédigez, validez et publiez les annonces officielles, reportages et communiqués de Casa Impact.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Nouvel article</span>
        </Button>
      </div>

      {/* 2. Barre de Filtres */}
      <ActualitesFilterBar
        search={search}
        statut={statut}
        type={type}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onStatutChange={(val) => {
          setStatut(val)
          setPage(1)
        }}
        onTypeChange={(val) => {
          setType(val)
          setPage(1)
        }}
        onReset={handleResetFilters}
        totalCount={meta?.total}
      />

      {/* 3. Contenu Principal */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2">
                <Skeleton className="h-6 w-56 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Erreur lors du chargement des actualités"
          message={error instanceof Error ? error.message : "Impossible de récupérer les articles."}
          onRetry={() => refetch()}
        />
      ) : newsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Newspaper className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun article trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || statut !== "all" || type !== "all"
              ? "Aucune publication ne correspond à vos filtres actuels."
              : "Commencez par rédiger la première actualité de Casa Impact."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="mt-5 rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5"
          >
            <Plus className="size-4" />
            <span>Rédiger un article</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Desktop Table */}
          <div className="hidden md:block">
            <ActualitesTable
              newsList={newsList}
              onEdit={(item) => setSelectedNewsForEdit(item)}
              onPreview={(item) => setSelectedNewsForPreview(item)}
              onDelete={(item) => setSelectedNewsForDelete(item)}
            />
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden">
            <ActualitesMobileList
              newsList={newsList}
              onEdit={(item) => setSelectedNewsForEdit(item)}
              onPreview={(item) => setSelectedNewsForPreview(item)}
              onDelete={(item) => setSelectedNewsForDelete(item)}
            />
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="pt-2">
              <PaginationBar
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                total={meta.total}
                perPage={meta.per_page}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}

        </div>
      )}

      {/* 4. Formulaire Modal (Création / Modification) */}
      <ActualiteFormDialog
        news={selectedNewsForEdit}
        open={isCreateOpen || !!selectedNewsForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedNewsForEdit(null)
          }
        }}
      />

      {/* 5. Prévisualisation Fidèle */}
      <ActualitePreviewModal
        news={selectedNewsForPreview}
        open={!!selectedNewsForPreview}
        onOpenChange={(open) => !open && setSelectedNewsForPreview(null)}
      />

      {/* 6. Confirmation de Suppression */}
      <ConfirmDialog
        open={!!selectedNewsForDelete}
        onOpenChange={(open) => !open && setSelectedNewsForDelete(null)}
        title="Supprimer cette publication"
        description={`Êtes-vous certain de vouloir supprimer définitivement l'article « ${selectedNewsForDelete?.titre} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (selectedNewsForDelete) {
            await deleteMutation.mutateAsync(selectedNewsForDelete.id)
          }
        }}
      />

    </div>
  )
}
