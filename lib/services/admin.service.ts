import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
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
   * Récupère les compteurs du Dashboard Admin — GET /api/admin/dashboard.
   * Réponse réelle : { data: DashboardStats }, pas de wrapper "stats" ni
   * d'actions requises (voir DashboardStatsService::stats()).
   */
  getDashboardData: async (): Promise<AdminDashboardData> => {
    if (DATA_SOURCE === "mock") {
      return delay<AdminDashboardData>(mockAdminDashboardData)
    }

    const res = await apiFetch<{ data: AdminDashboardData }>("/api/admin/dashboard")
    return res.data
  },
}
