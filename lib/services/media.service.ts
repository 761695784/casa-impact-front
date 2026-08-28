import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockMediaItems } from "@/lib/mock/media.mock"
import type { Media } from "@/types/models"

export interface ListMediaParams {
  search?: string
  type?: string
  categorie?: string
  statut?: string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const mediaService = {
  /**
   * Liste des médias de la médiathèque
   * Endpoint : GET /api/admin/media
   */
  listMedia: async (params: ListMediaParams = {}): Promise<Media[]> => {
    const { search = "", type = "all", categorie = "all", statut = "all" } =
      params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockMediaItems]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (m) =>
            m.nom?.toLowerCase().includes(q) ||
            m.nom_fichier?.toLowerCase().includes(q) ||
            m.description?.toLowerCase().includes(q) ||
            m.alt?.toLowerCase().includes(q)
        )
      }

      if (type && type !== "all") {
        filtered = filtered.filter((m) => m.type === type)
      }

      if (categorie && categorie !== "all") {
        filtered = filtered.filter((m) => m.categorie === categorie)
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((m) => m.statut === statut)
      }

      filtered.sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      )

      return delay<Media[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (type && type !== "all") queryParams.set("type", type)
    if (categorie && categorie !== "all")
      queryParams.set("categorie", categorie)
    if (statut && statut !== "all") queryParams.set("statut", statut)

    const url = `${API_URL}/api/admin/media${
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
          `Erreur lors du chargement des médias (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'un média
   * Endpoint : GET /api/admin/media/{id}
   */
  getMedia: async (id: number | string): Promise<Media> => {
    if (DATA_SOURCE === "mock") {
      const found = mockMediaItems.find((m) => m.id === Number(id))
      if (!found) {
        throw new Error("Média introuvable")
      }
      return delay<Media>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/media/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Impossible de charger le média #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour des métadonnées d'un média
   * Endpoint : PUT /api/admin/media/{id}
   */
  updateMedia: async (
    id: number,
    payload: Partial<Media>
  ): Promise<Media> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMediaItems.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Média introuvable")

      const updated: Media = {
        ...mockMediaItems[index],
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockMediaItems[index] = updated
      return delay<Media>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/media/${id}`, {
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
          `Erreur lors de la mise à jour du média (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'un média
   * Endpoint : DELETE /api/admin/media/{id}
   */
  deleteMedia: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMediaItems.findIndex((m) => m.id === Number(id))
      if (index !== -1) {
        mockMediaItems.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/media/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Erreur lors de la suppression du média (HTTP ${res.status})`
      )
    }

    return true
  },
}
