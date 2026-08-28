import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockImpactIndicators } from "@/lib/mock/impact.mock"
import { mockDomains } from "@/lib/mock/domains.mock"
import { mockPrograms } from "@/lib/mock/programs.mock"
import type { ImpactIndicator } from "@/types/models"

export interface ListImpactIndicatorsParams {
  search?: string
  statut?: "actif" | "inactif" | "all" | string
  categorie?: string
  domaine_id?: number | "all" | string
  programme_id?: number | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const impactService = {
  /**
   * Liste des indicateurs d'impact territorial
   * Endpoint : GET /api/admin/impact
   */
  listImpactIndicators: async (
    params: ListImpactIndicatorsParams = {}
  ): Promise<ImpactIndicator[]> => {
    const {
      search = "",
      statut = "all",
      categorie = "all",
      domaine_id = "all",
      programme_id = "all",
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockImpactIndicators]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (ind) =>
            ind.libelle.toLowerCase().includes(q) ||
            ind.description?.toLowerCase().includes(q) ||
            ind.categorie?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((ind) => ind.statut === statut)
      }

      if (categorie && categorie !== "all") {
        filtered = filtered.filter((ind) => ind.categorie === categorie)
      }

      if (domaine_id && domaine_id !== "all") {
        filtered = filtered.filter(
          (ind) =>
            ind.domaine_id === Number(domaine_id) ||
            ind.domaine?.id === Number(domaine_id)
        )
      }

      if (programme_id && programme_id !== "all") {
        filtered = filtered.filter(
          (ind) =>
            ind.programme_id === Number(programme_id) ||
            ind.programme?.id === Number(programme_id)
        )
      }

      filtered.sort((a, b) => (a.ordre || a.id) - (b.ordre || b.id))
      return delay<ImpactIndicator[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (categorie && categorie !== "all") queryParams.set("categorie", categorie)
    if (domaine_id && domaine_id !== "all")
      queryParams.set("domaine_id", String(domaine_id))
    if (programme_id && programme_id !== "all")
      queryParams.set("programme_id", String(programme_id))

    const url = `${API_URL}/api/admin/impact${
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
        err?.message ||
          `Erreur lors du chargement des indicateurs d'impact (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'un indicateur d'impact
   * Endpoint : GET /api/admin/impact/{id}
   */
  getImpactIndicator: async (
    id: number | string
  ): Promise<ImpactIndicator> => {
    if (DATA_SOURCE === "mock") {
      const found = mockImpactIndicators.find((ind) => ind.id === Number(id))
      if (!found) {
        throw new Error("Indicateur d'impact introuvable")
      }
      return delay<ImpactIndicator>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/impact/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Impossible de charger l'indicateur #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Création d'un indicateur d'impact
   * Endpoint : POST /api/admin/impact
   */
  createImpactIndicator: async (
    payload: Omit<ImpactIndicator, "id">
  ): Promise<ImpactIndicator> => {
    if (DATA_SOURCE === "mock") {
      const newId =
        Math.max(0, ...mockImpactIndicators.map((ind) => ind.id)) + 1
      const domObj = payload.domaine_id
        ? mockDomains.find((d) => d.id === payload.domaine_id)
        : payload.domaine
      const progObj = payload.programme_id
        ? mockPrograms.find((p) => p.id === payload.programme_id)
        : payload.programme

      const newIndicator: ImpactIndicator = {
        ...payload,
        id: newId,
        domaine: domObj,
        programme: progObj,
        valeurs: payload.valeurs || [],
        statut: payload.statut || "actif",
        ordre: payload.ordre || newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockImpactIndicators.push(newIndicator)
      return delay<ImpactIndicator>(newIndicator)
    }

    const res = await fetch(`${API_URL}/api/admin/impact`, {
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
        err?.message ||
          `Erreur lors de la création de l'indicateur (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour d'un indicateur d'impact
   * Endpoint : PUT /api/admin/impact/{id}
   */
  updateImpactIndicator: async (
    id: number,
    payload: Partial<ImpactIndicator>
  ): Promise<ImpactIndicator> => {
    if (DATA_SOURCE === "mock") {
      const index = mockImpactIndicators.findIndex((ind) => ind.id === Number(id))
      if (index === -1) throw new Error("Indicateur d'impact introuvable")

      const existing = mockImpactIndicators[index]
      const domObj = payload.domaine_id
        ? mockDomains.find((d) => d.id === payload.domaine_id)
        : payload.domaine !== undefined
        ? payload.domaine
        : existing.domaine

      const progObj = payload.programme_id
        ? mockPrograms.find((p) => p.id === payload.programme_id)
        : payload.programme !== undefined
        ? payload.programme
        : existing.programme

      const updated: ImpactIndicator = {
        ...existing,
        ...payload,
        domaine: domObj,
        programme: progObj,
        updated_at: new Date().toISOString(),
      }

      mockImpactIndicators[index] = updated
      return delay<ImpactIndicator>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/impact/${id}`, {
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
        err?.message ||
          `Erreur lors de la mise à jour de l'indicateur (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'un indicateur d'impact
   * Endpoint : DELETE /api/admin/impact/{id}
   */
  deleteImpactIndicator: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockImpactIndicators.findIndex((ind) => ind.id === Number(id))
      if (index !== -1) {
        mockImpactIndicators.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/impact/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Erreur lors de la suppression de l'indicateur (HTTP ${res.status})`
      )
    }

    return true
  },
}
