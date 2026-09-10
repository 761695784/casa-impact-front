"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  applicationsService,
  type ListApplicationsParams,
} from "@/lib/services/applications.service"
import type { ApplicationStatus } from "@/types/enums"

export const APPLICATIONS_QUERY_KEY = ["admin", "applications"]

export function useApplications(params: ListApplicationsParams = {}) {
  return useQuery({
    queryKey: [...APPLICATIONS_QUERY_KEY, params],
    queryFn: () => applicationsService.listApplications(params),
    staleTime: 1000 * 30, // 30 secondes
  })
}

export function useApplication(id: number) {
  return useQuery({
    queryKey: ["admin", "application", id],
    queryFn: () => applicationsService.getApplication(id),
    enabled: !isNaN(id) && id > 0,
    staleTime: 1000 * 30,
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      statut,
      notes_internes,
    }: {
      id: number
      statut: ApplicationStatus
      notes_internes?: string
    }) => applicationsService.updateApplicationStatus(id, { statut, notes_internes }),
    onSuccess: (updated) => {
      toast.success("Statut de la candidature mis à jour avec succès", {
        description: `Référence ${updated.reference} → ${updated.statut}`,
      })
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "application", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du statut", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function usePromoteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => applicationsService.promoteApplication(id),
    onSuccess: (updated) => {
      toast.success("Candidature promue avec succès !", {
        description: `${updated.candidat_nom || updated.reference} est désormais promu.`,
      })
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "application", updated.id] })
    },
    onError: (err: unknown) => {
      toast.error("Échec de la promotion", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => applicationsService.deleteApplication(id),
    onSuccess: () => {
      toast.success("Candidature supprimée avec succès")
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur de suppression", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDownloadApplicationDocument() {
  return useMutation({
    mutationFn: ({
      applicationId,
      documentKey,
      filename,
    }: {
      applicationId: number
      documentKey: string
      filename?: string
    }) => applicationsService.downloadDocument(applicationId, documentKey, filename),
    onSuccess: () => {
      toast.success("Téléchargement du document lancé")
    },
    onError: (err: unknown) => {
      toast.error("Impossible de télécharger le document", {
        description: err instanceof Error ? err.message : "Erreur de téléchargement.",
      })
    },
  })
}

/**
 * Aperçu en ligne d'un document (sans déclencher de téléchargement) —
 * utilisé par `DocumentPreviewModal`. Pas de toast de succès (la modale
 * affiche elle-même le résultat) ; en revanche l'échec est bien signalé.
 */
export function usePreviewApplicationDocument() {
  return useMutation({
    mutationFn: ({
      applicationId,
      documentKey,
    }: {
      applicationId: number
      documentKey: string
    }) => applicationsService.previewDocument(applicationId, documentKey),
    onError: (err: unknown) => {
      toast.error("Impossible de charger l'aperçu du document", {
        description: err instanceof Error ? err.message : "Erreur de chargement.",
      })
    },
  })
}

export function useExportApplications() {
  return useMutation({
    mutationFn: (params?: Omit<ListApplicationsParams, "page" | "per_page">) =>
      applicationsService.exportApplications(params),
    onSuccess: () => {
      toast.success("Exportation des candidatures générée avec succès")
    },
    onError: (err: unknown) => {
      toast.error("Échec de l'exportation", {
        description: err instanceof Error ? err.message : "Erreur lors de l'exportation.",
      })
    },
  })
}
