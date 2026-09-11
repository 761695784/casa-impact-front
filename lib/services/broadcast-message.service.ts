import { apiFetch } from "@/lib/api-client"
import { DATA_SOURCE } from "@/lib/config"

export interface SendBroadcastMessagePayload {
  subject: string
  message: string
  /** Adresses email des destinataires — membres sélectionnés + adresses libres, déjà fusionnées et dédupliquées côté formulaire. */
  recipients: string[]
}

export interface SendBroadcastMessageResult {
  message: string
  sent: number
  failed: string[]
}

function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/**
 * Envoi d'un message libre depuis la partie admin (section Messages, bouton
 * "Envoyer un message" — accord du 2026-09-11) à un ou plusieurs
 * destinataires (membres choisis et/ou adresses tapées librement), au
 * format email officiel Casa Impact (logo, filigrane, couleurs, signature —
 * même habillage que les emails MembershipReceived/MembershipValidated,
 * réutilisé via le layout `emails.layout` côté serveur). Aucune donnée
 * n'est persistée en base : c'est un envoi direct, pas un nouveau
 * ContactMessage.
 * Endpoint : POST /api/admin/messages/send
 */
export const broadcastMessageService = {
  send: async (
    payload: SendBroadcastMessagePayload
  ): Promise<SendBroadcastMessageResult> => {
    if (DATA_SOURCE === "mock") {
      return delay<SendBroadcastMessageResult>({
        message: `Message envoyé à ${payload.recipients.length} destinataire(s).`,
        sent: payload.recipients.length,
        failed: [],
      })
    }

    return apiFetch<SendBroadcastMessageResult>("/api/admin/messages/send", {
      method: "POST",
      body: payload,
    })
  },
}
