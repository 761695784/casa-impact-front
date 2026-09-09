// DEMO ONLY — replace with API data
import type { Program, ProgramType } from "@/types/models"
import { mockDomains } from "./domains.mock"

/**
 * Données de DÉMONSTRATION pour les Types de programme.
 */
export const mockProgramTypes: ProgramType[] = [
  // DEMO ONLY — replace with API data
  {
    id: 1,
    nom: "Formation & Renforcement",
    slug: "formation-et-renforcement",
    description: "Parcours pédagogiques, masterclasses et ateliers pratiques pour l'acquisition de compétences clés.",
    statut: "actif",
    ordre: 1,
    programmes_count: 2,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-10T12:00:00Z",
  },
  {
    id: 2,
    nom: "Accompagnement & Incubation",
    slug: "accompagnement-et-incubation",
    description: "Dispositifs d'appui continu, mentorat, prototypage et accélération de projets à impact.",
    statut: "actif",
    ordre: 2,
    programmes_count: 2,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-15T08:00:00Z",
  },
  {
    id: 3,
    nom: "Événement & Célébration",
    slug: "evenement-et-celebration",
    description: "Festivals, forums économiques, caravanes citoyennes et rencontres territoriales.",
    statut: "actif",
    ordre: 3,
    programmes_count: 2,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
  },
  {
    id: 4,
    nom: "Bourses & Insertion",
    slug: "bourses-et-insertion",
    description: "Soutien financier ciblé, bourses d'excellence et passerelles vers l'emploi durable.",
    statut: "actif",
    ordre: 4,
    programmes_count: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-02-15T14:00:00Z",
  },
]

/**
 * Données de DÉMONSTRATION pour les Programmes officiels.
 */
export const mockPrograms: Program[] = [
  // DEMO ONLY — replace with API data
  {
    id: 1,
    titre: "Académie du Leadership Jeune",
    slug: "academie-leadership-jeune",
    resume:
      "Un parcours d'excellence au leadership, au développement personnel et à l'engagement citoyen pour les jeunes des trois régions.",
    description:
      "L'Académie du Leadership Jeune accompagne des promotions de jeunes de Ziguinchor, Sédhiou et Kolda dans le développement de leurs compétences de leadership, de prise de parole en public et de conduite de projets à fort impact territorial.",
    domaine_id: 1,
    domaine: mockDomains[0],
    type_id: 1,
    type: mockProgramTypes[0],
    region: "ziguinchor",
    localisation: "Ziguinchor (Campus Territorial)",
    date_debut: "2026-01-10",
    date_fin: "2026-12-31",
    statut: "publie",
    appels_count: 2,
    beneficiaires_count: 70,
    image: "/assets/hero/DSC08048%20copie.jpg",
    created_at: "2025-01-05T09:00:00Z",
    updated_at: "2026-01-10T12:00:00Z",
  },
  {
    id: 2,
    titre: "Incubateur Entrepreneuriat & Innovation",
    slug: "incubateur-entrepreneuriat-innovation",
    resume:
      "Un dispositif d'accompagnement des porteurs de projets vers la création et la structuration de leur activité économique.",
    description:
      "L'incubateur soutient les entrepreneurs du territoire à travers le mentorat, la formation au numérique, l'accès au financement d'amorçage et les réseaux d'investissement et de la diaspora.",
    domaine_id: 2,
    domaine: mockDomains[1],
    type_id: 2,
    type: mockProgramTypes[1],
    region: "kolda",
    localisation: "Kolda & Sédhiou",
    date_debut: "2026-01-15",
    date_fin: "2026-12-31",
    statut: "publie",
    appels_count: 1,
    beneficiaires_count: 45,
    image: "/assets/hero/DSC08045%20copie.jpg",
    created_at: "2025-01-12T10:30:00Z",
    updated_at: "2026-01-15T08:00:00Z",
  },
  {
    id: 3,
    titre: "Festival des Talents de la Casamance",
    slug: "festival-des-talents-casamance",
    resume:
      "Une grande célébration annuelle de la culture, du patrimoine et des talents créatifs du territoire.",
    description:
      "Le festival met en lumière les artistes, artisans et créateurs de la Casamance à travers des scènes d'expression, des expositions itinérantes et des masterclasses patrimoniales.",
    domaine_id: 3,
    domaine: mockDomains[2],
    type_id: 3,
    type: mockProgramTypes[2],
    region: "sedhiou",
    localisation: "Sédhiou & Ziguinchor",
    date_debut: "2026-03-01",
    date_fin: "2026-05-30",
    statut: "publie",
    appels_count: 1,
    beneficiaires_count: 120,
    image: "/assets/hero/DSC08016%20copie.jpg",
    created_at: "2025-02-15T14:00:00Z",
    updated_at: "2026-02-20T16:45:00Z",
  },
  {
    id: 4,
    titre: "Tremplin Sport & Éducation",
    slug: "tremplin-sport-education",
    resume:
      "Faire du sport un vecteur d'insertion, de discipline et de cohésion sociale pour les jeunes casamançais.",
    description:
      "Soutien aux écoles de sport communautaires, formation d'éducateurs sportifs et organisation de tournois de détection dans les trois régions.",
    domaine_id: 4,
    domaine: mockDomains[3],
    type_id: 1,
    type: mockProgramTypes[0],
    region: "ziguinchor",
    localisation: "Bignona & Oussouye",
    date_debut: "2026-06-01",
    date_fin: "2026-11-30",
    statut: "publie",
    appels_count: 0,
    beneficiaires_count: 50,
    image: "/assets/hero/DSC08084%20copie.jpg",
    created_at: "2026-02-01T11:00:00Z",
    updated_at: "2026-02-10T14:00:00Z",
  },
  {
    id: 5,
    titre: "Éco-Tourisme & Terroirs de Casamance",
    slug: "eco-tourisme-terroirs-casamance",
    resume:
      "Accompagnement des acteurs du tourisme communautaire et valorisation des richesses naturelles du territoire.",
    description:
      "Structuration d'itinéraires éco-touristiques, numérisation de l'offre locale et accompagnement des campements villageois.",
    domaine_id: 5,
    domaine: mockDomains[4],
    type_id: 2,
    type: mockProgramTypes[1],
    region: "ziguinchor",
    localisation: "Cap Skirring & Kafountine",
    date_debut: "2026-07-01",
    date_fin: "2026-12-31",
    statut: "publie",
    appels_count: 0,
    beneficiaires_count: 30,
    image: "/assets/hero/casamance-landscape.png",
    created_at: "2026-02-05T09:00:00Z",
    updated_at: "2026-02-12T10:00:00Z",
  },
  {
    id: 6,
    titre: "Diaspora Connect & Invest Hub",
    slug: "diaspora-connect-invest-hub",
    resume:
      "Plateforme de mise en relation entre porteurs de projets locaux, investisseurs et compétences de la diaspora.",
    description:
      "Forum d'investissement annuel et programme de mentorat à distance reliant les professionnels de la diaspora aux initiatives territoriales.",
    domaine_id: 6,
    domaine: mockDomains[5],
    type_id: 3,
    type: mockProgramTypes[2],
    region: "kolda",
    localisation: "Kolda & Dakar",
    date_debut: "2025-05-01",
    date_fin: "2025-12-31",
    statut: "publie",
    appels_count: 0,
    beneficiaires_count: 200,
    image: "/assets/hero/DSC08011%20copie.jpg",
    created_at: "2025-04-10T08:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
]
