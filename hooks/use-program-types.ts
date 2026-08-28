"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  programTypesService,
  type ListProgramTypesParams,
} from "@/lib/services/program-types.service"
import type { ProgramType } from "@/types/models"

export const PROGRAM_TYPES_QUERY_KEY = ["admin", "program-types"]

export function useProgramTypes(params: ListProgramTypesParams = {}) {
  return useQuery({
    queryKey: [...PROGRAM_TYPES_QUERY_KEY, params],
    queryFn: () => programTypesService.listProgramTypes(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useProgramType(id: number | string) {
  return useQuery({
    queryKey: ["admin", "program-type", id],
    queryFn: () => programTypesService.getProgramType(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateProgramType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<ProgramType>
    }) => programTypesService.updateProgramType(id, payload),
    onSuccess: (updated) => {
      toast.success("Type de programme mis à jour", {
        description: `${updated.nom} (${updated.statut || "actif"})`,
      })
      queryClient.invalidateQueries({ queryKey: PROGRAM_TYPES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "program-type", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "programs"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du type de programme", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
