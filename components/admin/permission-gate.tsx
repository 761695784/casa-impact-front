"use client"

import React from "react"
import { usePermissions } from "@/hooks/use-permissions"
import type { AdminRoleSlug } from "@/types/admin"

interface PermissionGateProps {
  permission?: string
  roles?: AdminRoleSlug[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

/**
 * Composant de garde de permission pour masquer ou afficher des éléments de l'UI
 * selon les droits retournés par le backend.
 */
export function PermissionGate({
  permission,
  roles,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasRole } = usePermissions()

  if (roles && roles.length > 0) {
    if (!hasRole(roles)) return <>{fallback}</>
  }

  if (permission) {
    if (!hasPermission(permission)) return <>{fallback}</>
  }

  return <>{children}</>
}
