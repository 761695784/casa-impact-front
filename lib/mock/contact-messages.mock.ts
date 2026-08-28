// DEMO ONLY — replace with API data
import type { ContactMessage } from "@/types/models"

/**
 * Données de DÉMONSTRATION pour les Messages de Contact reçus depuis le site public.
 */
export const mockContactMessages: ContactMessage[] = [
  // DEMO ONLY — replace with API data
  {
    id: 201,
    nom: "Diallo",
    prenom: "Amadou",
    email: "amadou.diallo@invest-sn.org",
    telephone: "+221 77 123 45 67",
    categorie: "partenariat",
    sujet: "Proposition de partenariat technique — Formation Numérique",
    message:
      "Bonjour l'équipe Casa Impact, nous souhaitons explorer une convention pour équiper les jeunes des 3 pôles régionaux (Ziguinchor, Kolda, Sédhiou) en matériel informatique reconditionné et offrir des bourses de certification cloud. Pouvons-nous convenir d'un rendez-vous ?",
    statut: "nouveau",
    lu: false,
    notes_internes: "Transmis au responsable des partenariats pour proposition de convention.",
    created_at: "2026-08-28T13:45:00Z",
    updated_at: "2026-08-28T13:45:00Z",
  },
  {
    id: 202,
    nom: "Cissé",
    prenom: "Mariama",
    email: "cisse.mariama@diaspora-paris.fr",
    telephone: "+33 6 54 32 10 98",
    categorie: "diaspora",
    sujet: "Mobilisation diaspora Casamance en France",
    message:
      "Félicitations pour le lancement officiel de Casa Impact ! Je représente un collectif de 40 cadres et entrepreneurs originaires de Casamance basés en Île-de-France. Comment pouvons-nous structurer un point relais à Paris pour cofinancer les programmes agricoles ?",
    statut: "nouveau",
    lu: false,
    created_at: "2026-08-28T08:12:00Z",
    updated_at: "2026-08-28T08:12:00Z",
  },
  {
    id: 203,
    nom: "Ba",
    prenom: "Dr. Lamine",
    email: "l.ba@univ-zig.sn",
    telephone: "+221 70 987 65 43",
    categorie: "projet",
    sujet: "Contribution à la commission scientifique et aux jurys",
    message:
      "Cher comité Casa Impact, enseignant-chercheur à l'Université Assane Seck de Ziguinchor, je me tiens à votre disposition pour participer bénévolement aux comités d'évaluation des bourses d'excellence et à l'orientation des projets agroécologiques.",
    statut: "nouveau",
    lu: false,
    created_at: "2026-08-27T16:20:00Z",
    updated_at: "2026-08-27T16:20:00Z",
  },
  {
    id: 204,
    nom: "Sané",
    prenom: "Ousmane",
    email: "ousmane.sane@coop-kolda.sn",
    telephone: "+221 78 456 78 90",
    categorie: "information_generale",
    sujet: "Conditions d'éligibilité à l'incubateur Agri-Business",
    message:
      "Bonjour, notre groupement d'intérêt économique regroupe 35 maraîchères à Vélingara. Notre statut de coopérative est-il éligible à la Cohorte 2 de l'Incubateur Agri-Business ? Merci d'avance pour votre éclairage.",
    statut: "en_cours",
    lu: true,
    notes_internes: "Réponse envoyée par Mamadou Diallo avec le guide du candidat.",
    created_at: "2026-08-26T11:00:00Z",
    updated_at: "2026-08-26T14:30:00Z",
  },
  {
    id: 205,
    nom: "Badji",
    prenom: "Aïda",
    email: "aida.badji@journal-sud.sn",
    telephone: "+221 76 234 56 78",
    categorie: "autre",
    sujet: "Demande d'interview — Émission spéciale développement Sud",
    message:
      "Bonjour, dans le cadre d'un grand reportage sur les initiatives citoyennes en Casamance, nous souhaiterions interviewer le porte-parole de Casa Impact jeudi prochain. Pouvez-vous nous confirmer vos disponibilités ?",
    statut: "traite",
    lu: true,
    notes_internes: "Interview calée avec Aïssatou Sané (Com) pour jeudi 15h.",
    created_at: "2026-08-25T09:15:00Z",
    updated_at: "2026-08-25T16:00:00Z",
  },
  {
    id: 206,
    nom: "Ndiaye",
    prenom: "Abdoulaye",
    email: "a.ndiaye@fonds-impact.org",
    telephone: "+221 77 890 12 34",
    categorie: "investissement",
    sujet: "Revue de portefeuille de projets à impact — Ticket d'investissement",
    message:
      "Nous gérons un fonds d'amorçage pour les PME d'Afrique de l'Ouest. Nous aimerions recevoir la plaquette des lauréats des cohortes 2025/2026 pour étudier des co-investissements en quasi-fonds propres.",
    statut: "traite",
    lu: true,
    created_at: "2026-08-22T14:00:00Z",
    updated_at: "2026-08-23T10:00:00Z",
  },
]
