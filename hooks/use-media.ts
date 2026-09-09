"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  mediaService,
  type ListMediaParams,
  type CreateMediaParams,
  type AttachMediaParams,
  type DetachMediaParams,
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

export function useCreateMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateMediaParams) => mediaService.createMedia(params),
    onSuccess: (created) => {
      toast.success("Média ajouté avec succès à la médiathèque", {
        description: created.nom || created.nom_original,
      })
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'ajout du média", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<
        Pick<Media, "nom" | "alt" | "legende" | "categorie" | "statut">
      >
    }) => mediaService.updateMedia(id, payload),
    onSuccess: (updated) => {
      toast.success("Média mis à jour avec succès", {
        description: updated.nom || updated.nom_original,
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

/**
 * Rattache une photo de la bibliothèque à une fiche (ex. couverture ou
 * album d'une actualité). Silencieux par défaut (pas de toast) : utilisé
 * en série lors de l'enregistrement d'un formulaire, où une notification
 * globale de succès est déjà affichée pour l'ensemble de l'opération.
 */
export function useAttachMedia() {
  return useMutation({
    mutationFn: (params: AttachMediaParams) => mediaService.attachMedia(params),
  })
}

/** Détache une photo d'une fiche (elle reste dans la médiathèque). */
export function useDetachMedia() {
  return useMutation({
    mutationFn: (params: DetachMediaParams) => mediaService.detachMedia(params),
  })
}
