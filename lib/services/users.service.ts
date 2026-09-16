import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockUsers } from "@/lib/mock/users.mock"
import type { User, Role } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

export interface ListUsersParams {
  search?: string
  role?: string
  statut?: string
}

/**
 * Forme RÉELLE de App\Http\Resources\Admin\UserResource (vérifiée le
 * 2026-09-16, bug "l'affichage des infos utilisateur ça ne va pas" —
 * liste affichant "undefined" comme nom et "Utilisateur" comme rôle pour
 * tout le monde) : un seul champ `name` (pas de nom/prenom séparés) et
 * `roles` en tableau de SLUGS à plat (`$this->roles->pluck('name')`),
 * jamais un objet `role` imbriqué. Le modèle User n'a par ailleurs AUCUNE
 * colonne de statut (actif/inactif/suspendu) — ce concept n'existe que
 * côté UI pour l'instant, donc toujours "actif" tant que le compte existe
 * (soft-delete = compte absent de la liste, pas "inactif").
 * withLegacyUserShape() traduit cette forme réelle vers celle attendue par
 * les composants existants (UsersTable, UserFormDialog), construits à
 * l'origine contre le mock — même principe que RawApplication/
 * withLegacyNames() dans applications.service.ts.
 */
interface RawUser {
  id: number
  name: string
  email: string
  roles: string[]
  created_at?: string
  updated_at?: string
}

function withLegacyUserShape(raw: RawUser): User {
  const roleSlug = (raw.roles?.[0] as AdminRoleSlug) || undefined
  return {
    id: raw.id,
    name: raw.name,
    nom: raw.name,
    email: raw.email,
    roles: raw.roles,
    role: roleSlug ? ROLES_MAP[roleSlug] : undefined,
    statut: "actif",
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  }
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/**
 * Exporté (accord du 2026-09-11) pour être réutilisé par AuthContext en
 * mode mock — sans ça, les comptes démo "communication" et
 * "gestionnaire-candidatures" se retrouvaient avec ZÉRO permission une
 * fois connectés (AuthContext codait en dur `permissions: []` pour
 * quiconque n'était pas administrateur-principal), ce qui rendait le mode
 * mock inutilisable pour tester l'affichage par rôle.
 */
export const ROLES_MAP: Record<AdminRoleSlug, Role> = {
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
    // Notation pointée alignée sur RolesAndPermissionsSeeder.php côté
    // backend (voir lib/admin-nav.ts) — "resource.*" couvre toutes les
    // actions de ce module (view/create/update/delete), voir
    // hooks/use-permissions.ts::hasPermission(). Corrige le bug du
    // 2026-09-11 : l'ancienne notation "news:*" (deux-points) ne
    // correspondait à aucune permission réellement vérifiée nulle part.
    permissions: [
      "news.*",
      "partners.*",
      "pages.*",
      "testimonials.*",
      "talents.*",
    ],
  },
  "gestionnaire-candidatures": {
    id: 3,
    nom: "Gestionnaire des Candidatures",
    slug: "gestionnaire-candidatures",
    permissions: ["applications.*", "application-calls.*", "memberships.*"],
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
            (u.nom?.toLowerCase().includes(q) ?? false) ||
            (u.name?.toLowerCase().includes(q) ?? false) ||
            (u.prenom?.toLowerCase().includes(q) ?? false) ||
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

    const json = await apiFetch<{ data?: RawUser[] } | RawUser[]>(
      `/api/admin/users${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    )
    const raw = (json as { data?: RawUser[] }).data ?? (json as RawUser[])
    return raw.map(withLegacyUserShape)
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

    const json = await apiFetch<{ data?: RawUser } | RawUser>(
      `/api/admin/users/${id}`
    )
    const raw = (json as { data?: RawUser }).data ?? (json as RawUser)
    return withLegacyUserShape(raw)
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

    // Le backend (StoreUserRequest) attend `name` (pas nom/prenom séparés)
    // et `roles` en tableau (pas `role_slug` singulier) — voir
    // withLegacyUserShape() ci-dessus pour le sens inverse (lecture).
    // NOTE : StoreUserRequest exige aussi `password` (+ confirmation), que
    // ce formulaire ne collecte pas encore — la création échouera donc
    // avec une erreur de validation "password requis" tant qu'un champ mot
    // de passe n'aura pas été ajouté à UserFormDialog.
    const json = await apiFetch<{ data?: RawUser } | RawUser>(`/api/admin/users`, {
      method: "POST",
      body: {
        name: [payload.prenom, payload.nom].filter(Boolean).join(" "),
        email: payload.email,
        roles: [payload.role_slug],
      },
    })
    const raw = (json as { data?: RawUser }).data ?? (json as RawUser)
    return withLegacyUserShape(raw)
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

    // Même traduction de forme que createUser ci-dessus. `statut` n'est pas
    // envoyé : aucune colonne correspondante côté backend (voir
    // withLegacyUserShape), UpdateUserRequest l'ignorerait de toute façon.
    const body: Record<string, unknown> = {}
    if (payload.nom || payload.prenom) {
      body.name = [payload.prenom, payload.nom].filter(Boolean).join(" ")
    }
    if (payload.email) body.email = payload.email
    if (payload.role_slug) body.roles = [payload.role_slug]

    const json = await apiFetch<{ data?: RawUser } | RawUser>(
      `/api/admin/users/${id}`,
      { method: "PUT", body }
    )
    const raw = (json as { data?: RawUser }).data ?? (json as RawUser)
    return withLegacyUserShape(raw)
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

    // Corrigé le 2026-09-16 (même bug que contact-messages.service.ts :
    // fetch() brut sans en-tête X-XSRF-TOKEN, donc 419 "CSRF token
    // mismatch" systématique sur create/update/delete). Toutes les méthodes
    // de ce service passent maintenant par apiFetch.
    await apiFetch<void>(`/api/admin/users/${id}`, { method: "DELETE" })
    return true
  },
}
