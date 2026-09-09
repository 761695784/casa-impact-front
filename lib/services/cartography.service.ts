import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockMapPoints } from "@/lib/mock/map.mock"
import type { MapPoint } from "@/types/models"

export interface ListMapPointsParams {
  search?: string
  type?: string
  region?: string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const cartographyService = {
  /**
   * Récupération des points de cartographie territoriale
   * Endpoint : GET /api/admin/cartography (ou GET /api/public/map)
   */
  listMapPoints: async (
    params: ListMapPointsParams = {}
  ): Promise<MapPoint[]> => {
    const { search = "", type = "all", region = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockMapPoints]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            (p.titre || p.libelle || "").toLowerCase().includes(q) ||
            p.commune?.toLowerCase().includes(q) ||
            p.departement?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.domaine_nom?.toLowerCase().includes(q)
        )
      }

      if (type && type !== "all") {
        filtered = filtered.filter((p) => p.type === type)
      }

      if (region && region !== "all") {
        filtered = filtered.filter((p) => p.region === region)
      }

      return delay<MapPoint[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (type && type !== "all") queryParams.set("type", type)
    if (region && region !== "all") queryParams.set("region", region)

    const url = `${API_URL}/api/admin/cartography${
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
          `Erreur lors du chargement de la cartographie (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },
}
