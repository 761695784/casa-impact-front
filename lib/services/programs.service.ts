import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockPrograms, mockProgramTypes } from "@/lib/mock/programs.mock"
import { mockDomains } from "@/lib/mock/domains.mock"
import type { Program, PaginatedResponse } from "@/types/models"
import type { ProgramStatus, Region } from "@/types/enums"

export interface ListProgramsParams {
  search?: string
  statut?: ProgramStatus | "all" | string
  domaine_id?: number | "all" | string
  type_id?: number | "all" | string
  region?: Region | "all" | string
  page?: number
  per_page?: number
}

function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

function generateSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export const programsService = {
  /**
   * Liste paginée des programmes avec filtres
   * Endpoint : GET /api/admin/programs
   */
  listPrograms: async (
    params: ListProgramsParams = {}
  ): Promise<PaginatedResponse<Program>> => {
    const {
      search = "",
      statut = "all",
      domaine_id = "all",
      type_id = "all",
      region = "all",
      page = 1,
      per_page = 10,
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockPrograms]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.titre.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.resume?.toLowerCase().includes(q) ||
            p.localisation?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((p) => p.statut === statut)
      }

      if (domaine_id && domaine_id !== "all") {
        filtered = filtered.filter(
          (p) => p.domaine_id === Number(domaine_id) || p.domaine?.id === Number(domaine_id)
        )
      }

      if (type_id && type_id !== "all") {
        filtered = filtered.filter(
          (p) => p.type_id === Number(type_id) || p.type?.id === Number(type_id)
        )
      }

      if (region && region !== "all") {
        filtered = filtered.filter((p) => p.region === region)
      }

      const total = filtered.length
      const last_page = Math.ceil(total / per_page) || 1
      const start = (page - 1) * per_page
      const pagedData = filtered.slice(start, start + per_page)

      return delay<PaginatedResponse<Program>>({
        data: pagedData,
        meta: {
          current_page: page,
          last_page,
          per_page,
          total,
        },
      })
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (domaine_id && domaine_id !== "all") queryParams.set("domaine_id", String(domaine_id))
    if (type_id && type_id !== "all") queryParams.set("type_id", String(type_id))
    if (region && region !== "all") queryParams.set("region", region)
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(per_page))

    const res = await fetch(`${API_URL}/api/admin/programs?${queryParams.toString()}`, {
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
        err?.message || `Erreur lors du chargement des programmes (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data ? json : { data: json.data || json, meta: json.meta }
  },

  /**
   * Détail d'un programme par son ID ou son slug
   * Endpoint : GET /api/admin/programs/{id}
   */
  getProgram: async (id: number | string): Promise<Program> => {
    if (DATA_SOURCE === "mock") {
      const found = mockPrograms.find(
        (p) => p.id === Number(id) || p.slug === String(id)
      )
      if (!found) {
        throw new Error("Programme introuvable")
      }
      return delay<Program>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/programs/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger le programme #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Création d'un nouveau programme
   * Endpoint : POST /api/admin/programs
   */
  createProgram: async (
    payload: Omit<Program, "id">
  ): Promise<Program> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockPrograms.map((p) => p.id)) + 1
      const domaineObj = payload.domaine_id
        ? mockDomains.find((d) => d.id === payload.domaine_id)
        : payload.domaine
      const typeObj = payload.type_id
        ? mockProgramTypes.find((t) => t.id === payload.type_id)
        : payload.type

      const newProgram: Program = {
        ...payload,
        id: newId,
        slug: payload.slug || generateSlug(payload.titre),
        domaine: domaineObj,
        type: typeObj,
        appels_count: 0,
        beneficiaires_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockPrograms.unshift(newProgram)
      return delay<Program>(newProgram)
    }

    const res = await fetch(`${API_URL}/api/admin/programs`, {
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
        err?.message || `Erreur lors de la création du programme (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour d'un programme
   * Endpoint : PUT /api/admin/programs/{id}
   */
  updateProgram: async (
    id: number,
    payload: Partial<Program>
  ): Promise<Program> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPrograms.findIndex((p) => p.id === Number(id))
      if (index === -1) throw new Error("Programme introuvable")

      const existing = mockPrograms[index]
      const domaineObj = payload.domaine_id
        ? mockDomains.find((d) => d.id === payload.domaine_id)
        : payload.domaine !== undefined
        ? payload.domaine
        : existing.domaine
      const typeObj = payload.type_id
        ? mockProgramTypes.find((t) => t.id === payload.type_id)
        : payload.type !== undefined
        ? payload.type
        : existing.type

      const updated: Program = {
        ...existing,
        ...payload,
        slug: payload.titre ? generateSlug(payload.titre) : existing.slug,
        domaine: domaineObj,
        type: typeObj,
        updated_at: new Date().toISOString(),
      }

      mockPrograms[index] = updated
      return delay<Program>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/programs/${id}`, {
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
        err?.message || `Erreur lors de la mise à jour du programme (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'un programme
   * Endpoint : DELETE /api/admin/programs/{id}
   */
  deleteProgram: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPrograms.findIndex((p) => p.id === Number(id))
      if (index !== -1) {
        mockPrograms.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/programs/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la suppression du programme (HTTP ${res.status})`
      )
    }

    return true
  },

  /**
   * Exportation des programmes en CSV
   * Endpoint : GET /api/admin/programs/export
   */
  exportPrograms: async (
    params: Omit<ListProgramsParams, "page" | "per_page"> = {}
  ): Promise<void> => {
    let blob: Blob
    const exportFilename = `programmes_casa_impact_${new Date().toISOString().split("T")[0]}.csv`

    if (DATA_SOURCE === "mock") {
      const headers = "ID;Titre;Slug;Domaine;Type;Region;Localisation;Statut;Appels_Count\n"
      const rows = mockPrograms
        .map(
          (p) =>
            `${p.id};"${p.titre}";"${p.slug}";"${p.domaine?.nom || ""}";"${p.type?.nom || ""}";"${p.region || ""}";"${p.localisation || ""}";"${p.statut}";${p.appels_count || 0}`
        )
        .join("\n")

      blob = new Blob(["\uFEFF" + headers + rows], {
        type: "text/csv;charset=utf-8;",
      })
    } else {
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.set("search", params.search)
      if (params.statut && params.statut !== "all") queryParams.set("statut", params.statut)
      if (params.domaine_id && params.domaine_id !== "all") queryParams.set("domaine_id", String(params.domaine_id))
      if (params.type_id && params.type_id !== "all") queryParams.set("type_id", String(params.type_id))
      if (params.region && params.region !== "all") queryParams.set("region", params.region)

      const res = await fetch(`${API_URL}/api/admin/programs/export?${queryParams.toString()}`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error(`Échec de l'exportation des programmes (HTTP ${res.status})`)
      }

      blob = await res.blob()
    }

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = exportFilename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
}
