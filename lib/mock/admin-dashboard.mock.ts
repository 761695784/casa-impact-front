// DEMO ONLY — replace with API data
import type { AdminDashboardData } from "@/types/admin"
import type { User } from "@/types/models"

/**
 * Forme réelle de GET /api/admin/dashboard (DashboardStatsService::stats()) :
 * uniquement des compteurs par ressource, pas de wrapper "stats", pas
 * d'actions requises ni de flux d'activité. Voir AdminDashboardData dans
 * types/admin.ts.
 */
export const mockAdminDashboardData: AdminDashboardData = {
  programmes: { total: 6, publies: 5 },
  appels_a_candidatures: { total: 3, publies: 2 },
  candidatures: {
    total: 48,
    par_statut: {
      nouvelle: 7,
      en_cours_etude: 12,
      preselectionnee: 9,
      retenue: 14,
      non_retenue: 4,
      en_liste_attente: 2,
    },
    en_liste_attente: 2,
  },
  actualites: { total: 12, publiees: 9 },
  talents: { total: 18, publies: 15 },
  temoignages: { total: 8, publies: 6 },
  partenaires: { total: 14, actifs: 12 },
  messages_contact: { total: 15, nouveaux: 4 },
  indicateurs_impact: { total: 6 },
  utilisateurs: { total: 5 },
}

// DEMO ONLY — replace with API data
// Forme réelle de UserResource : `name` unique, `roles` en tableau de
// slugs à plat (pas d'objet Role imbriqué). Les permissions dot-notation
// (resource.action) sont gérées séparément dans AuthContext (root key
// `permissions` de GET /api/admin/me), pas portées par User.
export const mockAdminUsers: User[] = [
  {
    id: 1,
    name: "Amadou Lamine Sané",
    email: "admin@casaimpact.org",
    roles: ["administrateur-principal"],
  },
  {
    id: 2,
    name: "Mariama Sonko",
    email: "communication@casaimpact.org",
    roles: ["communication"],
  },
  {
    id: 3,
    name: "Boubacar Diatta",
    email: "candidatures@casaimpact.org",
    roles: ["gestionnaire-candidatures"],
  },
]
