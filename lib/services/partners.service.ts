import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockPartners } from "@/lib/mock/partners.mock"
import type { Partner, PublicMedia } from "@/types/models"
import type { PartnerStatus, PartnerType } from "@/types/enums"

export interface ListPartnersParams {
  search?: string
  statut?: PartnerStatus | "all" | string
  type?: PartnerType | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/** Déballe une réponse Laravel qui peut être `{ data: T }` ou `T` directement. */
function unwrap<T>(payload: T | { data: T }): T {
  if (payload && typeof payload === "object" && "data" in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

export const partnersService = {
  /**
   * Liste des partenaires institutionnels, financiers, techniques et médias
   * Endpoint : GET /api/admin/partners
   */
  listPartners: async (
    params: ListPartnersParams = {}
  ): Promise<Partner[]> => {
    const { search = "", statut = "all", type = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockPartners]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.nom.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((p) => p.statut === statut)
      }

      if (type && type !== "all") {
        filtered = filtered.filter((p) => p.type === type)
      }

      // Tri par ordre d'affichage, sinon par id
      filtered.sort((a, b) => (a.ordre ?? a.id) - (b.ordre ?? b.id))

      return delay<Partner[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (type && type !== "all") queryParams.set("type", type)

    const path = `/api/admin/partners${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

    const result = await apiFetch<Partner[] | { data: Partner[] }>(path)
    return unwrap(result)
  },

  /**
   * Détail d'un partenaire par son ID
   * Endpoint : GET /api/admin/partners/{id}
   */
  getPartner: async (id: number | string): Promise<Partner> => {
    if (DATA_SOURCE === "mock") {
      const found = mockPartners.find((p) => p.id === Number(id))
      if (!found) {
        throw new Error("Partenaire introuvable")
      }
      return delay<Partner>(found)
    }

    const result = await apiFetch<Partner | { data: Partner }>(
      `/api/admin/partners/${id}`
    )
    return unwrap(result)
  },

  /**
   * Création d'un partenaire
   * Endpoint : POST /api/admin/partners
   */
  createPartner: async (
    payload: Omit<Partner, "id">
  ): Promise<Partner> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockPartners.map((p) => p.id)) + 1
      const newPartner: Partner = {
        ...payload,
        id: newId,
        ordre: payload.ordre ?? newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockPartners.push(newPartner)
      return delay<Partner>(newPartner)
    }

    const result = await apiFetch<Partner | { data: Partner }>(
      "/api/admin/partners",
      { method: "POST", body: payload }
    )
    return unwrap(result)
  },

  /**
   * Mise à jour d'un partenaire
   * Endpoint : PUT /api/admin/partners/{id}
   */
  updatePartner: async (
    id: number,
    payload: Partial<Partner>
  ): Promise<Partner> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPartners.findIndex((p) => p.id === Number(id))
      if (index === -1) throw new Error("Partenaire introuvable")

      const existing = mockPartners[index]
      const updated: Partner = {
        ...existing,
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockPartners[index] = updated
      return delay<Partner>(updated)
    }

    const result = await apiFetch<Partner | { data: Partner }>(
      `/api/admin/partners/${id}`,
      { method: "PUT", body: payload }
    )
    return unwrap(result)
  },

  /**
   * Suppression d'un partenaire
   * Endpoint : DELETE /api/admin/partners/{id}
   */
  deletePartner: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPartners.findIndex((p) => p.id === Number(id))
      if (index !== -1) {
        mockPartners.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    await apiFetch<void>(`/api/admin/partners/${id}`, { method: "DELETE" })
    return true
  },

  /**
   * Upload du logo d'un partenaire via la Médiathèque polymorphique
   * Endpoint : POST /api/admin/media (multipart, collection "logo")
   * Le partenaire doit déjà exister (mediable_id).
   */
  uploadPartnerLogo: async (
    partnerId: number,
    file: File
  ): Promise<PublicMedia> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPartners.findIndex((p) => p.id === Number(partnerId))
      if (index === -1) throw new Error("Partenaire introuvable")

      const newMedia: PublicMedia = {
        id: Date.now(),
        collection: "logo",
        url: URL.createObjectURL(file),
        nom_original: file.name,
        mime: file.type,
        taille: file.size,
      }

      const existing = mockPartners[index]
      mockPartners[index] = {
        ...existing,
        media: [
          ...(existing.media || []).filter((m) => m.collection !== "logo"),
          newMedia,
        ],
        updated_at: new Date().toISOString(),
      }

      return delay<PublicMedia>(newMedia)
    }

    const formData = new FormData()
    formData.append("mediable_type", "partner")
    formData.append("mediable_id", String(partnerId))
    formData.append("fichier", file)
    formData.append("collection", "logo")

    const result = await apiFetch<PublicMedia | { data: PublicMedia }>(
      "/api/admin/media",
      { method: "POST", body: formData }
    )
    return unwrap(result)
  },

  /**
   * Suppression d'un média (ex. remplacement du logo)
   * Endpoint : DELETE /api/admin/media/{id}
   */
  deletePartnerLogo: async (mediaId: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPartners.findIndex((p) =>
        (p.media || []).some((m) => m.id === mediaId)
      )
      if (index !== -1) {
        const existing = mockPartners[index]
        mockPartners[index] = {
          ...existing,
          media: (existing.media || []).filter((m) => m.id !== mediaId),
          updated_at: new Date().toISOString(),
        }
      }
      return delay<boolean>(true)
    }

    await apiFetch<void>(`/api/admin/media/${mediaId}`, { method: "DELETE" })
    return true
  },
}
