"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { pagesService, type ListPagesParams } from "@/lib/services/pages.service"
import type { Page } from "@/types/models"

export const PAGES_QUERY_KEY = ["admin", "pages"]

export function usePages(params: ListPagesParams = {}) {
  return useQuery({
    queryKey: [...PAGES_QUERY_KEY, params],
    queryFn: () => pagesService.listPages(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePage(id: number | string) {
  return useQuery({
    queryKey: ["admin", "page", id],
    queryFn: () => pagesService.getPage(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreatePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<Page, "id">) => pagesService.createPage(payload),
    onSuccess: (created) => {
      toast.success("Page institutionnelle créée avec succès", {
        description: created.titre,
      })
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la création de la page", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdatePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<Page>
    }) => pagesService.updatePage(id, payload),
    onSuccess: (updated) => {
      toast.success("Page mise à jour", {
        description: `${updated.titre} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "page", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "page", updated.slug] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour de la page", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeletePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => pagesService.deletePage(id),
    onSuccess: () => {
      toast.success("Page supprimée")
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression de la page", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
