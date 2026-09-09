import { DATA_SOURCE } from "@/lib/config"
import { apiFetch, ApiError } from "@/lib/api-client"
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

function generateSlug(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

/**
 * Seuls ces champs existent réellement côté backend (voir
 * StoreProgramTypeRequest/UpdateProgramTypeRequest) — jamais
 * `programmes_count` (calculé, jamais envoyé en écriture).
 */
function toApiPayload(payload: Partial<ProgramType>): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  if (payload.nom !== undefined) body.nom = payload.nom
  if (payload.slug !== undefined) body.slug = payload.slug
  if (payload.description !== undefined) body.description = payload.description
  if (payload.statut !== undefined) body.statut = payload.statut
  if (payload.ordre !== undefined) body.ordre = payload.ordre
  return body
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

    try {
      const queryParams = new URLSearchParams()
      if (search) queryParams.set("search", search)
      if (statut && statut !== "all") queryParams.set("statut", statut)

      const path = `/api/admin/program-types${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`

      const json = await apiFetch<{ data?: ProgramType[] } | ProgramType[]>(path, {
        method: "GET",
      })

      const list = Array.isArray(json) ? json : json.data || []
      if (list.length === 0) {
        return mockProgramTypes
      }
      return list
    } catch (error) {
      console.warn("Failed to fetch program types from API, falling back to mock:", error)
      return mockProgramTypes
    }
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

    const json = await apiFetch<{ data?: ProgramType } | ProgramType>(
      `/api/admin/program-types/${id}`,
      { method: "GET" }
    )

    return (json as { data?: ProgramType }).data ?? (json as ProgramType)
  },

  /**
   * Création d'un nouveau type de programme
   * Endpoint : POST /api/admin/program-types
   */
  createProgramType: async (
    payload: Omit<ProgramType, "id">
  ): Promise<ProgramType> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockProgramTypes.map((t) => t.id)) + 1
      const newType: ProgramType = {
        ...payload,
        id: newId,
        slug: payload.slug || generateSlug(payload.nom),
        statut: payload.statut ?? ("actif" as DomainStatus),
        programmes_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockProgramTypes.unshift(newType)
      return delay<ProgramType>(newType)
    }

    const json = await apiFetch<{ data?: ProgramType } | ProgramType>(
      `/api/admin/program-types`,
      { method: "POST", body: toApiPayload(payload) }
    )

    return (json as { data?: ProgramType }).data ?? (json as ProgramType)
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

    const json = await apiFetch<{ data?: ProgramType } | ProgramType>(
      `/api/admin/program-types/${id}`,
      { method: "PUT", body: toApiPayload(payload) }
    )

    return (json as { data?: ProgramType }).data ?? (json as ProgramType)
  },

  /**
   * Suppression d'un type de programme
   * Endpoint : DELETE /api/admin/program-types/{id}
   * Le backend renvoie explicitement un 409 quand ce type est encore
   * utilisé par au moins un programme (restrictOnDelete) — on le
   * transforme ici en erreur claire pour que l'UI n'ait pas besoin de
   * connaître ApiError/le code HTTP pour afficher le bon message.
   */
  deleteProgramType: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const type = mockProgramTypes.find((t) => t.id === Number(id))
      if (type && (type.programmes_count ?? 0) > 0) {
        throw new Error(
          "Ce type de programme est utilisé par au moins un programme et ne peut pas être supprimé."
        )
      }
      const index = mockProgramTypes.findIndex((t) => t.id === Number(id))
      if (index !== -1) {
        mockProgramTypes.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    try {
      await apiFetch<void>(`/api/admin/program-types/${id}`, { method: "DELETE" })
      return true
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        throw new Error(
          error.message ||
            "Ce type de programme est utilisé par au moins un programme et ne peut pas être supprimé."
        )
      }
      throw error
    }
  },
}
