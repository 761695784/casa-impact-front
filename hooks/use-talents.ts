"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  talentsService,
  type ListTalentsParams,
} from "@/lib/services/talents.service"
import type { Talent } from "@/types/models"

export const TALENTS_QUERY_KEY = ["admin", "talents"]

export function useTalents(params: ListTalentsParams = {}) {
  return useQuery({
    queryKey: [...TALENTS_QUERY_KEY, params],
    queryFn: () => talentsService.listTalents(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useTalent(id: number | string) {
  return useQuery({
    queryKey: ["admin", "talent", id],
    queryFn: () => talentsService.getTalent(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTalent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<Talent, "id">) =>
      talentsService.createTalent(payload),
    onSuccess: (created) => {
      toast.success("Profil de talent créé avec succès", {
        description: created.nom,
      })
      queryClient.invalidateQueries({ queryKey: TALENTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la création du talent", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateTalent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<Talent>
    }) => talentsService.updateTalent(id, payload),
    onSuccess: (updated) => {
      toast.success("Profil de talent mis à jour", {
        description: `${updated.nom} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: TALENTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "talent", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "talent", updated.slug] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du talent", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteTalent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => talentsService.deleteTalent(id),
    onSuccess: () => {
      toast.success("Profil de talent supprimé")
      queryClient.invalidateQueries({ queryKey: TALENTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression du talent", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
