import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockMemberships } from "@/lib/mock/memberships.mock"
import type { Membership } from "@/types/models"
import type { MembershipStatus, MembershipRegion } from "@/types/enums"

export interface ListMembershipsParams {
  search?: string
  statut?: MembershipStatus | "all" | string
  region?: MembershipRegion | "all" | string
  paiement_statut?: string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const membershipsService = {
  /**
   * Liste des adhésions
   * Endpoint : GET /api/admin/memberships
   */
  listMemberships: async (
    params: ListMembershipsParams = {}
  ): Promise<Membership[]> => {
    const {
      search = "",
      statut = "all",
      region = "all",
      paiement_statut = "all",
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockMemberships]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (m) =>
            m.nom_complet.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.telephone.toLowerCase().includes(q) ||
            m.reference?.toLowerCase().includes(q) ||
            m.profession?.toLowerCase().includes(q) ||
            m.departement?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((m) => m.statut === statut)
      }

      if (region && region !== "all") {
        filtered = filtered.filter((m) => m.region === region)
      }

      if (paiement_statut && paiement_statut !== "all") {
        filtered = filtered.filter((m) => m.paiement_statut === paiement_statut)
      }

      filtered.sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      )
      return delay<Membership[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (region && region !== "all") queryParams.set("region", region)
    if (paiement_statut && paiement_statut !== "all")
      queryParams.set("paiement_statut", paiement_statut)

    const url = `${API_URL}/api/admin/memberships${
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
          `Erreur lors du chargement des adhésions (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'une adhésion
   * Endpoint : GET /api/admin/memberships/{id}
   */
  getMembership: async (id: number | string): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const found = mockMemberships.find(
        (m) => m.id === Number(id) || m.reference === String(id)
      )
      if (!found) {
        throw new Error("Adhésion introuvable")
      }
      return delay<Membership>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/memberships/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Impossible de charger l'adhésion #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour d'une adhésion
   * Endpoint : PUT /api/admin/memberships/{id}
   */
  updateMembership: async (
    id: number,
    payload: Partial<Membership>
  ): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMemberships.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Adhésion introuvable")

      const existing = mockMemberships[index]
      const updated: Membership = {
        ...existing,
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockMemberships[index] = updated
      return delay<Membership>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/memberships/${id}`, {
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
          `Erreur lors de la mise à jour de l'adhésion (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Validation d'une adhésion
   * Endpoint : POST /api/admin/memberships/{id}/validate
   */
  validateMembership: async (id: number): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMemberships.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Adhésion introuvable")

      mockMemberships[index] = {
        ...mockMemberships[index],
        statut: "validee",
        paiement_statut: "paye",
        updated_at: new Date().toISOString(),
      }
      return delay<Membership>(mockMemberships[index])
    }

    const res = await fetch(`${API_URL}/api/admin/memberships/${id}/validate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Erreur lors de la validation de l'adhésion (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Refus d'une adhésion
   * Endpoint : POST /api/admin/memberships/{id}/reject
   */
  rejectMembership: async (id: number): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMemberships.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Adhésion introuvable")

      mockMemberships[index] = {
        ...mockMemberships[index],
        statut: "refusee",
        updated_at: new Date().toISOString(),
      }
      return delay<Membership>(mockMemberships[index])
    }

    const res = await fetch(`${API_URL}/api/admin/memberships/${id}/reject`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Erreur lors du refus de l'adhésion (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'une adhésion
   * Endpoint : DELETE /api/admin/memberships/{id}
   */
  deleteMembership: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMemberships.findIndex((m) => m.id === Number(id))
      if (index !== -1) {
        mockMemberships.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/memberships/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Erreur lors de la suppression de l'adhésion (HTTP ${res.status})`
      )
    }

    return true
  },
}
