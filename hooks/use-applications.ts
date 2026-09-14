"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  applicationsService,
  type ListApplicationsParams,
  type ListApplicationHistoryParams,
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

/**
 * Envoi manuel de l'email contextuel du statut actuel (bouton dédié,
 * accord du 2026-09-14) — voir applicationsService.notifyApplication.
 */
export function useNotifyApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => applicationsService.notifyApplication(id),
    onSuccess: (updated) => {
      toast.success("Email envoyé avec succès", {
        description: `${updated.candidat_nom || updated.reference} a été notifié(e) par email.`,
      })
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "application", updated.id] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'envoi de l'email", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

/**
 * Nombre de candidatures en attente d'email pour leur statut actuel,
 * scopé à un appel si fourni (accord du 2026-09-14) — alimente le badge
 * du bouton "Envoyer les emails en attente" sur la page Candidatures.
 * `enabled` par défaut : toujours activé (peut être désactivé le temps
 * qu'un appel soit sélectionné, si un composant appelant le souhaite).
 */
export function usePendingNotificationsCount(
  applicationCallId?: number | "all" | string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["admin", "applications", "pending-notifications-count", applicationCallId ?? "all"],
    queryFn: () => applicationsService.getPendingNotificationsCount(applicationCallId),
    staleTime: 1000 * 15,
    enabled: options?.enabled ?? true,
  })
}

/**
 * Envoi GROUPÉ des emails en attente — "les séries d'emails par statut"
 * une fois que l'admin a fini de trancher chaque dossier (accord du
 * 2026-09-14). Invalide la liste des candidatures (les envois sont
 * journalisés côté serveur, `history` change), le compteur d'attente, et
 * l'historique.
 */
export function useNotifyPendingApplications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationCallId?: number | "all" | string) =>
      applicationsService.notifyPendingApplications(applicationCallId),
    onSuccess: (result) => {
      if (result.total === 0) {
        toast.info(result.message)
        return
      }
      toast.success("Emails envoyés avec succès", {
        description: `${result.total} candidat(s) notifié(s) : ${result.message}`,
      })
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: ["admin", "applications", "pending-notifications-count"],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "applications", "history"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'envoi groupé des emails", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

/**
 * Historique paginé (changements de statut + emails envoyés) pour la
 * page dédiée (accord du 2026-09-14 : "une page ou un export pour
 * l'historique persistant").
 */
export function useApplicationHistory(params: ListApplicationHistoryParams = {}) {
  return useQuery({
    queryKey: ["admin", "applications", "history", params],
    queryFn: () => applicationsService.listApplicationHistory(params),
    staleTime: 1000 * 30,
  })
}

/**
 * Export CSV de l'historique — pensé pour être partagé tel quel avec un
 * partenaire ("pour presenter les partenaires ce qui s'est fait").
 */
export function useExportApplicationHistory() {
  return useMutation({
    mutationFn: (params?: Omit<ListApplicationHistoryParams, "page" | "per_page">) =>
      applicationsService.exportApplicationHistory(params),
    onSuccess: () => {
      toast.success("Exportation de l'historique générée avec succès")
    },
    onError: (err: unknown) => {
      toast.error("Échec de l'exportation de l'historique", {
        description: err instanceof Error ? err.message : "Erreur lors de l'exportation.",
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
