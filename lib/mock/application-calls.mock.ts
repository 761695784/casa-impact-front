// DEMO ONLY — replace with API data
import type { ApplicationCall } from '@/types/models'
import { mockPrograms } from './programs.mock'

export const mockApplicationCalls: ApplicationCall[] = [
  // DEMO ONLY — replace with API data
  {
    id: 1,
    titre: 'Cohorte 2026 — Académie du Leadership Jeune',
    slug: 'cohorte-2026-academie-leadership',
    resume:
      "Appel à candidatures pour rejoindre la nouvelle promotion de l'Académie du Leadership Jeune.",
    description:
      "Casa Impact ouvre les candidatures pour la prochaine cohorte de son Académie du Leadership Jeune. Ce programme s'adresse aux jeunes engagés souhaitant renforcer leurs compétences en leadership, gouvernance locale et conduite de projets à fort impact territorial.",
    region: 'ziguinchor',
    localisation: 'Ziguinchor (Campus Numérique & Territorial)',
    date_ouverture: '2026-01-10',
    date_limite: '2026-03-31',
    nombre_places: 40,
    candidatures_count: 32,
    programme_id: 1,
    programme: mockPrograms[0],
    documents_requis: [
      { cle: 'cv', libelle: 'Curriculum Vitae', requis: true, formats: ['pdf'], taille_max: 5 },
      {
        cle: 'lettre_motivation',
        libelle: 'Lettre de motivation',
        requis: true,
        formats: ['pdf', 'doc', 'docx'],
        taille_max: 5,
      },
      { cle: 'piece_identite', libelle: "Pièce d'identité (CNI/Passeport)", requis: true, formats: ['pdf', 'jpg', 'png'], taille_max: 5 },
    ],
    image: '/images/hero-leadership.jpg',
    statut: 'publie',
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-01-10T12:00:00Z',
  },
  {
    id: 2,
    titre: 'Appel à projets — Incubateur Entrepreneuriat & Innovation',
    slug: 'appel-projets-incubateur-entrepreneuriat',
    resume:
      "Vous portez un projet à impact en Casamance ? Candidatez pour intégrer notre incubateur territorial.",
    description:
      "L'incubateur Entrepreneuriat & Innovation de Casa Impact accompagne les porteurs de projets à vocation économique, agro-écologique et numérique. Cet appel s'adresse aux entrepreneurs des trois régions de Casamance.",
    region: 'kolda',
    localisation: 'Kolda & Sédhiou',
    date_ouverture: '2026-01-15',
    date_limite: '2026-04-15',
    nombre_places: 25,
    candidatures_count: 18,
    programme_id: 2,
    programme: mockPrograms[1],
    documents_requis: [
      { cle: 'cv', libelle: 'Curriculum Vitae du porteur', requis: true, formats: ['pdf'], taille_max: 5 },
      {
        cle: 'presentation_projet',
        libelle: 'Présentation du projet / Business Model Canvas',
        requis: true,
        formats: ['pdf', 'ppt', 'pptx'],
        taille_max: 10,
      },
    ],
    image: '/images/hero-incubateur.jpg',
    statut: 'publie',
    created_at: '2026-01-12T10:30:00Z',
    updated_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 3,
    titre: 'Tremplin Créatif — Festival des Talents de la Casamance 2026',
    slug: 'tremplin-creatif-festival-talents-2026',
    resume:
      "Appel à participation artistique et artisanale pour la 3ème édition du Festival des Talents.",
    description:
      "Sélection des créateurs, designers textiles, musiciens et artisans pour les scènes d'exposition et les masterclasses culturelles du Festival des Talents.",
    region: 'sedhiou',
    localisation: 'Sédhiou (Centre Culturel)',
    date_ouverture: '2026-03-01',
    date_limite: '2026-05-15',
    nombre_places: 50,
    candidatures_count: 0,
    programme_id: 3,
    programme: mockPrograms[2],
    documents_requis: [
      { cle: 'portfolio', libelle: 'Portfolio artistique / Photos créations', requis: true, formats: ['pdf', 'jpg', 'png'], taille_max: 15 },
      { cle: 'biographie', libelle: 'Notice biographique', requis: false, formats: ['pdf', 'doc'], taille_max: 5 },
    ],
    image: '/images/hero-festival.jpg',
    statut: 'brouillon',
    created_at: '2026-02-15T14:00:00Z',
    updated_at: '2026-02-20T16:45:00Z',
  },
  {
    id: 4,
    titre: 'Bourses d’Excellence Numérique — Promotion 2025',
    slug: 'bourses-excellence-numerique-2025',
    resume:
      "Session close — 30 bourses d'insertion aux métiers de la tech distribuées en Casamance.",
    description:
      "Programme de bourses complètes financé avec nos partenaires pour former des développeurs et analystes de données issus des trois régions.",
    region: 'ziguinchor',
    localisation: 'Ziguinchor, Kolda, Sédhiou',
    date_ouverture: '2025-08-01',
    date_limite: '2025-10-31',
    nombre_places: 30,
    candidatures_count: 142,
    programme_id: 1,
    programme: mockPrograms[0],
    documents_requis: [
      { cle: 'cv', libelle: 'Curriculum Vitae', requis: true, formats: ['pdf'], taille_max: 5 },
      { cle: 'diplomes', libelle: 'Relevés de notes ou diplômes', requis: true, formats: ['pdf'], taille_max: 5 },
    ],
    image: '/images/hero-numerique.jpg',
    statut: 'ferme',
    created_at: '2025-07-20T11:00:00Z',
    updated_at: '2025-11-01T00:00:00Z',
  },
]
