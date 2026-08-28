import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockAdminDashboardData } from "@/lib/mock/admin-dashboard.mock"
import type { AdminDashboardData } from "@/types/admin"

/**
 * Service d'administration Casa Impact.
 *
 * RÈGLE FONDAMENTALE :
 * - En mode 'mock' (développement sans backend actif), utilise les mocks annotés DEMO ONLY.
 * - En mode 'api' (production / intégration), appelle l'API Laravel Sanctum.
 *   Si l'API échoue, l'erreur est propagée sans AUCUN fallback silencieux vers les mocks.
 */

function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const adminService = {
  /**
   * Récupère les données consolidées du Dashboard Admin
   * Endpoint prévu : GET /api/admin/dashboard
   */
  getDashboardData: async (): Promise<AdminDashboardData> => {
    if (DATA_SOURCE === "mock") {
      return delay<AdminDashboardData>(mockAdminDashboardData)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const res = await fetch(`${API_URL}/api/admin/dashboard`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include", // Laravel Sanctum SPA
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(
        errorData?.message ||
          `Erreur lors du chargement du tableau de bord (HTTP ${res.status})`
      )
    }

    const response = await res.json()
    return response.data || response
  },
}
