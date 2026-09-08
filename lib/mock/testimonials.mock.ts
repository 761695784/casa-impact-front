// DEMO ONLY — replace with API data
import type { Testimonial } from "@/types/models"
import { mockPrograms } from "./programs.mock"

/**
 * Données officielles et de démonstration pour les Témoignages de Casa Impact.
 * Chaque témoignage reflète l'impact concret sur les acteurs des 3 régions de Casamance.
 */
export const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    auteur: "Amina Diallo",
    role_organisation: "Bénéficiaire Académie Leadership • Ziguinchor",
    citation:
      "L'Académie du Leadership Jeune m'a permis de développer une réelle aisance oratoire et de structurer nos projets associatifs. Grâce au mentorat de Casa Impact, nous avons mobilisé plus de 150 jeunes pour des actions citoyennes dans le département de Bignona.",
    contexte: "Promotion 2025 • Académie du Leadership",
    program_id: 1,
    program: mockPrograms[0],
    statut: "publie",
    media: [
      {
        id: 101,
        collection: "testimonials",
        url: "/assets/team/fatoumata-drame.jpg",
        nom_original: "fatoumata-drame.jpg",
        mime: "image/jpeg",
        taille: 228841,
      },
    ],
    created_at: "2025-11-20T10:00:00Z",
    updated_at: "2026-01-10T12:00:00Z",
  },
  {
    id: 2,
    auteur: "Mamadou Lamine Sané",
    role_organisation: "Fondateur AgriTech Casamance • Kolda",
    citation:
      "Intégrer le parcours Entrepreneuriat & Innovation de Casa Impact a été le tournant décisif pour notre startup. Nous avons modernisé notre unité de transformation de mangues et sécurisé nos premiers débouchés commerciaux avec les producteurs locaux.",
    contexte: "Incubateur Territorial • Pôle Agro-écologie",
    program_id: 2,
    program: mockPrograms[1],
    statut: "publie",
    media: [
      {
        id: 102,
        collection: "testimonials",
        url: "/assets/team/abdou-khadre-djitte.jpg",
        nom_original: "abdou-khadre-djitte.jpg",
        mime: "image/jpeg",
        taille: 36976,
      },
    ],
    created_at: "2025-12-05T14:00:00Z",
    updated_at: "2026-01-15T09:30:00Z",
  },
  {
    id: 3,
    auteur: "Fatoumata Binetou Coly",
    role_organisation: "Artisane & Créatrice Textile • Sédhiou",
    citation:
      "Notre participation aux événements de promotion des talents a donné une visibilité exceptionnelle à notre artisanat textile en Casamance. C'est une immense fierté de voir notre patrimoine valorisé et commercialisé avec une telle exigence.",
    contexte: "Filière Artisanat d'Art • Coopérative des Femmes",
    program_id: 3,
    program: mockPrograms[2],
    statut: "publie",
    media: [
      {
        id: 103,
        collection: "testimonials",
        url: "/assets/team/felicite-binette-coly.jpg",
        nom_original: "felicite-binette-coly.jpg",
        mime: "image/jpeg",
        taille: 98284,
      },
    ],
    created_at: "2026-01-18T11:00:00Z",
    updated_at: "2026-01-20T16:00:00Z",
  },
  {
    id: 4,
    auteur: "Ousmane Badji",
    role_organisation: "Entrepreneur Numérique & IA • Ziguinchor",
    citation:
      "Les ateliers de formation au numérique et à l'intelligence artificielle m'ont permis d'automatiser nos outils de gestion et d'offrir des services de pointe aux PME locales. Casa Impact prouve que l'excellence technologique s'enracine en région.",
    contexte: "Hub Digital Casamance • Promotion Numérique",
    program_id: 2,
    program: mockPrograms[1],
    statut: "publie",
    media: [
      {
        id: 104,
        collection: "testimonials",
        url: "/assets/team/cherif-aliou-sonko.jpg",
        nom_original: "cherif-aliou-sonko.jpg",
        mime: "image/jpeg",
        taille: 367708,
      },
    ],
    created_at: "2026-02-01T08:30:00Z",
    updated_at: "2026-02-10T11:00:00Z",
  },
  {
    id: 5,
    auteur: "Seynabou Bodian",
    role_organisation: "Responsable Valorisation Culturelle • Sédhiou",
    citation:
      "Rejoindre cette dynamique a transformé notre vision de l'engagement associatif. Casa Impact offre une vraie plateforme d'écoute et des ressources concrètes pour transformer nos idées culturelles en projets durables et créateurs d'emplois.",
    contexte: "Collectif Mémoire & Arts • Promotion Culture",
    program_id: 3,
    program: mockPrograms[2],
    statut: "publie",
    media: [
      {
        id: 105,
        collection: "testimonials",
        url: "/assets/team/seynabou-bodian.jpg",
        nom_original: "seynabou-bodian.jpg",
        mime: "image/jpeg",
        taille: 364571,
      },
    ],
    created_at: "2026-02-12T14:00:00Z",
    updated_at: "2026-02-15T16:30:00Z",
  },
  {
    id: 6,
    auteur: "Pascaline Santos",
    role_organisation: "Animatrice Territoriale & Entrepreneuriat • Kolda",
    citation:
      "La force de Casa Impact réside dans son ancrage authentique : les trois régions avancent ensemble. Les formations intensives dispensées à Kolda ont permis à des dizaines de jeunes femmes de créer leurs propres micro-entreprises pérennes.",
    contexte: "Réseau Femmes Leaders • Session Kolda",
    program_id: 1,
    program: mockPrograms[0],
    statut: "publie",
    media: [
      {
        id: 106,
        collection: "testimonials",
        url: "/assets/team/pascaline-santos.jpg",
        nom_original: "pascaline-santos.jpg",
        mime: "image/jpeg",
        taille: 353594,
      },
    ],
    created_at: "2026-02-18T09:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
  },
]
