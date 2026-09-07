import type { DashboardStats } from "./models"

export type AdminRoleSlug =
  | "administrateur-principal"
  | "communication"
  | "gestionnaire-candidatures"

/**
 * GET /api/admin/dashboard ne renvoie que des compteurs par ressource
 * (voir DashboardStats dans models.ts) — pas d'actions requises, de
 * listes récentes ni de flux d'activité côté backend aujourd'hui. On
 * réutilise directement DashboardStats plutôt que d'inventer un shape
 * plus riche côté frontend.
 */
export type AdminDashboardData = DashboardStats
