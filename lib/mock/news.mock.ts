// DEMO ONLY — replace with API data
import type { News } from "@/types/models"

/**
 * Données de DÉMONSTRATION pour les Actualités de Casa Impact.
 */
export const mockNews: News[] = [
  // DEMO ONLY — replace with API data
  {
    id: 1,
    titre: "Lancement officiel de la plateforme Casa Impact",
    slug: "lancement-officiel-casa-impact",
    extrait:
      "Casa Impact réunit les énergies positives des trois régions de la Casamance autour d'une vision commune de transformation territoriale.",
    contenu:
      "Casa Impact marque le début d'une dynamique nouvelle pour la Casamance : fédérer Ziguinchor, Kolda et Sédhiou autour d'une plateforme d'action, d'innovation et de transformation sociale au service de la jeunesse et des communautés locales.\n\nCe lancement concrétise des mois de concertation avec les acteurs institutionnels, la société civile et les porteurs de projets engagés pour le développement durable du territoire.",
    type: "annonce",
    date_publication: "2025-11-15T09:00:00Z",
    a_la_une: true,
    statut: "publie",
    auteur: "Coordination Générale",
    vues_count: 1420,
    created_at: "2025-11-10T10:00:00Z",
    updated_at: "2025-11-15T09:00:00Z",
  },
  {
    id: 2,
    titre: "Immersion & Rencontre avec la Jeunesse de Ziguinchor",
    slug: "immersion-rencontre-jeunesse-ziguinchor",
    extrait:
      "Un temps fort d'échange autour du leadership, de l'entrepreneuriat et de l'engagement citoyen avec plus de 150 jeunes participants.",
    contenu:
      "L'équipe de Casa Impact est allée à la rencontre des jeunes leaders et étudiants de Ziguinchor pour écouter leurs aspirations concrètes et co-construire les priorités des prochains parcours d'accompagnement.\n\nLes débats ont notamment porté sur la valorisation des compétences locales, l'accès aux opportunités numériques et la gouvernance citoyenne.",
    type: "compte-rendu",
    date_publication: "2025-12-02T14:30:00Z",
    a_la_une: false,
    statut: "publie",
    auteur: "Pôle Capital Humain",
    vues_count: 890,
    created_at: "2025-12-01T11:00:00Z",
    updated_at: "2025-12-02T14:30:00Z",
  },
  {
    id: 3,
    titre: "Ouverture des Candidatures pour l'Académie du Leadership",
    slug: "ouverture-candidatures-academie-leadership",
    extrait:
      "Les candidatures pour la première promotion 2026 de l'Académie du Leadership Jeune sont désormais ouvertes sur la plateforme.",
    contenu:
      "Casa Impact lance son appel à candidatures à destination des jeunes femmes et hommes âgés de 18 à 35 ans résidant à Ziguinchor, Kolda ou Sédhiou.\n\nCe parcours immersif de six mois permettra aux bénéficiaires de structurer leurs initiatives, d'acquérir des outils avancés de gestion de projet et d'intégrer un réseau actif de mentors.",
    type: "communique",
    date_publication: "2026-01-10T08:00:00Z",
    a_la_une: true,
    statut: "publie",
    auteur: "Commission Sélection",
    vues_count: 2150,
    created_at: "2026-01-08T16:00:00Z",
    updated_at: "2026-01-10T08:00:00Z",
  },
  {
    id: 4,
    titre: "Forum Économie Verte & Agriculture Innovante à Kolda",
    slug: "forum-economie-verte-agriculture-kolda",
    extrait:
      "Restitution des ateliers territoriaux dédiés aux circuits courts agro-écologiques et à l'autonomisation des coopératives rurales.",
    contenu:
      "Organisé en partenariat avec les acteurs du monde agricole, ce forum a mis en relief le potentiel agro-industriel et environnemental de la région de Kolda.\n\nPlusieurs solutions de valorisation des produits du terroir et d'adoption des énergies solaires ont été présentées par de jeunes entrepreneurs innovants.",
    type: "article",
    date_publication: "2026-01-28T10:00:00Z",
    a_la_une: false,
    statut: "publie",
    auteur: "Pôle Économie & Attractivité",
    vues_count: 640,
    created_at: "2026-01-25T14:00:00Z",
    updated_at: "2026-01-28T10:00:00Z",
  },
  {
    id: 5,
    titre: "Valorisation du Patrimoine et des Traditions de Sédhiou",
    slug: "valorisation-patrimoine-traditions-sedhiou",
    extrait:
      "Projet d'inventaire culturel et de numérisation des récits oraux du Pakao et du Balantacounda.",
    contenu:
      "Ce projet initié par le Pôle Culture vise à documenter la richesse patrimoniale de Sédhiou, à soutenir les artisans locaux et à promouvoir le tourisme de mémoire respectueux des communautés.",
    type: "article",
    statut: "brouillon",
    auteur: "Pôle Culture & Communication",
    vues_count: 0,
    created_at: "2026-02-12T09:00:00Z",
    updated_at: "2026-02-15T11:30:00Z",
  },
  {
    id: 6,
    titre: "La Diaspora Casamançaise au Cœur des Projets Territoriaux",
    slug: "diaspora-casamancaise-projets-territoriaux",
    extrait:
      "Mise en place d'un réseau international de mentorat reliant les compétences expatriées aux porteurs de projets locaux.",
    contenu:
      "La mobilisation de la diaspora constitue un levier stratégique majeur pour Casa Impact. Cet article détaille les modalités d'adhésion, de mentorat à distance et de co-investissement solidaire.",
    type: "article",
    statut: "previsualisation",
    auteur: "Cellule Diaspora",
    vues_count: 0,
    created_at: "2026-02-18T15:00:00Z",
    updated_at: "2026-02-20T17:00:00Z",
  },
]
