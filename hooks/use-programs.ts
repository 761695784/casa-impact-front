"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  programsService,
  type ListProgramsParams,
} from "@/lib/services/programs.service"
import type { Program } from "@/types/models"

export const PROGRAMS_QUERY_KEY = ["admin", "programs"]

export function usePrograms(params: ListProgramsParams = {}) {
  return useQuery({
    queryKey: [...PROGRAMS_QUERY_KEY, params],
    queryFn: () => programsService.listPrograms(params),
    staleTime: 1000 * 30,
  })
}

export function useProgram(id: number | string) {
  return useQuery({
    queryKey: ["admin", "program", id],
    queryFn: () => programsService.getProgram(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  })
}

export function useCreateProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<Program, "id">) =>
      programsService.createProgram(payload),
    onSuccess: (created) => {
      toast.success("Programme créé avec succès", {
        description: created.titre,
      })
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "domains"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la création du programme", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<Program>
    }) => programsService.updateProgram(id, payload),
    onSuccess: (updated) => {
      toast.success("Programme mis à jour", {
        description: `${updated.titre} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "program", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "program", updated.slug] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du programme", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => programsService.deleteProgram(id),
    onSuccess: () => {
      toast.success("Programme supprimé")
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur de suppression du programme", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useExportPrograms() {
  return useMutation({
    mutationFn: (params?: Omit<ListProgramsParams, "page" | "per_page">) =>
      programsService.exportPrograms(params),
    onSuccess: () => {
      toast.success("Exportation des programmes générée avec succès")
    },
    onError: (err: unknown) => {
      toast.error("Échec de l'exportation", {
        description: err instanceof Error ? err.message : "Erreur lors de l'exportation.",
      })
    },
  })
}
