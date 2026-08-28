import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockProgramTypes } from "@/lib/mock/programs.mock"
import type { ProgramType } from "@/types/models"
import type { DomainStatus } from "@/types/enums"

export interface ListProgramTypesParams {
  search?: string
  statut?: DomainStatus | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const programTypesService = {
  /**
   * Liste des types de programme
   * Endpoint : GET /api/admin/program-types
   */
  listProgramTypes: async (
    params: ListProgramTypesParams = {}
  ): Promise<ProgramType[]> => {
    const { search = "", statut = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockProgramTypes]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.nom.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((t) => t.statut === statut)
      }

      return delay<ProgramType[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)

    const url = `${API_URL}/api/admin/program-types${
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
        err?.message || `Erreur lors du chargement des types de programme (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'un type de programme
   * Endpoint : GET /api/admin/program-types/{id}
   */
  getProgramType: async (id: number | string): Promise<ProgramType> => {
    if (DATA_SOURCE === "mock") {
      const found = mockProgramTypes.find(
        (t) => t.id === Number(id) || t.slug === String(id)
      )
      if (!found) {
        throw new Error("Type de programme introuvable")
      }
      return delay<ProgramType>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/program-types/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger le type de programme #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour d'un type de programme
   * Endpoint : PUT /api/admin/program-types/{id}
   */
  updateProgramType: async (
    id: number,
    payload: Partial<ProgramType>
  ): Promise<ProgramType> => {
    if (DATA_SOURCE === "mock") {
      const index = mockProgramTypes.findIndex((t) => t.id === Number(id))
      if (index === -1) throw new Error("Type de programme introuvable")

      const updated: ProgramType = {
        ...mockProgramTypes[index],
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockProgramTypes[index] = updated
      return delay<ProgramType>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/program-types/${id}`, {
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
        err?.message || `Erreur lors de la mise à jour du type de programme (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },
}
