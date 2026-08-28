"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  membershipsService,
  type ListMembershipsParams,
} from "@/lib/services/memberships.service"
import type { Membership } from "@/types/models"

export const MEMBERSHIPS_QUERY_KEY = ["admin", "memberships"]

export function useMemberships(params: ListMembershipsParams = {}) {
  return useQuery({
    queryKey: [...MEMBERSHIPS_QUERY_KEY, params],
    queryFn: () => membershipsService.listMemberships(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useMembership(id: number | string) {
  return useQuery({
    queryKey: ["admin", "membership", id],
    queryFn: () => membershipsService.getMembership(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<Membership>
    }) => membershipsService.updateMembership(id, payload),
    onSuccess: (updated) => {
      toast.success("Adhésion mise à jour", {
        description: `${updated.nom_complet} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "membership", updated.id],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour de l'adhésion", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useValidateMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => membershipsService.validateMembership(id),
    onSuccess: (validated) => {
      toast.success("Adhésion validée avec succès", {
        description: `La carte de membre de ${validated.nom_complet} est active.`,
      })
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "membership", validated.id],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la validation", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useRejectMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => membershipsService.rejectMembership(id),
    onSuccess: (rejected) => {
      toast.info("Adhésion refusée", {
        description: `Demande de ${rejected.nom_complet} classée sans suite.`,
      })
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "membership", rejected.id],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors du refus de l'adhésion", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => membershipsService.deleteMembership(id),
    onSuccess: () => {
      toast.success("Demande d'adhésion supprimée")
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression de l'adhésion", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
