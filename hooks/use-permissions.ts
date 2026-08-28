"use client"

import { useAuth } from "@/lib/auth/auth-context"
import type { AdminRoleSlug } from "@/types/admin"

export function usePermissions() {
  const { user, role } = useAuth()

  /**
   * Vérifie si l'utilisateur possède une permission spécifique.
   * L'administrateur principal possède l'accès complet (*).
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (role === "administrateur-principal") return true

    const permissions = user.role?.permissions || user.permissions || []
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
    isSuperAdmin: role === "administrateur-principal",
    isCommunication: role === "communication",
    isGestionnaireCandidatures: role === "gestionnaire-candidatures",
    hasPermission,
    hasRole,
  }
}
