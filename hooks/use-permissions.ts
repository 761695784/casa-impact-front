"use client"

import { useAuth } from "@/lib/auth/auth-context"
import type { AdminRoleSlug } from "@/types/admin"

export function usePermissions() {
  const { user, role, roles, permissions } = useAuth()

  /**
   * Vérifie si l'utilisateur possède une permission spécifique
   * (dot-notation `resource.action`, ex. "programmes.create"). Le rôle
   * administrateur-principal contourne le check via Gate::before côté
   * backend — `permissions` contient déjà la liste complète pour lui,
   * mais on garde aussi le bypass explicite par rôle en filet de sécurité.
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (role === "administrateur-principal") return true
    if (permissions.includes("*")) return true
    return permissions.includes(permission)
  }

  /**
   * Vérifie si l'utilisateur possède l'un des rôles indiqués.
   */
  const hasRole = (allowedRoles: AdminRoleSlug[]): boolean => {
    if (!role) return false
    return allowedRoles.includes(role)
  }

  return {
    user,
    role,
    roles,
    permissions,
    isSuperAdmin: role === "administrateur-principal",
    isCommunication: role === "communication",
    isGestionnaireCandidatures: role === "gestionnaire-candidatures",
    hasPermission,
    hasRole,
  }
}
