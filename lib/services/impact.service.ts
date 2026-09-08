import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockImpactIndicators } from "@/lib/mock/impact.mock"
import type { ImpactIndicator, ImpactValue } from "@/types/models"

export interface ListImpactIndicatorsParams {
  search?: string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const impactService = {
  /**
   * Liste des indicateurs d'impact territorial
   * Endpoint : GET /api/admin/impact-indicators
   */
  listImpactIndicators: async (
    params: ListImpactIndicatorsParams = {}
  ): Promise<ImpactIndicator[]> => {
    const { search = "" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockImpactIndicators]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (ind) =>
            ind.libelle.toLowerCase().includes(q) ||
            ind.description?.toLowerCase().includes(q)
        )
      }

      filtered.sort((a, b) => a.id - b.id)
      return delay<ImpactIndicator[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)

    const path = `/api/admin/impact-indicators${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

    const json = await apiFetch<{ data?: ImpactIndicator[] } | ImpactIndicator[]>(
      path,
      { method: "GET" }
    )
    return (json as { data?: ImpactIndicator[] })?.data ?? (json as ImpactIndicator[])
  },

  /**
   * Détail d'un indicateur d'impact
   * Endpoint : GET /api/admin/impact-indicators/{id}
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

    const json = await apiFetch<{ data?: ImpactIndicator } | ImpactIndicator>(
      `/api/admin/impact-indicators/${id}`,
      { method: "GET" }
    )
    return (json as { data?: ImpactIndicator })?.data ?? (json as ImpactIndicator)
  },

  /**
   * Création d'un indicateur d'impact
   * Endpoint : POST /api/admin/impact-indicators
   */
  createImpactIndicator: async (
    payload: Omit<ImpactIndicator, "id">
  ): Promise<ImpactIndicator> => {
    if (DATA_SOURCE === "mock") {
      const newId =
        Math.max(0, ...mockImpactIndicators.map((ind) => ind.id)) + 1

      const newIndicator: ImpactIndicator = {
        ...payload,
        id: newId,
        values: payload.values || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockImpactIndicators.push(newIndicator)
      return delay<ImpactIndicator>(newIndicator)
    }

    const json = await apiFetch<{ data?: ImpactIndicator } | ImpactIndicator>(
      `/api/admin/impact-indicators`,
      { method: "POST", body: payload }
    )
    return (json as { data?: ImpactIndicator })?.data ?? (json as ImpactIndicator)
  },

  /**
   * Mise à jour d'un indicateur d'impact (champs propres à l'indicateur
   * uniquement — libelle/unite/description ; les valeurs se gèrent via
   * addImpactValue/updateImpactValue/deleteImpactValue, sous-ressource
   * séparée).
   * Endpoint : PUT /api/admin/impact-indicators/{id}
   */
  updateImpactIndicator: async (
    id: number,
    payload: Partial<ImpactIndicator>
  ): Promise<ImpactIndicator> => {
    if (DATA_SOURCE === "mock") {
      const index = mockImpactIndicators.findIndex((ind) => ind.id === Number(id))
      if (index === -1) throw new Error("Indicateur d'impact introuvable")

      const existing = mockImpactIndicators[index]
      const updated: ImpactIndicator = {
        ...existing,
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockImpactIndicators[index] = updated
      return delay<ImpactIndicator>(updated)
    }

    const json = await apiFetch<{ data?: ImpactIndicator } | ImpactIndicator>(
      `/api/admin/impact-indicators/${id}`,
      { method: "PUT", body: payload }
    )
    return (json as { data?: ImpactIndicator })?.data ?? (json as ImpactIndicator)
  },

  /**
   * Suppression d'un indicateur d'impact
   * Endpoint : DELETE /api/admin/impact-indicators/{id}
   */
  deleteImpactIndicator: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockImpactIndicators.findIndex((ind) => ind.id === Number(id))
      if (index !== -1) {
        mockImpactIndicators.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    await apiFetch<void>(`/api/admin/impact-indicators/${id}`, {
      method: "DELETE",
    })

    return true
  },

  /**
   * Ajout d'une valeur (point de mesure) à un indicateur — sous-ressource
   * imbriquée : une valeur n'existe jamais hors de son indicateur.
   * Endpoint : POST /api/admin/impact-indicators/{indicatorId}/values
   */
  addImpactValue: async (
    indicatorId: number,
    payload: Omit<ImpactValue, "id">
  ): Promise<ImpactValue> => {
    if (DATA_SOURCE === "mock") {
      const index = mockImpactIndicators.findIndex(
        (ind) => ind.id === Number(indicatorId)
      )
      if (index === -1) throw new Error("Indicateur d'impact introuvable")

      const existing = mockImpactIndicators[index]
      const newValueId =
        Math.max(0, ...(existing.values || []).map((v) => v.id)) + 1
      const newValue: ImpactValue = {
        ...payload,
        id: newValueId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockImpactIndicators[index] = {
        ...existing,
        values: [...(existing.values || []), newValue],
        updated_at: new Date().toISOString(),
      }

      return delay<ImpactValue>(newValue)
    }

    const json = await apiFetch<{ data?: ImpactValue } | ImpactValue>(
      `/api/admin/impact-indicators/${indicatorId}/values`,
      { method: "POST", body: payload }
    )
    return (json as { data?: ImpactValue })?.data ?? (json as ImpactValue)
  },

  /**
   * Mise à jour d'une valeur existante.
   * Endpoint : PUT /api/admin/impact-values/{valueId}
   */
  updateImpactValue: async (
    valueId: number,
    payload: Partial<Omit<ImpactValue, "id">>
  ): Promise<ImpactValue> => {
    if (DATA_SOURCE === "mock") {
      for (const ind of mockImpactIndicators) {
        const vIndex = (ind.values || []).findIndex((v) => v.id === Number(valueId))
        if (vIndex !== -1 && ind.values) {
          const updated: ImpactValue = {
            ...ind.values[vIndex],
            ...payload,
            updated_at: new Date().toISOString(),
          }
          ind.values[vIndex] = updated
          ind.updated_at = new Date().toISOString()
          return delay<ImpactValue>(updated)
        }
      }
      throw new Error("Valeur d'impact introuvable")
    }

    const json = await apiFetch<{ data?: ImpactValue } | ImpactValue>(
      `/api/admin/impact-values/${valueId}`,
      { method: "PUT", body: payload }
    )
    return (json as { data?: ImpactValue })?.data ?? (json as ImpactValue)
  },

  /**
   * Suppression d'une valeur.
   * Endpoint : DELETE /api/admin/impact-values/{valueId}
   */
  deleteImpactValue: async (valueId: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      for (const ind of mockImpactIndicators) {
        const vIndex = (ind.values || []).findIndex((v) => v.id === Number(valueId))
        if (vIndex !== -1 && ind.values) {
          ind.values.splice(vIndex, 1)
          ind.updated_at = new Date().toISOString()
          return delay<boolean>(true)
        }
      }
      return delay<boolean>(false)
    }

    await apiFetch<void>(`/api/admin/impact-values/${valueId}`, {
      method: "DELETE",
    })

    return true
  },
}
