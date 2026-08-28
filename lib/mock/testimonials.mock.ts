// DEMO ONLY — replace with API data
import type { Testimonial } from "@/types/models"
import { mockPrograms } from "./programs.mock"

/**
 * Données de DÉMONSTRATION pour les Témoignages de Casa Impact.
 */
export const mockTestimonials: Testimonial[] = [
  // DEMO ONLY — replace with API data
  {
    id: 1,
    auteur: "Amina Diallo",
    fonction: "Lauréate de la Promotion 2025",
    organisation: "Association Jeunesse Active Ziguinchor",
    contenu:
      "L'Académie du Leadership Jeune m'a donné confiance en mes capacités de prise de parole et de gestion de projet. Grâce au mentorat reçu à Casa Impact, nous avons pu lancer notre premier forum communautaire sur l'éducation citoyenne.",
    photo: "/assets/team/placeholder.svg",
    programme_id: 1,
    programme: mockPrograms[0],
    statut: "publie",
    ordre: 1,
    created_at: "2025-11-20T10:00:00Z",
    updated_at: "2026-01-10T12:00:00Z",
  },
  {
    id: 2,
    auteur: "Mamadou Lamine Sané",
    fonction: "Fondateur & Porteur de Projet",
    organisation: "AgriTech Casamance Kolda",
    contenu:
      "Intégrer l'incubateur Entrepreneuriat & Innovation nous a permis de structurer notre modèle économique et de moderniser notre chaîne de transformation de fruits locaux. L'appui technique et financier a été déterminant.",
    photo: "/assets/team/placeholder.svg",
    programme_id: 2,
    programme: mockPrograms[1],
    statut: "publie",
    ordre: 2,
    created_at: "2025-12-05T14:00:00Z",
    updated_at: "2026-01-15T09:30:00Z",
  },
  {
    id: 3,
    auteur: "Fatoumata Binetou Coly",
    fonction: "Artisane & Créatrice Textile",
    organisation: "Coopérative des Femmes de Sédhiou",
    contenu:
      "Notre participation au Festival des Talents de la Casamance a donné une visibilité sans précédent à notre artisanat textile. C'est une immense fierté de porter le patrimoine de Sédhiou sur la scène nationale.",
    photo: "/assets/team/placeholder.svg",
    programme_id: 3,
    programme: mockPrograms[2],
    statut: "publie",
    ordre: 3,
    created_at: "2026-01-18T11:00:00Z",
    updated_at: "2026-01-20T16:00:00Z",
  },
  {
    id: 4,
    auteur: "Abdoulaye Gassama",
    fonction: "Directeur de Campement Éco-Solidaire",
    organisation: "Éco-Tourisme Basse-Casamance",
    contenu:
      "Casa Impact crée de véritables synergies entre les acteurs du tourisme rural et la jeunesse locale. C'est cette vision intégrée qui manquait pour dynamiser durablement notre région.",
    photo: "/assets/team/placeholder.svg",
    programme_id: 5,
    programme: mockPrograms[4],
    statut: "brouillon",
    ordre: 4,
    created_at: "2026-02-05T09:00:00Z",
    updated_at: "2026-02-12T14:00:00Z",
  },
]
