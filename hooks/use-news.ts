"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { newsService, type ListNewsParams } from "@/lib/services/news.service"
import type { News } from "@/types/models"

export const NEWS_QUERY_KEY = ["admin", "news"]

export function useNews(params: ListNewsParams = {}) {
  return useQuery({
    queryKey: [...NEWS_QUERY_KEY, params],
    queryFn: () => newsService.listNews(params),
    staleTime: 1000 * 30,
  })
}

export function useNewsItem(id: number | string) {
  return useQuery({
    queryKey: ["admin", "news-item", id],
    queryFn: () => newsService.getNewsItem(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
}

export function useCreateNews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<News, "id">) => newsService.createNews(payload),
    onSuccess: (created) => {
      toast.success("Actualité créée avec succès", {
        description: created.titre,
      })
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la création de l'article", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateNews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<News>
    }) => newsService.updateNews(id, payload),
    onSuccess: (updated) => {
      toast.success("Actualité mise à jour", {
        description: `${updated.titre} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "news-item", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "news-item", updated.slug] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour de l'article", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteNews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => newsService.deleteNews(id),
    onSuccess: () => {
      toast.success("Actualité supprimée")
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression de l'article", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
