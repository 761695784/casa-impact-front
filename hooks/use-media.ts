"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  mediaService,
  type ListMediaParams,
} from "@/lib/services/media.service"
import type { Media } from "@/types/models"

export const MEDIA_QUERY_KEY = ["admin", "media"]

export function useMedia(params: ListMediaParams = {}) {
  return useQuery({
    queryKey: [...MEDIA_QUERY_KEY, params],
    queryFn: () => mediaService.listMedia(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useMediaItem(id: number | string) {
  return useQuery({
    queryKey: ["admin", "media-item", id],
    queryFn: () => mediaService.getMedia(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Media> }) =>
      mediaService.updateMedia(id, payload),
    onSuccess: (updated) => {
      toast.success("Média mis à jour avec succès", {
        description: updated.nom || updated.nom_fichier,
      })
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "media-item", updated.id],
      })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du média", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => mediaService.deleteMedia(id),
    onSuccess: () => {
      toast.success("Média supprimé de la médiathèque")
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression du média", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
