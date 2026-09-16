import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockContactMessages } from "@/lib/mock/contact-messages.mock"
import type { ContactMessage } from "@/types/models"
import type { ContactCategory, ContactMessageStatus } from "@/types/enums"

export interface ListContactMessagesParams {
  search?: string
  categorie?: ContactCategory | "all" | string
  statut?: ContactMessageStatus | "all" | string
  lu?: "all" | "true" | "false"
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const contactMessagesService = {
  /**
   * Liste des messages de contact reçus
   * Endpoint : GET /api/admin/contact-messages
   */
  listContactMessages: async (
    params: ListContactMessagesParams = {}
  ): Promise<ContactMessage[]> => {
    const {
      search = "",
      categorie = "all",
      statut = "all",
      lu = "all",
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockContactMessages]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (m) =>
            m.nom.toLowerCase().includes(q) ||
            m.prenom?.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.sujet?.toLowerCase().includes(q) ||
            m.message.toLowerCase().includes(q)
        )
      }

      if (categorie && categorie !== "all") {
        filtered = filtered.filter((m) => m.categorie === categorie)
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((m) => m.statut === statut)
      }

      if (lu === "true") {
        filtered = filtered.filter((m) => m.lu === true)
      } else if (lu === "false") {
        filtered = filtered.filter((m) => !m.lu)
      }

      filtered.sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      )

      return delay<ContactMessage[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (categorie && categorie !== "all")
      queryParams.set("categorie", categorie)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (lu !== "all") queryParams.set("lu", lu)

    const json = await apiFetch<{ data?: ContactMessage[] } | ContactMessage[]>(
      `/api/admin/contact-messages${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    )
    return (json as { data?: ContactMessage[] }).data ?? (json as ContactMessage[])
  },

  /**
   * Détail d'un message de contact
   * Endpoint : GET /api/admin/contact-messages/{id}
   */
  getContactMessage: async (id: number | string): Promise<ContactMessage> => {
    if (DATA_SOURCE === "mock") {
      const found = mockContactMessages.find((m) => m.id === Number(id))
      if (!found) {
        throw new Error("Message introuvable")
      }
      // Marquer automatiquement comme lu lors de la consultation
      found.lu = true
      return delay<ContactMessage>(found)
    }

    const json = await apiFetch<{ data?: ContactMessage } | ContactMessage>(
      `/api/admin/contact-messages/${id}`
    )
    return (json as { data?: ContactMessage }).data ?? (json as ContactMessage)
  },

  /**
   * Mise à jour du statut ou des notes internes d'un message
   * Endpoint : PUT /api/admin/contact-messages/{id}
   */
  updateContactMessage: async (
    id: number,
    payload: Partial<ContactMessage>
  ): Promise<ContactMessage> => {
    if (DATA_SOURCE === "mock") {
      const index = mockContactMessages.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Message introuvable")

      const updated: ContactMessage = {
        ...mockContactMessages[index],
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockContactMessages[index] = updated
      return delay<ContactMessage>(updated)
    }

    const json = await apiFetch<{ data?: ContactMessage } | ContactMessage>(
      `/api/admin/contact-messages/${id}`,
      { method: "PUT", body: payload }
    )
    return (json as { data?: ContactMessage }).data ?? (json as ContactMessage)
  },

  /**
   * Marquer un message comme lu
   * Endpoint : POST /api/admin/contact-messages/{id}/read
   */
  markAsRead: async (id: number): Promise<ContactMessage> => {
    if (DATA_SOURCE === "mock") {
      const index = mockContactMessages.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Message introuvable")

      mockContactMessages[index] = {
        ...mockContactMessages[index],
        lu: true,
        updated_at: new Date().toISOString(),
      }

      return delay<ContactMessage>(mockContactMessages[index])
    }

    const json = await apiFetch<{ data?: ContactMessage } | ContactMessage>(
      `/api/admin/contact-messages/${id}/read`,
      { method: "POST" }
    )
    return (json as { data?: ContactMessage }).data ?? (json as ContactMessage)
  },

  /**
   * Suppression d'un message
   * Endpoint : DELETE /api/admin/contact-messages/{id}
   */
  deleteContactMessage: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockContactMessages.findIndex((m) => m.id === Number(id))
      if (index !== -1) {
        mockContactMessages.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    // Corrigé le 2026-09-16 ("la suppression ne passe pas", 419 "CSRF token
    // mismatch") : ce fichier faisait un fetch() brut, sans jamais envoyer
    // l'en-tête X-XSRF-TOKEN attendu par Sanctum sur toute mutation
    // (POST/PUT/PATCH/DELETE) — contrairement à apiFetch (lib/api-client.ts)
    // qui l'ajoute automatiquement et rafraîchit le cookie CSRF en cas
    // d'expiration. Toutes les méthodes de ce service passent maintenant
    // par apiFetch.
    await apiFetch<void>(`/api/admin/contact-messages/${id}`, {
      method: "DELETE",
    })
    return true
  },
}
