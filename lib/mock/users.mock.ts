// DEMO ONLY — replace with API data
import type { User } from "@/types/models"

/**
 * Données de DÉMONSTRATION pour les Utilisateurs administratifs de Casa Impact.
 * Aucune information de mot de passe n'est stockée côté frontend.
 */
export const mockUsers: User[] = [
  // DEMO ONLY — replace with API data
  {
    id: 1,
    nom: "Faye",
    prenom: "Ousmane",
    email: "admin@casa-impact.org",
    role: {
      id: 1,
      nom: "Administrateur Principal",
      slug: "administrateur-principal",
      permissions: ["*"],
    },
    statut: "actif",
    derniere_connexion: "2026-08-28T17:00:00Z",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-08-28T17:00:00Z",
  },
  {
    id: 2,
    nom: "Sané",
    prenom: "Aïssatou",
    email: "comm@casa-impact.org",
    role: {
      id: 2,
      nom: "Responsable Communication",
      slug: "communication",
      permissions: ["news:*", "partners:*", "pages:*", "testimonials:*", "talents:*"],
    },
    statut: "actif",
    derniere_connexion: "2026-08-28T14:30:00Z",
    created_at: "2025-02-15T09:00:00Z",
    updated_at: "2026-08-28T14:30:00Z",
  },
  {
    id: 3,
    nom: "Diallo",
    prenom: "Mamadou",
    email: "candidatures@casa-impact.org",
    role: {
      id: 3,
      nom: "Gestionnaire des Candidatures",
      slug: "gestionnaire-candidatures",
      permissions: ["applications:*", "application-calls:*", "memberships:*"],
    },
    statut: "actif",
    derniere_connexion: "2026-08-27T16:45:00Z",
    created_at: "2025-03-01T10:00:00Z",
    updated_at: "2026-08-27T16:45:00Z",
  },
  {
    id: 4,
    nom: "Ndiaye",
    prenom: "Fatou Binetou",
    email: "f.ndiaye@casa-impact.org",
    role: {
      id: 2,
      nom: "Responsable Communication",
      slug: "communication",
      permissions: ["news:*", "talents:*"],
    },
    statut: "inactif",
    derniere_connexion: "2026-08-15T11:00:00Z",
    created_at: "2025-06-10T14:00:00Z",
    updated_at: "2026-08-15T11:00:00Z",
  },
]
