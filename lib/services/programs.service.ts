import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockPrograms, mockProgramTypes } from "@/lib/mock/programs.mock"
import { mockDomains } from "@/lib/mock/domains.mock"
import type { Program, PaginatedResponse } from "@/types/models"
import type { ProgramStatus, Region } from "@/types/enums"

export interface ListProgramsParams {
  search?: string
  statut?: ProgramStatus | "all" | string
  domain_id?: number | "all" | string
  program_type_id?: number | "all" | string
  /** Alias legacy (composants admin existants) — voir resolveFilterIds(). */
  domaine_id?: number | "all" | string
  type_id?: number | "all" | string
  region?: Region | "all" | string
  page?: number
  per_page?: number
}

/**
 * Les composants admin existants (page liste, barre de filtres) passent
 * encore `domaine_id`/`type_id` (noms historiques). On les accepte en
 * alias de `domain_id`/`program_type_id` (noms réels API) pour n'avoir
 * à toucher aucun composant de présentation.
 */
function resolveFilterIds(params: ListProgramsParams) {
  const domainId = params.domain_id ?? params.domaine_id ?? "all"
  const programTypeId = params.program_type_id ?? params.type_id ?? "all"
  return { domainId, programTypeId }
}

function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

function generateSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

/**
 * Seuls ces champs existent réellement côté backend (voir
 * StoreProgramRequest/UpdateProgramRequest) — jamais `domaine`/`domaine_id`/
 * `type`/`type_id`/`image`/`medias`/`appels_count` (calculés ou dérivés,
 * jamais envoyés en écriture).
 */
function toApiPayload(payload: Partial<Program>): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  if (payload.titre !== undefined) body.titre = payload.titre
  if (payload.slug !== undefined) body.slug = payload.slug
  if (payload.description !== undefined) body.description = payload.description
  if (payload.resume !== undefined) body.resume = payload.resume
  if (payload.region !== undefined) body.region = payload.region
  if (payload.localisation !== undefined) body.localisation = payload.localisation
  if (payload.statut !== undefined) body.statut = payload.statut
  // Le formulaire admin construit encore son payload avec `domaine_id`/
  // `type_id` (noms historiques) — on les accepte en repli des noms réels.
  const domainId = payload.domain_id ?? payload.domaine_id
  const programTypeId = payload.program_type_id ?? payload.type_id
  if (domainId !== undefined) body.domain_id = domainId
  if (programTypeId !== undefined) body.program_type_id = programTypeId
  if (payload.date_debut !== undefined) body.date_debut = payload.date_debut
  if (payload.date_fin !== undefined) body.date_fin = payload.date_fin
  if (payload.beneficiaires_count !== undefined) body.beneficiaires_count = payload.beneficiaires_count
  return body
}

/**
 * Aligne la réponse API réelle (`domain`/`domain_id`/`program_type`/
 * `program_type_id`, voir ProgramResource) sur les noms historiques
 * (`domaine`/`domaine_id`/`type`/`type_id`) attendus par les composants
 * de présentation admin déjà en place (table, liste mobile, fiche détail,
 * formulaire) — évite de devoir les réécrire un par un.
 */
function withLegacyNames(p: Program): Program {
  return {
    ...p,
    domaine: p.domain ?? p.domaine,
    domaine_id: p.domain_id ?? p.domaine_id,
    type: p.program_type ?? p.type,
    type_id: p.program_type_id ?? p.type_id,
  }
}

export const programsService = {
  /**
   * Liste paginée des programmes avec filtres
   * Endpoint : GET /api/admin/programs
   */
  listPrograms: async (
    params: ListProgramsParams = {}
  ): Promise<PaginatedResponse<Program>> => {
    const { search = "", statut = "all", region = "all", page = 1, per_page = 10 } = params
    const { domainId: domain_id, programTypeId: program_type_id } = resolveFilterIds(params)

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

      if (domain_id && domain_id !== "all") {
        filtered = filtered.filter(
          (p) => p.domaine_id === Number(domain_id) || p.domaine?.id === Number(domain_id)
        )
      }

      if (program_type_id && program_type_id !== "all") {
        filtered = filtered.filter(
          (p) => p.type_id === Number(program_type_id) || p.type?.id === Number(program_type_id)
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
    if (domain_id && domain_id !== "all") queryParams.set("domain_id", String(domain_id))
    if (program_type_id && program_type_id !== "all") queryParams.set("program_type_id", String(program_type_id))
    if (region && region !== "all") queryParams.set("region", region)
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(per_page))

    const json = await apiFetch<PaginatedResponse<Program>>(
      `/api/admin/programs?${queryParams.toString()}`,
      { method: "GET" }
    )

    return { ...json, data: json.data.map(withLegacyNames) }
  },

  /**
   * Détail d'un programme par son ID
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

    const json = await apiFetch<{ data?: Program } | Program>(
      `/api/admin/programs/${id}`,
      { method: "GET" }
    )

    return withLegacyNames((json as { data?: Program }).data ?? (json as Program))
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

    const json = await apiFetch<{ data?: Program } | Program>(
      `/api/admin/programs`,
      { method: "POST", body: toApiPayload(payload) }
    )

    return withLegacyNames((json as { data?: Program }).data ?? (json as Program))
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

    const json = await apiFetch<{ data?: Program } | Program>(
      `/api/admin/programs/${id}`,
      { method: "PUT", body: toApiPayload(payload) }
    )

    return withLegacyNames((json as { data?: Program }).data ?? (json as Program))
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

    await apiFetch<void>(`/api/admin/programs/${id}`, { method: "DELETE" })
    return true
  },

  /**
   * Exportation des programmes en CSV
   * Endpoint : GET /api/admin/programs/export
   * (Réponse binaire — passe par `fetch` directement, `apiFetch` est taillé
   * pour du JSON. GET n'a pas besoin du header CSRF.)
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

      blob = new Blob(["﻿" + headers + rows], {
        type: "text/csv;charset=utf-8;",
      })
    } else {
      const { API_URL } = await import("@/lib/config")
      const { domainId, programTypeId } = resolveFilterIds(params)
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.set("search", params.search)
      if (params.statut && params.statut !== "all") queryParams.set("statut", params.statut)
      if (domainId !== "all") queryParams.set("domain_id", String(domainId))
      if (programTypeId !== "all") queryParams.set("program_type_id", String(programTypeId))
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
