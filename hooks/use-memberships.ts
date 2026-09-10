"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  membershipsService,
  type ListMembershipsParams,
} from "@/lib/services/memberships.service"
import type { Membership } from "@/types/models"
import type { MembershipStatus } from "@/types/enums"

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
      payload: { statut?: MembershipStatus | string; admin_note?: string }
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

/**
 * Valider = passer `statut` à `validee` via update() — déclenche côté
 * serveur la génération de la carte + l'envoi de l'email
 * MembershipValidated (voir memberships.service.ts, il n'existe pas de
 * route /validate dédiée).
 */
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

/**
 * Téléchargement de la carte de membre PDF (GET .../card) — déclenche le
 * téléchargement navigateur directement depuis membershipsService.downloadCard
 * (voir ce service : la réponse est un PDF binaire, pas du JSON, donc pas de
 * données à mettre en cache côté React Query ici).
 */
export function useDownloadMembershipCard() {
  return useMutation({
    mutationFn: ({ id, numeroMembre }: { id: number; numeroMembre?: string }) =>
      membershipsService.downloadCard(id, numeroMembre),
    onError: (err: unknown) => {
      toast.error("Impossible de télécharger la carte de membre", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
