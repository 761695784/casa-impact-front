"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  partnersService,
  type ListPartnersParams,
} from "@/lib/services/partners.service"
import type { Partner } from "@/types/models"

export const PARTNERS_QUERY_KEY = ["admin", "partners"]

export function usePartners(params: ListPartnersParams = {}) {
  return useQuery({
    queryKey: [...PARTNERS_QUERY_KEY, params],
    queryFn: () => partnersService.listPartners(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePartner(id: number | string) {
  return useQuery({
    queryKey: ["admin", "partner", id],
    queryFn: () => partnersService.getPartner(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreatePartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<Partner, "id">) =>
      partnersService.createPartner(payload),
    onSuccess: (created) => {
      toast.success("Partenaire ajouté avec succès", {
        description: created.nom,
      })
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'ajout du partenaire", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdatePartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<Partner>
    }) => partnersService.updatePartner(id, payload),
    onSuccess: (updated) => {
      toast.success("Partenaire mis à jour", {
        description: `${updated.nom} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "partner", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du partenaire", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUploadPartnerLogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ partnerId, file }: { partnerId: number; file: File }) =>
      partnersService.uploadPartnerLogo(partnerId, file),
    onSuccess: (_media, variables) => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "partner", variables.partnerId] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'envoi du logo", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeletePartnerLogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mediaId: number) => partnersService.deletePartnerLogo(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression du logo", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeletePartner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => partnersService.deletePartner(id),
    onSuccess: () => {
      toast.success("Partenaire supprimé")
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression du partenaire", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
