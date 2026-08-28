import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockTalents } from "@/lib/mock/talents.mock"
import { mockDomains } from "@/lib/mock/domains.mock"
import { mockPrograms } from "@/lib/mock/programs.mock"
import type { Talent } from "@/types/models"
import type { TalentStatus, Region } from "@/types/enums"

export interface ListTalentsParams {
  search?: string
  statut?: TalentStatus | "all" | string
  region?: Region | "all" | string
  domaine_id?: number | "all" | string
  programme_id?: number | "all" | string
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

export const talentsService = {
  /**
   * Liste des profils de talents
   * Endpoint : GET /api/admin/talents
   */
  listTalents: async (params: ListTalentsParams = {}): Promise<Talent[]> => {
    const {
      search = "",
      statut = "all",
      region = "all",
      domaine_id = "all",
      programme_id = "all",
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockTalents]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.nom.toLowerCase().includes(q) ||
            t.domaine_activite?.toLowerCase().includes(q) ||
            t.localisation?.toLowerCase().includes(q) ||
            t.bio?.toLowerCase().includes(q) ||
            t.parcours?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((t) => t.statut === statut)
      }

      if (region && region !== "all") {
        filtered = filtered.filter((t) => t.region === region)
      }

      if (domaine_id && domaine_id !== "all") {
        filtered = filtered.filter(
          (t) =>
            t.domaine_id === Number(domaine_id) ||
            t.domaine?.id === Number(domaine_id)
        )
      }

      if (programme_id && programme_id !== "all") {
        filtered = filtered.filter(
          (t) =>
            t.programme_id === Number(programme_id) ||
            t.programme?.id === Number(programme_id)
        )
      }

      filtered.sort((a, b) => (a.ordre || a.id) - (b.ordre || b.id))
      return delay<Talent[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (region && region !== "all") queryParams.set("region", region)
    if (domaine_id && domaine_id !== "all")
      queryParams.set("domaine_id", String(domaine_id))
    if (programme_id && programme_id !== "all")
      queryParams.set("programme_id", String(programme_id))

    const url = `${API_URL}/api/admin/talents${
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
          `Erreur lors du chargement des talents (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'un profil de talent
   * Endpoint : GET /api/admin/talents/{id}
   */
  getTalent: async (id: number | string): Promise<Talent> => {
    if (DATA_SOURCE === "mock") {
      const found = mockTalents.find(
        (t) => t.id === Number(id) || t.slug === String(id)
      )
      if (!found) {
        throw new Error("Profil de talent introuvable")
      }
      return delay<Talent>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/talents/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Impossible de charger le talent #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Création d'un profil de talent
   * Endpoint : POST /api/admin/talents
   */
  createTalent: async (payload: Omit<Talent, "id">): Promise<Talent> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockTalents.map((t) => t.id)) + 1
      const domObj = payload.domaine_id
        ? mockDomains.find((d) => d.id === payload.domaine_id)
        : payload.domaine
      const progObj = payload.programme_id
        ? mockPrograms.find((p) => p.id === payload.programme_id)
        : payload.programme

      const newTalent: Talent = {
        ...payload,
        id: newId,
        slug: payload.slug || generateSlug(payload.nom),
        domaine: domObj,
        programme: progObj,
        ordre: payload.ordre || newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockTalents.push(newTalent)
      return delay<Talent>(newTalent)
    }

    const res = await fetch(`${API_URL}/api/admin/talents`, {
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
          `Erreur lors de la création du talent (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour d'un profil de talent
   * Endpoint : PUT /api/admin/talents/{id}
   */
  updateTalent: async (
    id: number,
    payload: Partial<Talent>
  ): Promise<Talent> => {
    if (DATA_SOURCE === "mock") {
      const index = mockTalents.findIndex((t) => t.id === Number(id))
      if (index === -1) throw new Error("Talent introuvable")

      const existing = mockTalents[index]
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

      const updated: Talent = {
        ...existing,
        ...payload,
        slug: payload.nom ? generateSlug(payload.nom) : existing.slug,
        domaine: domObj,
        programme: progObj,
        updated_at: new Date().toISOString(),
      }

      mockTalents[index] = updated
      return delay<Talent>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/talents/${id}`, {
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
          `Erreur lors de la mise à jour du talent (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'un profil de talent
   * Endpoint : DELETE /api/admin/talents/{id}
   */
  deleteTalent: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockTalents.findIndex((t) => t.id === Number(id))
      if (index !== -1) {
        mockTalents.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/talents/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Erreur lors de la suppression du profil (HTTP ${res.status})`
      )
    }

    return true
  },
}
