"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  broadcastMessageService,
  type SendBroadcastMessagePayload,
} from "@/lib/services/broadcast-message.service"

/**
 * Envoi du message libre au format email Casa Impact — voir
 * broadcast-message.service.ts. Pas d'invalidation de cache : cet envoi ne
 * modifie aucune ressource lue ailleurs dans l'admin (ni ContactMessage, ni
 * Membership).
 */
export function useSendBroadcastMessage() {
  return useMutation({
    mutationFn: (payload: SendBroadcastMessagePayload) =>
      broadcastMessageService.send(payload),
    onSuccess: (result) => {
      toast.success("Message envoyé", {
        description:
          result.failed.length > 0
            ? `${result.sent} envoyé(s), ${result.failed.length} échec(s) : ${result.failed.join(", ")}`
            : result.message,
      })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'envoi du message", {
        description:
          err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
