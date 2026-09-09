import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
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

/** Le backend n'expose pas de champ `resume` distinct : on le dérive de `description`. */
function withResume(d: Domain): Domain {
  return { ...d, resume: d.resume ?? d.description }
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

      return delay<Domain[]>(filtered.map(withResume))
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)

    const path = `/api/admin/domains${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

    const json = await apiFetch<{ data?: Domain[] } | Domain[]>(path, {
      method: "GET",
    })

    const list = Array.isArray(json) ? json : json.data || []
    return list.map(withResume)
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
      return delay<Domain>(withResume(found))
    }

    const json = await apiFetch<{ data?: Domain } | Domain>(
      `/api/admin/domains/${id}`,
      { method: "GET" }
    )

    const domain = (json as { data?: Domain }).data ?? (json as Domain)
    return withResume(domain)
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
      return delay<Domain>(withResume(updated))
    }

    // Le backend n'accepte que ces champs — jamais `slug` (verrouillé par le
    // seeder) ni `resume` (dérivé côté frontend uniquement).
    const body: Record<string, unknown> = {}
    if (payload.nom !== undefined) body.nom = payload.nom
    if (payload.description !== undefined) body.description = payload.description
    if (payload.icone !== undefined) body.icone = payload.icone
    if (payload.ordre !== undefined) body.ordre = payload.ordre
    if (payload.statut !== undefined) body.statut = payload.statut

    const json = await apiFetch<{ data?: Domain } | Domain>(
      `/api/admin/domains/${id}`,
      { method: "PUT", body }
    )

    const domain = (json as { data?: Domain }).data ?? (json as Domain)
    return withResume(domain)
  },
}
