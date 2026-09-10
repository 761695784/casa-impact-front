import { apiFetch } from "@/lib/api-client"
import type { ContactCategory } from "@/types/enums"

/**
 * Payload de soumission publique du formulaire de contact.
 * Endpoint : POST /api/public/contact (aucune authentification, throttle
 * 10/min — voir App\Http\Requests\Public\StoreContactMessageRequest).
 * `categorie`/`nom`/`email`/`message` sont obligatoires côté backend,
 * `telephone`/`sujet` sont nullable.
 *
 * Le backend déclenche automatiquement une réponse brandée (logo +
 * signature Casa Impact) à l'adresse `email` fournie — voir
 * App\Notifications\ContactMessageReceived (livraison du 2026-08-24,
 * déjà installée côté serveur). Aucune notification email supplémentaire
 * n'est envoyée à l'équipe : les nouveaux messages apparaissent dans
 * /admin/messages comme aujourd'hui.
 */
export interface SubmitContactMessagePayload {
  categorie: ContactCategory
  nom: string
  email: string
  telephone?: string
  sujet?: string
  message: string
}

export const publicContactService = {
  submitContactMessage: async (
    payload: SubmitContactMessagePayload
  ): Promise<{ message: string }> => {
    const body: Record<string, unknown> = {
      categorie: payload.categorie,
      nom: payload.nom,
      email: payload.email,
      message: payload.message,
    }
    if (payload.telephone) body.telephone = payload.telephone
    if (payload.sujet) body.sujet = payload.sujet

    return apiFetch<{ message: string }>("/api/public/contact", {
      method: "POST",
      body,
    })
  },
}
