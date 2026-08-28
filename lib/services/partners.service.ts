import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockPartners } from "@/lib/mock/partners.mock"
import type { Partner } from "@/types/models"
import type { PartnerStatus, PartnerType } from "@/types/enums"

export interface ListPartnersParams {
  search?: string
  statut?: PartnerStatus | "all" | string
  type?: PartnerType | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

function generateSlug(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
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
            p.description?.toLowerCase().includes(q) ||
            p.contact_email?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((p) => p.statut === statut)
      }

      if (type && type !== "all") {
        filtered = filtered.filter((p) => p.type === type)
      }

      // Sort by ordre or id
      filtered.sort((a, b) => (a.ordre || a.id) - (b.ordre || b.id))

      return delay<Partner[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (type && type !== "all") queryParams.set("type", type)

    const url = `${API_URL}/api/admin/partners${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include", // Laravel Sanctum SPA
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors du chargement des partenaires (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'un partenaire par son ID ou slug
   * Endpoint : GET /api/admin/partners/{id}
   */
  getPartner: async (id: number | string): Promise<Partner> => {
    if (DATA_SOURCE === "mock") {
      const found = mockPartners.find(
        (p) => p.id === Number(id) || p.slug === String(id)
      )
      if (!found) {
        throw new Error("Partenaire introuvable")
      }
      return delay<Partner>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/partners/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger le partenaire #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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
        slug: payload.slug || generateSlug(payload.nom),
        ordre: payload.ordre || newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockPartners.push(newPartner)
      return delay<Partner>(newPartner)
    }

    const res = await fetch(`${API_URL}/api/admin/partners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la création du partenaire (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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
        slug: payload.nom ? generateSlug(payload.nom) : existing.slug,
        updated_at: new Date().toISOString(),
      }

      mockPartners[index] = updated
      return delay<Partner>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/partners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la mise à jour du partenaire (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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

    const res = await fetch(`${API_URL}/api/admin/partners/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la suppression du partenaire (HTTP ${res.status})`
      )
    }

    return true
  },
}
