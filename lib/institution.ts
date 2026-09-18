/**
 * Contenu institutionnel officiel de Casa Impact.
 * Textes repris exactement du brief — ne pas paraphraser vision / mission / mot du Président.
 */

export const institution = {
  intro:
    "Casa Impact est une organisation engagée pour le développement durable et inclusif de la Casamance. Elle a été créée avec l'ambition de fédérer les énergies positives des trois régions naturelles de la Casamance : Ziguinchor, Sédhiou et Kolda. Casa Impact se veut une plateforme d'action, d'innovation et de transformation sociale au service de la jeunesse et des communautés.",
  conclusion:
    "Casa Impact est une plateforme d'action, d'engagement citoyen et d'innovation pour l'avenir de la Casamance.",
  vision:
    "Faire de la Casamance un territoire de référence en Afrique en matière de développement territorial, d'entrepreneuriat, de leadership jeune, de culture et d'investissement.",
  mission:
    "Casa Impact a pour mission de former et accompagner les jeunes, encourager l'entrepreneuriat et l'innovation, promouvoir la culture et les valeurs de la Casamance, développer le tourisme local, soutenir les talents et attirer les investisseurs et la diaspora.",
  objectif:
    "Contribuer au développement économique, social, culturel et touristique de la Casamance à travers des initiatives innovantes portées par la jeunesse, tout en renforçant la sensibilisation, la protection et la préservation de l’environnement.",
} as const

export const valeurs = [
  {
    nom: 'Engagement',
    description:
      "Une implication sincère et durable au service du territoire et de sa jeunesse.",
  },
  {
    nom: 'Leadership',
    description:
      "Former des jeunes capables de prendre des responsabilités et d'inspirer le changement.",
  },
  {
    nom: 'Innovation',
    description:
      "Encourager la créativité, le numérique et les nouvelles idées au service du développement.",
  },
  {
    nom: 'Solidarité',
    description:
      "Agir ensemble, dans l'entraide et le partage entre les trois régions.",
  },
  {
    nom: 'Excellence',
    description:
      "Viser la qualité et la rigueur dans chaque initiative portée par l'organisation.",
  },
  {
    nom: 'Inclusion',
    description:
      "Faire une place à chacun, sans distinction, dans la dynamique de transformation.",
  },
  {
    nom: 'Développement durable',
    description:
      "Construire un avenir respectueux des ressources et des générations futures.",
  },
] as const

/** Domaines d'intervention officiels (≠ pôles organisationnels). */
export const domainesIntervention = [
  {
    slug: 'jeunesse-et-leadership',
    nom: 'Jeunesse et leadership',
    resume:
      "Former et accompagner les jeunes vers la prise de responsabilité et le leadership positif.",
    description:
      "Casa Impact place la jeunesse au cœur de son action : développement personnel, leadership, engagement citoyen et prise de responsabilité pour faire des jeunes des acteurs majeurs de la transformation de leur territoire.",
  },
  {
    slug: 'entrepreneuriat-et-innovation',
    nom: 'Entrepreneuriat et innovation',
    resume:
      "Encourager l'entrepreneuriat, l'innovation, le numérique et l'intelligence artificielle.",
    description:
      "Soutenir la création de valeur locale à travers l'entrepreneuriat, l'innovation, le numérique, l'intelligence artificielle et la cybersécurité, pour favoriser l'auto-emploi et l'émergence de nouvelles initiatives.",
  },
  {
    slug: 'culture-et-patrimoine',
    nom: 'Culture et patrimoine',
    resume:
      "Promouvoir la culture, le patrimoine et les valeurs de la Casamance.",
    description:
      "Valoriser la richesse culturelle et patrimoniale de la Casamance, promouvoir ses traditions et ses talents créatifs, et en faire un moteur de rayonnement et de cohésion.",
  },
  {
    slug: 'sport-et-promotion-des-talents',
    nom: 'Sport et promotion des talents',
    resume:
      "Soutenir les talents et le sport comme leviers de développement.",
    description:
      "Mettre en lumière les champions et les talents du territoire, faire du sport un vecteur d'éducation, de discipline et de développement pour la jeunesse casamançaise.",
  },
  {
    slug: 'tourisme-et-attractivite-territoriale',
    nom: 'Tourisme et attractivité territoriale',
    resume:
      "Développer le tourisme local et renforcer l'attractivité du territoire.",
    description:
      "Développer le tourisme local et l'attractivité de la Casamance, révéler la beauté de ses territoires et créer des opportunités économiques autour de son potentiel unique.",
  },
  {
    slug: 'investissement-et-diaspora',
    nom: 'Investissement et diaspora',
    resume:
      "Attirer les investisseurs et mobiliser la diaspora autour du territoire.",
    description:
      "Créer un pont entre la Casamance, les investisseurs et la diaspora, mobiliser les compétences et les ressources pour financer et accompagner le développement du territoire.",
  },
] as const

/** Activités PRÉVUES — ne jamais présenter comme déjà réalisées. */
export const activitesPrevues = [
  {
    nom: 'Masterclass',
    description:
      "Sessions d'apprentissage animées par des experts sur le leadership, le numérique et l'entrepreneuriat.",
  },
  {
    nom: 'Formations professionnelles',
    description:
      "Renforcement de compétences pratiques pour l'insertion et l'auto-emploi des jeunes.",
  },
  {
    nom: 'Caravanes de sensibilisation',
    description:
      "Aller à la rencontre des communautés des trois régions pour sensibiliser et mobiliser.",
  },
  {
    nom: 'Forums économiques',
    description:
      "Rencontres entre acteurs économiques, investisseurs et diaspora autour du potentiel local.",
  },
  {
    nom: 'Journées culturelles',
    description:
      "Célébration du patrimoine et des expressions culturelles de la Casamance.",
  },
  {
    nom: 'Compétitions sportives',
    description:
      "Valorisation des talents sportifs et promotion du sport comme levier de développement.",
  },
  {
    nom: 'Rencontres entrepreneuriales',
    description:
      "Espaces d'échange et de mise en relation pour porteurs de projets et entrepreneurs.",
  },
] as const

/** Impact ATTENDU — pas des statistiques, ne jamais chiffrer. */
export const impactAttendu = [
  {
    titre: 'Réduire le chômage des jeunes',
    description:
      "Accompagner l'insertion professionnelle et l'employabilité de la jeunesse casamançaise.",
  },
  {
    titre: "Favoriser l'auto-emploi",
    description:
      "Susciter la création d'activités et d'entreprises portées par les jeunes du territoire.",
  },
  {
    titre: "Renforcer l'attractivité de la Casamance",
    description:
      "Faire de la Casamance un territoire attractif pour le tourisme, l'investissement et la diaspora.",
  },
  {
    titre: 'Valoriser les talents locaux',
    description:
      "Mettre en lumière les créateurs, entrepreneurs et champions qui font rayonner le territoire.",
  },
] as const

export const president = {
  nom: 'Toumany Badiane',
  fonction: 'Président Fondateur',
  origine: 'Ziguinchor · Département de Bignona · Commune de Coubalan',
  photo: '/assets/team/toumany-badiane.jpg',
  citation:
    "L'avenir de la Casamance ne se construira pas sans sa jeunesse.",
  signature: 'Inspirer • Former • Entreprendre • Transformer',
  // Version raccourcie du mot du Président (accord explicite du
  // 2026-09-16 : "l'autre texte est trop long") — remplace l'ancienne
  // version plus longue ci-dessus. Le nom/la fonction ne sont PAS répétés
  // ici : about-sections.tsx les affiche déjà séparément après le message
  // (via president.nom / president.fonction), donc "Toumany Badiane —
  // Président Fondateur" fourni par l'utilisateur en fin de texte n'est
  // volontairement pas dupliqué dans ce tableau.
  message: [
    'Chers jeunes, chers partenaires, chers amis de la Casamance,',
    "Casa Impact est née d'une conviction profonde : la Casamance possède un potentiel exceptionnel, et sa plus grande richesse est sa jeunesse.",
    "De Ziguinchor à Kolda, en passant par Sédhiou, notre territoire regorge de talents, d'entrepreneurs, de créateurs, de leaders et d'acteurs engagés qui contribuent chaque jour à faire avancer leurs communautés.",
    "Notre ambition est de révéler ce potentiel et de créer un cadre où chaque jeune peut se former, entreprendre, innover et agir pour son territoire.",
    "La Casamance a besoin de ses fils et de ses filles. À nous d'écrire ensemble la suite de son histoire.",
  ],
} as const

export const territoires = [
  {
    nom: 'Ziguinchor',
    description:
      "Porte d’entrée de la Casamance, Ziguinchor se distingue par son riche potentiel culturel, économique et humain. Un territoire porté par une jeunesse créative, ambitieuse et engagée dans le développement local.",
  },
  {
    nom: 'Sédhiou',
    description:
      "Territoire de traditions et d'opportunités, pleinement associé à la dynamique des trois régions.",
  },
  {
    nom: 'Kolda',
    description:
      "Région à fort potentiel agricole et humain, riche de sa jeunesse et de ses talents.",
  },
] as const
