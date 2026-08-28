// DEMO ONLY — replace with API data
import type { Domain } from "@/types/models"
import { domainesIntervention } from "@/lib/institution"

/**
 * Données de DÉMONSTRATION dérivées des 6 domaines d'intervention officiels de Casa Impact.
 * La nomenclature institutionnelle ne doit jamais être modifiée.
 */
export const mockDomains: Domain[] = [
  // DEMO ONLY — replace with API data
  {
    id: 1,
    nom: "Jeunesse et leadership",
    slug: "jeunesse-et-leadership",
    resume:
      "Former et accompagner les jeunes vers la prise de responsabilité et le leadership positif.",
    description:
      "Casa Impact place la jeunesse au cœur de son action : développement personnel, leadership, engagement citoyen et prise de responsabilité pour faire des jeunes des acteurs majeurs de la transformation de leur territoire.",
    statut: "actif",
    ordre: 1,
    programmes_count: 2,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-10T12:00:00Z",
  },
  {
    id: 2,
    nom: "Entrepreneuriat et innovation",
    slug: "entrepreneuriat-et-innovation",
    resume:
      "Encourager l'entrepreneuriat, l'innovation, le numérique et l'intelligence artificielle.",
    description:
      "Soutenir la création de valeur locale à travers l'entrepreneuriat, l'innovation, le numérique, l'intelligence artificielle et la cybersécurité, pour favoriser l'auto-emploi et l'émergence de nouvelles initiatives.",
    statut: "actif",
    ordre: 2,
    programmes_count: 1,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-15T08:00:00Z",
  },
  {
    id: 3,
    nom: "Culture et patrimoine",
    slug: "culture-et-patrimoine",
    resume:
      "Promouvoir la culture, le patrimoine et les valeurs de la Casamance.",
    description:
      "Valoriser la richesse culturelle et patrimoniale de la Casamance, promouvoir ses traditions et ses talents créatifs, et en faire un moteur de rayonnement et de cohésion.",
    statut: "actif",
    ordre: 3,
    programmes_count: 1,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
  },
  {
    id: 4,
    nom: "Sport et promotion des talents",
    slug: "sport-et-promotion-des-talents",
    resume:
      "Soutenir les talents et le sport comme leviers de développement.",
    description:
      "Mettre en lumière les champions et les talents du territoire, faire du sport un vecteur d'éducation, de discipline et de développement pour la jeunesse casamançaise.",
    statut: "actif",
    ordre: 4,
    programmes_count: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-20T14:00:00Z",
  },
  {
    id: 5,
    nom: "Tourisme et attractivité territoriale",
    slug: "tourisme-et-attractivite-territoriale",
    resume:
      "Développer le tourisme local et renforcer l'attractivité du territoire.",
    description:
      "Développer le tourisme local et l'attractivité de la Casamance, révéler la beauté de ses territoires et créer des opportunités économiques autour de son potentiel unique.",
    statut: "actif",
    ordre: 5,
    programmes_count: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-02-10T09:30:00Z",
  },
  {
    id: 6,
    nom: "Investissement et diaspora",
    slug: "investissement-et-diaspora",
    resume:
      "Attirer les investisseurs et mobiliser la diaspora autour du territoire.",
    description:
      "Créer un pont entre la Casamance, les investisseurs et la diaspora, mobiliser les compétences et les ressources pour financer et accompagner le développement du territoire.",
    statut: "actif",
    ordre: 6,
    programmes_count: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-25T11:00:00Z",
  },
]
