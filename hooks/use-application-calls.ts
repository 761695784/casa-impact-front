"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  applicationCallsService,
  type ListApplicationCallsParams,
} from "@/lib/services/application-calls.service"
import type { ApplicationCall } from "@/types/models"

export const APPLICATION_CALLS_QUERY_KEY = ["admin", "application-calls"]

export function useApplicationCalls(params: ListApplicationCallsParams = {}) {
  return useQuery({
    queryKey: [...APPLICATION_CALLS_QUERY_KEY, params],
    queryFn: () => applicationCallsService.listApplicationCalls(params),
    staleTime: 1000 * 30,
  })
}

export function useApplicationCall(id: number) {
  return useQuery({
    queryKey: ["admin", "application-call", id],
    queryFn: () => applicationCallsService.getApplicationCall(id),
    enabled: !isNaN(id) && id > 0,
    staleTime: 1000 * 30,
  })
}

export function useCreateApplicationCall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<ApplicationCall, "id">) =>
      applicationCallsService.createApplicationCall(payload),
    onSuccess: (created) => {
      toast.success("Appel à candidatures créé avec succès", {
        description: created.titre,
      })
      queryClient.invalidateQueries({ queryKey: APPLICATION_CALLS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la création de l'appel", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateApplicationCall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<ApplicationCall>
    }) => applicationCallsService.updateApplicationCall(id, payload),
    onSuccess: (updated) => {
      toast.success("Appel à candidatures mis à jour", {
        description: `${updated.titre} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: APPLICATION_CALLS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "application-call", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur de mise à jour", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteApplicationCall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => applicationCallsService.deleteApplicationCall(id),
    onSuccess: () => {
      toast.success("Appel à candidatures supprimé")
      queryClient.invalidateQueries({ queryKey: APPLICATION_CALLS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur de suppression", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useExportApplicationCalls() {
  return useMutation({
    mutationFn: (params?: Omit<ListApplicationCallsParams, "page" | "per_page">) =>
      applicationCallsService.exportApplicationCalls(params),
    onSuccess: () => {
      toast.success("Exportation des appels générée avec succès")
    },
    onError: (err: unknown) => {
      toast.error("Échec de l'exportation", {
        description: err instanceof Error ? err.message : "Erreur lors de l'exportation.",
      })
    },
  })
}
