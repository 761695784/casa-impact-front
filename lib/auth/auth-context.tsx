"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockAdminUsers } from "@/lib/mock/admin-dashboard.mock"
import type { User } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  role: AdminRoleSlug | null
  login: (credentials: { email: string; password?: string }) => Promise<void>
  logout: () => Promise<void>
  switchMockRole?: (roleSlug: AdminRoleSlug) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initial check : GET /api/admin/me (Sanctum SPA)
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      if (DATA_SOURCE === "mock") {
        // En mode mock développement : utilisateur administrateur-principal par défaut
        // DEMO ONLY — replace with API data
        setUser(mockAdminUsers[0])
        setIsLoading(false)
        return
      }

      // Mode API réel : vérification de session via cookie HttpOnly Sanctum
      const res = await fetch(`${API_URL}/api/admin/me`, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.data || data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (credentials: { email: string; password?: string }) => {
    setIsLoading(true)
    try {
      if (DATA_SOURCE === "mock") {
        // DEMO ONLY — find matching mock user or fallback to first
        const found =
          mockAdminUsers.find((u) => u.email === credentials.email) ||
          mockAdminUsers[0]
        setUser(found)
        router.push("/admin/dashboard")
        return
      }

      // 1. Initialiser le cookie CSRF Sanctum
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      })

      // 2. Authentification POST /api/admin/login
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || "Identifiants invalides.")
      }

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
        await fetch(`${API_URL}/api/admin/logout`, {
          method: "POST",
          headers: { Accept: "application/json" },
          credentials: "include",
        })
      }
      setUser(null)
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
  }

  // Permet en mode mock de tester facilement les vues sous différents rôles
  const switchMockRole = (roleSlug: AdminRoleSlug) => {
    if (DATA_SOURCE === "mock") {
      const found = mockAdminUsers.find((u) => u.role.slug === roleSlug)
      if (found) {
        setUser(found)
      }
    }
  }

  const role = (user?.role?.slug as AdminRoleSlug) || null

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role,
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
