// DEMO ONLY — replace with API data
import type { Testimonial } from "@/types/models"
import { mockPrograms } from "./programs.mock"

/**
 * Données officielles et de démonstration pour les Témoignages de Casa Impact.
 * Chaque témoignage reflète l'impact sur un bénéficiaire des 3 régions de Casamance.
 */
export const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    auteur: "Amina Diallo",
    fonction: "Bénéficiaire Académie Leadership",
    organisation: "Jeunesse Citoyenne • Ziguinchor",
    contenu:
      "L'Académie du Leadership Jeune m'a permis de développer une réelle aisance oratoire et de structurer nos projets associatifs. Grâce au mentorat de Casa Impact, nous avons mobilisé plus de 150 jeunes pour des actions citoyennes dans le département de Bignona.",
    photo: "/assets/team/fatoumata-drame.jpg",
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
    fonction: "Fondateur AgriTech Casamance",
    organisation: "Pôle Agro-écologie • Kolda",
    contenu:
      "Intégrer le parcours Entrepreneuriat & Innovation de Casa Impact a été le tournant décisif pour notre startup. Nous avons modernisé notre unité de transformation de mangues et sécurisé nos premiers débouchés commerciaux avec les producteurs locaux.",
    photo: "/assets/team/abdou-khadre-djitte.jpg",
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
    organisation: "Coopérative des Femmes • Sédhiou",
    contenu:
      "Notre participation aux événements de promotion des talents a donné une visibilité exceptionnelle à notre artisanat textile en Casamance. C'est une immense fierté de voir notre patrimoine valorisé et commercialisé avec une telle exigence.",
    photo: "/assets/team/felicite-binette-coly.jpg",
    programme_id: 3,
    programme: mockPrograms[2],
    statut: "publie",
    ordre: 3,
    created_at: "2026-01-18T11:00:00Z",
    updated_at: "2026-01-20T16:00:00Z",
  },
  {
    id: 4,
    auteur: "Ousmane Badji",
    fonction: "Entrepreneur Numérique & IA",
    organisation: "Hub Digital Casamance • Ziguinchor",
    contenu:
      "Les ateliers de formation au numérique et à l'intelligence artificielle m'ont permis d'automatiser nos outils de gestion et d'offrir des services de pointe aux PME locales. Casa Impact prouve que l'excellence technologique s'enracine en région.",
    photo: "/assets/team/cherif-aliou-sonko.jpg",
    programme_id: 2,
    programme: mockPrograms[1],
    statut: "publie",
    ordre: 4,
    created_at: "2026-02-01T08:30:00Z",
    updated_at: "2026-02-10T11:00:00Z",
  },
  {
    id: 5,
    auteur: "Seynabou Bodian",
    fonction: "Responsable Valorisation Culturelle",
    organisation: "Collectif Mémoire & Arts • Sédhiou",
    contenu:
      "Rejoindre cette dynamique a transformé notre vision de l'engagement associatif. Casa Impact offre une vraie plateforme d'écoute et des ressources concrètes pour transformer nos idées culturelles en projets durables et créateurs d'emplois.",
    photo: "/assets/team/seynabou-bodian.jpg",
    programme_id: 3,
    programme: mockPrograms[2],
    statut: "publie",
    ordre: 5,
    created_at: "2026-02-12T14:00:00Z",
    updated_at: "2026-02-15T16:30:00Z",
  },
  {
    id: 6,
    auteur: "Pascaline Santos",
    fonction: "Animatrice Territoriale & Entrepreneuriat Féminin",
    organisation: "Réseau Leadership Kolda",
    contenu:
      "La force de Casa Impact réside dans son ancrage authentique : les trois régions avancent ensemble. Les formations intensives dispensées à Kolda ont permis à des dizaines de jeunes femmes de créer leurs propres micro-entreprises.",
    photo: "/assets/team/pascaline-santos.jpg",
    programme_id: 1,
    programme: mockPrograms[0],
    statut: "publie",
    ordre: 6,
    created_at: "2026-02-18T09:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
  },
]
