/**
 * Casa Impact - Données institutionnelles officielles
 * 
 * Ce fichier regroupe les constantes et informations de référence de l'organisation.
 */

export const siteIdentity = {
  nom: "Casa Impact",
  sigle: "CI",
  baseline: "Révéler les potentiels, transformer les terroirs",
  description:
    "Organisation citoyenne et territoriale fédérant Ziguinchor, Sédhiou et Kolda pour faire de la jeunesse et des terroirs le moteur du développement durable de la Casamance.",
  devise: "Inspirer • Former • Entreprendre • Transformer",
  siege: "Ziguinchor, Casamance, Sénégal",
  anneeCreation: 2025,
  territoire: "Casamance (Ziguinchor, Sédhiou, Kolda)",
  couleurs: {
    foret: "#02542D",
    or: "#F2A20D",
    terre: "#B85D19",
    sable: "#F5F0EB",
  },
  intro:
    "Casa Impact est une organisation dédiée au développement économique, social et culturel de la Casamance, articulée autour de la jeunesse et des terroirs.",
  vision:
    "Faire de la Casamance un pôle de développement durable, d'innovation et d'attractivité porté par une jeunesse épanouie et engagée.",
  mission:
    "Fédérer, former et accompagner les jeunes de la Casamance pour révéler leur potentiel, encourager l'entrepreneuriat et valoriser les richesses territoriales.",
  objectif:
    "Transformer durablement les terroirs de Ziguinchor, Sédhiou et Kolda en créant des opportunités d'emploi, de cohésion et d'investissement local.",
  conclusion:
    "Ensemble, bâtissons une Casamance forte, prospère et fière de ses terroirs.",
} as const

export const institution = siteIdentity

export const missions = [
  {
    titre: "Former et autonomiser la jeunesse",
    description:
      "Développer des programmes d'excellence, de leadership et de formation pratique adaptés aux besoins réels de la Casamance.",
  },
  {
    titre: "Stimuler l'entrepreneuriat et l'innovation locale",
    description:
      "Accompagner la création d'entreprises, valoriser les filières agro-pastorales, artisanales et technologiques.",
  },
  {
    titre: "Fédérer les trois régions",
    description:
      "Créer une dynamique trans-régionale unissant Ziguinchor, Sédhiou et Kolda dans une vision partagée.",
  },
  {
    titre: "Mobiliser la diaspora et les partenaires",
    description:
      "Connecter les compétences, ressources et énergies de la diaspora et des partenaires internationaux au service du développement local.",
  },
] as const

export const valeurs = [
  {
    nom: "Engagement",
    description:
      "Une implication sincère et durable au service du territoire et de sa jeunesse.",
  },
  {
    nom: "Leadership",
    description:
      "Former des jeunes capables de prendre des responsabilités et d'inspirer le changement.",
  },
  {
    nom: "Innovation",
    description:
      "Encourager la créativité, le numérique et les nouvelles idées au service du développement.",
  },
  {
    nom: "Solidarité",
    description:
      "Agir ensemble, dans l'entraide et le partage entre les trois régions.",
  },
  {
    nom: "Excellence",
    description:
      "Viser la qualité et la rigueur dans chaque initiative portée par l'organisation.",
  },
  {
    nom: "Inclusion",
    description:
      "Faire une place à chacun, sans distinction, dans la dynamique de transformation.",
  },
  {
    nom: "Développement durable",
    description:
      "Construire un avenir respectueux des ressources, des écosystèmes et des générations futures.",
  },
] as const

/** Domaines d'intervention officiels */
export const domainesIntervention = [
  {
    slug: "jeunesse-et-leadership",
    nom: "Jeunesse et leadership",
    resume:
      "Former et accompagner les jeunes vers la prise de responsabilité et le leadership positif.",
    description:
      "Casa Impact place la jeunesse au cœur de son action : développement personnel, leadership, engagement citoyen et prise de responsabilité pour faire des jeunes des acteurs majeurs de la transformation de leur territoire.",
  },
  {
    slug: "entrepreneuriat-et-innovation",
    nom: "Entrepreneuriat et innovation",
    resume:
      "Encourager l'entrepreneuriat, l'innovation, le numérique et l'intelligence artificielle.",
    description:
      "Soutenir la création de valeur locale à travers l'entrepreneuriat, l'innovation, le numérique, l'intelligence artificielle et la cybersécurité, pour favoriser l'auto-emploi et l'émergence de nouvelles initiatives.",
  },
  {
    slug: "culture-et-patrimoine",
    nom: "Culture et patrimoine",
    resume:
      "Promouvoir la culture, le patrimoine et les valeurs de la Casamance.",
    description:
      "Valoriser la richesse culturelle et patrimoniale de la Casamance, promouvoir ses traditions et ses talents créatifs, et en faire un moteur de rayonnement et de cohésion.",
  },
  {
    slug: "sport-et-promotion-des-talents",
    nom: "Sport et promotion des talents",
    resume:
      "Soutenir les talents et le sport comme leviers de développement.",
    description:
      "Mettre en lumière les champions et les talents du territoire, faire du sport un vecteur d'éducation, de discipline et de développement pour la jeunesse casamançaise.",
  },
  {
    slug: "tourisme-et-attractivite-territoriale",
    nom: "Tourisme et attractivité territoriale",
    resume:
      "Développer le tourisme local et renforcer l'attractivité du territoire.",
    description:
      "Développer le tourisme local et l'attractivité de la Casamance, révéler la beauté de ses territoires et créer des opportunités économiques autour de son potentiel unique.",
  },
  {
    slug: "investissement-et-diaspora",
    nom: "Investissement et diaspora",
    resume:
      "Attirer les investisseurs et mobiliser la diaspora autour du territoire.",
    description:
      "Créer un pont entre la Casamance, les investisseurs et la diaspora, mobiliser les compétences et les ressources pour financer et accompagner le développement du territoire.",
  },
  {
    slug: "sensibilisation-environnementale",
    nom: "Sensibilisation environnementale",
    resume:
      "Protéger la biodiversité, reboiser la Casamance et éveiller les consciences écologiques citoyennes.",
    description:
      "Sensibiliser les jeunes et les communautés à la préservation des écosystèmes exceptionnels de la Casamance (mangroves, forêts, fleuves), promouvoir le reboisement et les pratiques éco-responsables durables.",
  },
] as const

/** Activités prévues */
export const activitesPrevues = [
  {
    nom: "Masterclass",
    description:
      "Sessions d'apprentissage animées par des experts sur le leadership, le numérique et l'entrepreneuriat.",
  },
  {
    nom: "Formations professionnelles",
    description:
      "Renforcement de compétences pratiques pour l'insertion et l'auto-emploi des jeunes.",
  },
  {
    nom: "Caravanes de sensibilisation",
    description:
      "Aller à la rencontre des communautés des trois régions pour sensibiliser et mobiliser.",
  },
  {
    nom: "Forums économiques",
    description:
      "Rencontres entre acteurs économiques, investisseurs et diaspora autour du potentiel local.",
  },
  {
    nom: "Journées culturelles",
    description:
      "Célébration du patrimoine et des expressions culturelles de la Casamance.",
  },
  {
    nom: "Compétitions sportives",
    description:
      "Valorisation des talents sportifs et promotion du sport comme levier de développement.",
  },
  {
    nom: "Rencontres entrepreneuriales",
    description:
      "Espaces d'échange et de mise en relation pour porteurs de projets et entrepreneurs.",
  },
  {
    nom: "Chantiers de reboisement & écologie",
    description:
      "Actions collectives citoyennes de plantation d'arbres, sauvegarde des mangroves et assainissement des terroirs.",
  },
] as const

/** Impact attendu */
export const impactAttendu = [
  {
    titre: "Réduire le chômage des jeunes",
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
    titre: "Valoriser les talents locaux",
    description:
      "Mettre en lumière les créateurs, entrepreneurs et champions qui font rayonner le territoire.",
  },
  {
    titre: "Préserver les écosystèmes et le climat",
    description:
      "Régénérer le couvert végétal et ancrer une culture éco-responsable durable auprès des générations montantes.",
  },
] as const

export const president = {
  nom: "Toumany Badiane",
  fonction: "Président Fondateur",
  origine: "Ziguinchor • Département de Bignona • Commune de Coubalan",
  photo: "/assets/team/toumany-badiane.jpg",
  citation:
    "L'avenir de la Casamance ne se construira pas sans sa jeunesse.",
  signature: "Inspirer • Former • Entreprendre • Transformer",
  message: [
    "Chers jeunes, chers partenaires, chers amis de la Casamance,",
    "Casa Impact est née d'une conviction profonde : la Casamance possède un potentiel exceptionnel, et sa plus grande richesse est sa jeunesse.",
    "De Ziguinchor à Kolda, en passant par Sédhiou, notre territoire regorge de talents, d'entrepreneurs, de créateurs, de leaders et d'acteurs engagés qui contribuent chaque jour à faire avancer leurs communautés.",
    "Notre ambition est de révéler ce potentiel et de créer un cadre où chaque jeune peut se former, entreprendre, innover et agir pour son territoire.",
    "La Casamance a besoin de ses fils et de ses filles. À nous d'écrire ensemble la suite de son histoire.",
  ],
} as const

export const territoires = [
  {
    nom: "Ziguinchor",
    description:
      "Porte d'entrée de la Casamance, Ziguinchor se distingue par son riche potentiel culturel, économique et humain. Un territoire porté par une jeunesse créative, ambitieuse et engagée dans le développement local.",
  },
  {
    nom: "Sédhiou",
    description:
      "Territoire de traditions et d'opportunités, pleinement associé à la dynamique des trois régions.",
  },
  {
    nom: "Kolda",
    description:
      "Région à fort potentiel agricole et humain, riche de sa jeunesse et de ses talents.",
  },
] as const
