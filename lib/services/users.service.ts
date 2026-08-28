import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockUsers } from "@/lib/mock/users.mock"
import type { User, Role } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

export interface ListUsersParams {
  search?: string
  role?: string
  statut?: string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

const ROLES_MAP: Record<AdminRoleSlug, Role> = {
  "administrateur-principal": {
    id: 1,
    nom: "Administrateur Principal",
    slug: "administrateur-principal",
    permissions: ["*"],
  },
  communication: {
    id: 2,
    nom: "Responsable Communication",
    slug: "communication",
    permissions: [
      "news:*",
      "partners:*",
      "pages:*",
      "testimonials:*",
      "talents:*",
    ],
  },
  "gestionnaire-candidatures": {
    id: 3,
    nom: "Gestionnaire des Candidatures",
    slug: "gestionnaire-candidatures",
    permissions: ["applications:*", "application-calls:*", "memberships:*"],
  },
}

export const usersService = {
  /**
   * Liste des utilisateurs administratifs
   * Endpoint : GET /api/admin/users
   */
  listUsers: async (params: ListUsersParams = {}): Promise<User[]> => {
    const { search = "", role = "all", statut = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockUsers]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (u) =>
            u.nom.toLowerCase().includes(q) ||
            u.prenom?.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
      }

      if (role && role !== "all") {
        filtered = filtered.filter((u) => u.role?.slug === role)
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((u) => u.statut === statut)
      }

      return delay<User[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (role && role !== "all") queryParams.set("role", role)
    if (statut && statut !== "all") queryParams.set("statut", statut)

    const url = `${API_URL}/api/admin/users${
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
          `Erreur lors du chargement des utilisateurs (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Détail d'un utilisateur
   * Endpoint : GET /api/admin/users/{id}
   */
  getUser: async (id: number | string): Promise<User> => {
    if (DATA_SOURCE === "mock") {
      const found = mockUsers.find((u) => u.id === Number(id))
      if (!found) {
        throw new Error("Utilisateur introuvable")
      }
      return delay<User>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Impossible de charger l'utilisateur #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Création d'un utilisateur
   * Endpoint : POST /api/admin/users
   */
  createUser: async (payload: {
    nom: string
    prenom?: string
    email: string
    role_slug: AdminRoleSlug
    statut?: "actif" | "inactif" | "suspendu"
  }): Promise<User> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockUsers.map((u) => u.id)) + 1
      const roleObj =
        ROLES_MAP[payload.role_slug] || ROLES_MAP["communication"]

      const newUser: User = {
        id: newId,
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
        role: roleObj,
        statut: payload.statut || "actif",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockUsers.push(newUser)
      return delay<User>(newUser)
    }

    const res = await fetch(`${API_URL}/api/admin/users`, {
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
          `Erreur lors de la création de l'utilisateur (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour d'un compte utilisateur
   * Endpoint : PUT /api/admin/users/{id}
   */
  updateUser: async (
    id: number,
    payload: {
      nom?: string
      prenom?: string
      email?: string
      role_slug?: AdminRoleSlug
      statut?: "actif" | "inactif" | "suspendu"
    }
  ): Promise<User> => {
    if (DATA_SOURCE === "mock") {
      const index = mockUsers.findIndex((u) => u.id === Number(id))
      if (index === -1) throw new Error("Utilisateur introuvable")

      const existing = mockUsers[index]
      const roleObj = payload.role_slug
        ? ROLES_MAP[payload.role_slug] || existing.role
        : existing.role

      const updated: User = {
        ...existing,
        ...payload,
        role: roleObj,
        updated_at: new Date().toISOString(),
      }

      mockUsers[index] = updated
      return delay<User>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
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
          `Erreur lors de la mise à jour de l'utilisateur (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'un utilisateur
   * Endpoint : DELETE /api/admin/users/{id}
   */
  deleteUser: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockUsers.findIndex((u) => u.id === Number(id))
      if (index !== -1) {
        mockUsers.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message ||
          `Erreur lors de la suppression de l'utilisateur (HTTP ${res.status})`
      )
    }

    return true
  },
}
