"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DATA_SOURCE } from "@/lib/config"
import { apiFetch, ensureCsrfCookie } from "@/lib/api-client"
import { mockAdminUsers } from "@/lib/mock/admin-dashboard.mock"
import type { User } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  role: AdminRoleSlug | null
  /** Liste complète des rôles (généralement un seul, mais UserResource porte un tableau). */
  roles: AdminRoleSlug[]
  /** Permissions dot-notation (`resource.action`) — clé racine de GET /api/admin/me, pas portée par User. */
  permissions: string[]
  login: (credentials: { email: string; password?: string }) => Promise<void>
  logout: () => Promise<void>
  switchMockRole?: (roleSlug: AdminRoleSlug) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initial check : GET /api/admin/me (Sanctum SPA, cookie de session HttpOnly)
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      if (DATA_SOURCE === "mock") {
        // DEMO ONLY — replace with API data
        const demo = mockAdminUsers[0]
        setUser(demo)
        setPermissions(demo?.roles?.includes("administrateur-principal") ? ["*"] : [])
        setIsLoading(false)
        return
      }

      // Mode API réel : { data: UserResource, permissions: string[] } — `permissions`
      // est une clé racine, PAS nichée dans `data`.
      const res = await apiFetch<{ data: User; permissions: string[] }>("/api/admin/me")
      setUser(res.data)
      setPermissions(res.permissions || [])
    } catch {
      setUser(null)
      setPermissions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Garde de session : hors mode mock, toute route /admin/* (sauf /admin/login)
  // redirige vers la connexion tant qu'aucun utilisateur n'est chargé.
  useEffect(() => {
    if (DATA_SOURCE === "mock" || isLoading) return
    const isLoginPage = pathname?.startsWith("/admin/login")
    if (!user && pathname?.startsWith("/admin") && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [user, isLoading, pathname, router])

  const login = async (credentials: { email: string; password?: string }) => {
    setIsLoading(true)
    try {
      if (DATA_SOURCE === "mock") {
        // DEMO ONLY — find matching mock user or fallback to first
        const found =
          mockAdminUsers.find((u) => u.email === credentials.email) ||
          mockAdminUsers[0]
        setUser(found)
        setPermissions(found?.roles?.includes("administrateur-principal") ? ["*"] : [])
        router.push("/admin/dashboard")
        return
      }

      // 1. Initialiser le cookie CSRF Sanctum
      await ensureCsrfCookie()

      // 2. Authentification POST /api/admin/login — un échec renvoie un vrai
      // 422 Laravel (ValidationException), pas un 401 : apiFetch le propage
      // sous forme d'ApiError avec err.errors.email[0] disponible.
      await apiFetch("/api/admin/login", {
        method: "POST",
        body: credentials,
      })

      // 3. Charger le profil utilisateur authentifié
      await checkAuth()
      router.push("/admin/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      if (DATA_SOURCE !== "mock") {
        await apiFetch("/api/admin/logout", { method: "POST" })
      }
      setUser(null)
      setPermissions([])
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
  }

  // Permet en mode mock de tester facilement les vues sous différents rôles
  const switchMockRole = (roleSlug: AdminRoleSlug) => {
    if (DATA_SOURCE === "mock") {
      const found = mockAdminUsers.find((u) => u.roles?.includes(roleSlug))
      if (found) {
        setUser(found)
        setPermissions(found?.roles?.includes("administrateur-principal") ? ["*"] : [])
      }
    }
  }

  const roles = (user?.roles as AdminRoleSlug[]) || []
  const role = roles[0] || null

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role,
        roles,
        permissions,
        login,
        logout,
        switchMockRole: DATA_SOURCE === "mock" ? switchMockRole : undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
