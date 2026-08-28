import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockDomains } from "@/lib/mock/domains.mock"
import type { Domain } from "@/types/models"
import type { DomainStatus } from "@/types/enums"

export interface ListDomainsParams {
  search?: string
  statut?: DomainStatus | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const domainsService = {
  /**
   * Liste des 6 domaines d'intervention officiels
   * Endpoint : GET /api/admin/domains
   */
  listDomains: async (params: ListDomainsParams = {}): Promise<Domain[]> => {
    const { search = "", statut = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockDomains]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (d) =>
            d.nom.toLowerCase().includes(q) ||
            d.description?.toLowerCase().includes(q) ||
            d.resume?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((d) => d.statut === statut)
      }

      return delay<Domain[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)

    const url = `${API_URL}/api/admin/domains${
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
        err?.message || `Erreur lors du chargement des domaines d'intervention (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'un domaine d'intervention par son ID
   * Endpoint : GET /api/admin/domains/{id}
   */
  getDomain: async (id: number | string): Promise<Domain> => {
    if (DATA_SOURCE === "mock") {
      const found = mockDomains.find(
        (d) => d.id === Number(id) || d.slug === String(id)
      )
      if (!found) {
        throw new Error("Domaine d'intervention introuvable")
      }
      return delay<Domain>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/domains/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger le domaine #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour des informations d'un domaine
   * Endpoint : PUT /api/admin/domains/{id}
   */
  updateDomain: async (
    id: number,
    payload: Partial<Domain>
  ): Promise<Domain> => {
    if (DATA_SOURCE === "mock") {
      const index = mockDomains.findIndex((d) => d.id === Number(id))
      if (index === -1) throw new Error("Domaine d'intervention introuvable")

      const updated: Domain = {
        ...mockDomains[index],
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockDomains[index] = updated
      return delay<Domain>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/domains/${id}`, {
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
        err?.message || `Erreur lors de la mise à jour du domaine (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },
}
