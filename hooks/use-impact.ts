"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  impactService,
  type ListImpactIndicatorsParams,
} from "@/lib/services/impact.service"
import type { ImpactIndicator } from "@/types/models"

export const IMPACT_QUERY_KEY = ["admin", "impact"]

export function useImpactIndicators(params: ListImpactIndicatorsParams = {}) {
  return useQuery({
    queryKey: [...IMPACT_QUERY_KEY, params],
    queryFn: () => impactService.listImpactIndicators(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useImpactIndicator(id: number | string) {
  return useQuery({
    queryKey: ["admin", "impact-indicator", id],
    queryFn: () => impactService.getImpactIndicator(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateImpactIndicator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<ImpactIndicator, "id">) =>
      impactService.createImpactIndicator(payload),
    onSuccess: (created) => {
      toast.success("Indicateur d'impact créé avec succès", {
        description: created.libelle,
      })
      queryClient.invalidateQueries({ queryKey: IMPACT_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la création de l'indicateur", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateImpactIndicator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<ImpactIndicator>
    }) => impactService.updateImpactIndicator(id, payload),
    onSuccess: (updated) => {
      toast.success("Indicateur d'impact mis à jour", {
        description: updated.libelle,
      })
      queryClient.invalidateQueries({ queryKey: IMPACT_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "impact-indicator", updated.id],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour de l'indicateur", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteImpactIndicator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => impactService.deleteImpactIndicator(id),
    onSuccess: () => {
      toast.success("Indicateur d'impact supprimé")
      queryClient.invalidateQueries({ queryKey: IMPACT_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression de l'indicateur", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
