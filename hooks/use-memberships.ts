"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  membershipsService,
  type ListMembershipsParams,
  type CreateMembershipPayload,
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

export interface MembershipStatsCounts {
  total: number
  validees: number
  enAttente: number
  refusees: number
}

/**
 * Compteurs globaux affichés en haut de la page Adhésions (Total Demandes /
 * Membres Validés / En attente / Refusées) — INDÉPENDANTS de la recherche
 * ou de la page courante, et lus directement sur `meta.total` du serveur
 * (fiable quel que soit le nombre réel de lignes), pas en comptant un
 * tableau de résultats plafonné à `per_page`. Corrige le bug du
 * 2026-09-11 : ces compteurs étaient auparavant calculés en comptant
 * `memberships` (la page affichée, limitée à 100 puis 20 lignes) — d'où un
 * "Total Demandes: 100" affiché alors que la base contenait réellement 171
 * membres après l'import historique. `per_page: 1` sur chaque requête :
 * seul `meta.total` nous intéresse, pas les lignes elles-mêmes.
 */
export function useMembershipStats() {
  return useQuery({
    queryKey: [...MEMBERSHIPS_QUERY_KEY, "stats"],
    queryFn: async (): Promise<MembershipStatsCounts> => {
      const [all, validees, enAttente, refusees] = await Promise.all([
        membershipsService.listMemberships({ statut: "all", per_page: 1 }),
        membershipsService.listMemberships({ statut: "validee", per_page: 1 }),
        membershipsService.listMemberships({ statut: "en_attente_paiement", per_page: 1 }),
        membershipsService.listMemberships({ statut: "refusee", per_page: 1 }),
      ])

      return {
        total: all.meta.total,
        validees: validees.meta.total,
        enAttente: enAttente.meta.total,
        refusees: refusees.meta.total,
      }
    },
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

/**
 * Ajout manuel d'un membre (historique, antérieur au site) depuis le
 * panneau admin — voir MembershipFormDialog. Conserve l'ID existant si
 * fourni (accord du 2026-09-11).
 */
export function useCreateMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMembershipPayload) =>
      membershipsService.createMembership(payload),
    onSuccess: (created) => {
      toast.success("Membre ajouté avec succès", {
        description: `${created.nom_complet} (${created.numero_membre}) a été enregistré.`,
      })
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'ajout du membre", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

/**
 * Aperçu de l'import historique (Excel) — n'écrit rien en base, renvoie un
 * résumé chiffré + un `import_token` à repasser à useCommitLegacyImport()
 * ou useCancelLegacyImport(). Pas d'invalidation de cache ici : rien n'a
 * changé côté serveur tant que l'aperçu n'est pas confirmé.
 */
export function usePreviewLegacyImport() {
  return useMutation({
    mutationFn: (file: File) => membershipsService.previewLegacyImport(file),
    onError: (err: unknown) => {
      toast.error("Impossible d'analyser le fichier", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

/**
 * Confirme l'import après aperçu (voir usePreviewLegacyImport). Invalide la
 * liste des adhésions et le dashboard, comme useCreateMembership.
 */
export function useCommitLegacyImport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (importToken: string) => membershipsService.commitLegacyImport(importToken),
    onSuccess: (result) => {
      if (result.created > 0) {
        toast.success(`${result.created} membre(s) importé(s) avec succès`)
      }
      if (result.failed.length > 0) {
        toast.error(`${result.failed.length} ligne(s) en échec`, {
          description: result.failed[0],
        })
      }
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'import", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

/** Annule un aperçu sans le confirmer — supprime le fichier temporaire côté serveur. */
export function useCancelLegacyImport() {
  return useMutation({
    mutationFn: (importToken: string) => membershipsService.cancelLegacyImport(importToken),
  })
}

/**
 * Ajoute/remplace la photo d'un membre existant — pensé pour compléter les
 * membres importés depuis l'historique Excel (créés sans photo, accord du
 * 2026-09-11).
 */
export function useUpdateMembershipPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, photo }: { id: number; photo: File }) =>
      membershipsService.updateMembershipPhoto(id, photo),
    onSuccess: (updated) => {
      toast.success("Photo mise à jour", {
        description: `${updated.nom_complet} a maintenant une photo à jour.`,
      })
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "membership", updated.id] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour de la photo", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
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
