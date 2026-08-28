"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  domainsService,
  type ListDomainsParams,
} from "@/lib/services/domains.service"
import type { Domain } from "@/types/models"

export const DOMAINS_QUERY_KEY = ["admin", "domains"]

export function useDomains(params: ListDomainsParams = {}) {
  return useQuery({
    queryKey: [...DOMAINS_QUERY_KEY, params],
    queryFn: () => domainsService.listDomains(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useDomain(id: number | string) {
  return useQuery({
    queryKey: ["admin", "domain", id],
    queryFn: () => domainsService.getDomain(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateDomain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<Domain>
    }) => domainsService.updateDomain(id, payload),
    onSuccess: (updated) => {
      toast.success("Domaine d'intervention mis à jour", {
        description: `${updated.nom} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: DOMAINS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "domain", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "domain", updated.slug] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur de mise à jour du domaine", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
