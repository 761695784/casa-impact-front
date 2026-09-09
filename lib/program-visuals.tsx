import {
  GraduationCap,
  Users,
  Rocket,
  Landmark,
  Trophy,
  Palmtree,
  HandCoins,
  type LucideIcon,
  Sparkles,
  Target,
  ShieldCheck,
  Zap,
  BookOpen,
  Award,
  Compass,
  Briefcase,
  Layers,
  HeartHandshake,
} from "lucide-react"

export interface ProgramModule {
  number: string
  title: string
  desc: string
  deliverable?: string
}

export interface ProgramPhase {
  step: string
  title: string
  duration: string
  desc: string
}

export interface ProgramAlumni {
  name: string
  role: string
  city: string
  avatar: string
  quote: string
  promotion: string
}

export interface ProgramMetadata {
  icon: LucideIcon
  image: string
  accentColor: string
  badgeTone: string
  tagline: string
  highlights: { label: string; value: string }[]
  targetAudience: {
    title: string
    description: string
    criteria: string[]
  }
  modules: ProgramModule[]
  phases: ProgramPhase[]
  alumni?: ProgramAlumni
  keyBenefits: string[]
}

export const programDetailsMetadata: Record<string, ProgramMetadata> = {
  "academie-leadership-jeune": {
    icon: Users,
    image: "/assets/hero/DSC08048%20copie.jpg",
    accentColor: "from-forest via-forest/90 to-forest/70",
    badgeTone: "bg-forest text-white",
    tagline: "Former la nouvelle génération de leaders territoriaux, éthiques et engagés en Casamance.",
    highlights: [
      { label: "Bénéficiaires formés", value: "+70 Jeunes" },
      { label: "Durée du parcours", value: "6 Mois intensifs" },
      { label: "Taux de concrétisation", value: "92% d'impact" },
      { label: "Couverture", value: "3 Régions" },
    ],
    targetAudience: {
      title: "Jeunes talents et futurs acteurs du changement",
      description: "L'Académie est ouverte aux jeunes de 18 à 35 ans résidant en Casamance (Ziguinchor, Sédhiou, Kolda) ou issus de la diaspora, démontrant un fort engagement citoyen et un projet concret pour le développement de leur communauté.",
      criteria: [
        "Avoir entre 18 et 35 ans au moment du dépôt de candidature",
        "Résider ou porter une initiative dans l'une des 3 régions de Casamance",
        "Démontrer un engagement associatif, entrepreneurial ou communautaire avéré",
        "Être disponible pour les sessions présentielles mensuelles et le mentorat à distance",
      ],
    },
    modules: [
      {
        number: "01",
        title: "Leadership Personnel & Éthique Citoyenne",
        desc: "Développement de la confiance, intelligence émotionnelle, prise de parole en public et valeurs républicaines.",
        deliverable: "Plan de développement personnel & posture de leader",
      },
      {
        number: "02",
        title: "Conduite de Projet & Gouvernance Territoriale",
        desc: "Méthodologie de gestion de projets d'impact, analyse des besoins territoriaux et gouvernance participative.",
        deliverable: "Dossier de cadrage de projet communautaire",
      },
      {
        number: "03",
        title: "Communication d'Influence & Plaidoyer",
        desc: "Stratégies de communication digitale, négociation, relations institutionnelles et mobilisation de communautés.",
        deliverable: "Campagne de sensibilisation ou de plaidoyer",
      },
      {
        number: "04",
        title: "Immersion & Projet d'Action Terrain (PAT)",
        desc: "Déploiement sur le terrain dans un village ou quartier avec mentorat de proximité et évaluation continue.",
        deliverable: "Restitution publique et rapport d'impact territorial",
      },
    ],
    phases: [
      {
        step: "Phase 1",
        title: "Sélection & Boot-camp d'Immersion",
        duration: "Mois 1",
        desc: "Sélection des 30 lauréats et séminaire d'intégration de 3 jours au Campus Territorial de Ziguinchor.",
      },
      {
        step: "Phase 2",
        title: "Ateliers Thématiques & Masterclasses",
        duration: "Mois 2 à 4",
        desc: "Sessions bimensuelles avec des experts, doyens et personnalités inspirantes de la Casamance.",
      },
      {
        step: "Phase 3",
        title: "Déploiement du Projet Terrain",
        duration: "Mois 5",
        desc: "Mise en œuvre concrète des initiatives d'intérêt général accompagnées de bourses d'amorçage.",
      },
      {
        step: "Phase 4",
        title: "Soutenance, Certification & Réseau Alumni",
        duration: "Mois 6",
        desc: "Cérémonie officielle de remise des diplômes et intégration dans la communauté active des Alumni Casa Impact.",
      },
    ],
    alumni: {
      name: "Mariama Sonko",
      role: "Présidente de Jeunesse & Avenir Sédhiou",
      city: "Sédhiou",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
      quote: "L'Académie du Leadership a transformé ma vision de l'engagement. J'ai acquis la méthodologie et le réseau indispensables pour structurer notre coopérative maraîchère qui emploie aujourd'hui 15 jeunes filles à Sédhiou.",
      promotion: "Promotion Aline Sitoé Diatta 2025",
    },
    keyBenefits: [
      "Coaching personnalisé par des cadres et mentors expérimentés",
      "Accès aux espaces de travail et outils numériques du réseau Casa Impact",
      "Possibilité d'obtenir une micro-bourse pour financer son projet terrain",
      "Adhésion à vie au réseau influent des Alumni de l'Académie",
    ],
  },
  "incubateur-entrepreneuriat-innovation": {
    icon: Rocket,
    image: "/assets/hero/DSC08045%20copie.jpg",
    accentColor: "from-forest via-forest/90 to-accent/40",
    badgeTone: "bg-accent text-accent-foreground font-bold",
    tagline: "Accélérer les startups et PME casamançaises pour transformer le potentiel économique local.",
    highlights: [
      { label: "Entreprises incubées", value: "+45 Startups" },
      { label: "Fonds mobilisés", value: "85M FCFA" },
      { label: "Emplois créés", value: "+120 Emplois" },
      { label: "Pôles actifs", value: "Kolda & Sédhiou" },
    ],
    targetAudience: {
      title: "Porteurs de projets innovants et PME en croissance",
      description: "Destiné aux entrepreneurs ayant une idée validée, un prototype ou une activité existante en Casamance dans les secteurs de l'agro-alimentaire, du numérique, de la transition écologique ou de l'artisanat moderne.",
      criteria: [
        "Avoir un projet économique réalisable sur le territoire casamançais",
        "Être prêt à s'investir à temps plein ou structurer une équipe opérationnelle",
        "Proposer un modèle créateur d'emplois locaux durables",
        "Intégrer une dimension éco-responsable ou sociale dans son offre",
      ],
    },
    modules: [
      {
        number: "01",
        title: "Modèle Économique & Étude de Marché Locale",
        desc: "Structuration du Business Model Canvas adapté aux réalités du marché régional et sous-régional.",
        deliverable: "BMC validé et plan de tarification",
      },
      {
        number: "02",
        title: "Structuration Juridique, Fiscale & Gestion",
        desc: "Formalisation de l'entreprise, tenue de comptabilité simplifiée et conformité administrative.",
        deliverable: "Statuts juridiques et registre de commerce (RCCM)",
      },
      {
        number: "03",
        title: "Marketing Digital & Conquête Commerciale",
        desc: "Acquisition de clients, réseaux sociaux, plateformes e-commerce et partenariats B2B.",
        deliverable: "Plan marketing opérationnel et canaux de vente actifs",
      },
      {
        number: "04",
        title: "Préparation à la Levée de Fonds & Pitch Day",
        desc: "Élaboration du pitch deck, simulation de négociations et rencontres avec les banques et investisseurs de la diaspora.",
        deliverable: "Pitch deck investisseur et prévisionnel financier 3 ans",
      },
    ],
    phases: [
      {
        step: "Phase 1",
        title: "Diagnostic & Feuille de Route",
        duration: "Mois 1",
        desc: "Audit approfondi de la maturité du projet et définition des jalons de croissance.",
      },
      {
        step: "Phase 2",
        title: "Prototypage & Test Marché",
        duration: "Mois 2-3",
        desc: "Mise sur le marché d'un produit minimum viable (MVP) et premières ventes encadrées.",
      },
      {
        step: "Phase 3",
        title: "Scale & Structuration Opérationnelle",
        duration: "Mois 4-5",
        desc: "Optimisation de la production, recrutement et consolidation de la chaîne logistique.",
      },
      {
        step: "Phase 4",
        title: "Investisseur Demo Day",
        duration: "Mois 6",
        desc: "Pitch devant un jury d'institutions financières, business angels et diaspora connect.",
      },
    ],
    alumni: {
      name: "Ousmane Diallo",
      role: "Fondateur de CasaBio Transformation",
      city: "Kolda",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
      quote: "L'incubateur de Casa Impact nous a permis de passer de la transformation artisanale de mangues séchées à une unité semi-industrielle certifiée. Nos produits sont désormais distribués à Dakar et en Europe grâce au réseau Diaspora.",
      promotion: "Promotion Innovation Kolda 2025",
    },
    keyBenefits: [
      "Mentorat 1-on-1 avec des entrepreneurs chevronnés",
      "Accès aux laboratoires et unités de transformation partenaires",
      "Mise en relation directe avec les investisseurs de la diaspora",
      "Visibilité médiatique et référencement sur la Boutique Casa Impact",
    ],
  },
  "festival-des-talents-casamance": {
    icon: Landmark,
    image: "/assets/hero/DSC08016%20copie.jpg",
    accentColor: "from-earth via-forest to-forest/80",
    badgeTone: "bg-earth text-white",
    tagline: "Célébrer la créativité, le patrimoine vivant et les expressions artistiques des terroirs de Casamance.",
    highlights: [
      { label: "Artistes & Créateurs", value: "+120 Talents" },
      { label: "Visiteurs attendus", value: "+5 000 Public" },
      { label: "Scènes & Expositions", value: "3 Départements" },
      { label: "Retombées locales", value: "100% Terroir" },
    ],
    targetAudience: {
      title: "Artistes, musiciens, artisans d'art et porteurs de patrimoine",
      description: "Ouvert à tous les artistes (musique, arts plastiques, danse, mode, artisanat d'art, conteurs) originaires ou résidant en Casamance souhaitant valoriser l'identité culturelle.",
      criteria: [
        "Avoir une pratique artistique ou artisanale authentique",
        "Proposer des œuvres ou performances inspirées des traditions ou de la modernité casamançaise",
        "Participer aux masterclasses de transmission aux jeunes générations",
      ],
    },
    modules: [
      {
        number: "01",
        title: "Masterclasses & Professionnalisation Artistique",
        desc: "Gestion des droits d'auteur, structuration de portfolio et communication scénique.",
        deliverable: "Dossier d'artiste professionnel",
      },
      {
        number: "02",
        title: "Scènes d'Expression & Tremplins Découverte",
        desc: "Performances en direct devant des programmateurs de festivals nationaux et internationaux.",
        deliverable: "Captation live HD et visibilité médiatique",
      },
      {
        number: "03",
        title: "Foire de l'Artisanat & Marché du Patrimoine",
        desc: "Exposition-vente de créations textiles, poteries, vanneries et sculptures traditionnelles.",
        deliverable: "Stand d'exposition et mise en relation acheteurs",
      },
      {
        number: "04",
        title: "Résidences de Création Intergénérationnelles",
        desc: "Rencontre entre doyens dépositaires des savoirs et jeunes créateurs contemporains.",
        deliverable: "Œuvre collective pérenne",
      },
    ],
    phases: [
      {
        step: "Phase 1",
        title: "Appel à Talents & Sélection Régionale",
        duration: "Mars 2026",
        desc: "Auditions et repérage dans les 3 régions de Casamance.",
      },
      {
        step: "Phase 2",
        title: "Résidences & Ateliers Techniques",
        duration: "Avril 2026",
        desc: "Sessions de répétition et de perfectionnement avec des directeurs artistiques renommés.",
      },
      {
        step: "Phase 3",
        title: "Grandes Journées du Festival",
        duration: "Mai 2026",
        desc: "3 jours de festivités, concerts, tables rondes et marchés artisanaux à Sédhiou.",
      },
      {
        step: "Phase 4",
        title: "Suivi & Promotion Internationale",
        duration: "Juin 2026",
        desc: "Accompagnement des lauréats vers les foires régionales et salons d'art.",
      },
    ],
    alumni: {
      name: "Aïssatou Sané",
      role: "Styliste Designer & Créatrice Textile",
      city: "Ziguinchor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
      quote: "Le Festival des Talents m'a offert une scène majeure pour présenter ma collection de tissages traditionnels revisités. Aujourd'hui, mes créations sont exportées en France et au Canada.",
      promotion: "Édition 2025 Sédhiou",
    },
    keyBenefits: [
      "Prise en charge logistique pour les artistes sélectionnés",
      "Captation photo/vidéo professionnelle de haute qualité",
      "Mise en réseau avec des producteurs et acheteurs institutionnels",
      "Vente directe sans intermédiaire sur les espaces du festival",
    ],
  },
  "tremplin-sport-education": {
    icon: Trophy,
    image: "/assets/hero/DSC08084%20copie.jpg",
    accentColor: "from-forest via-forest/90 to-primary/80",
    badgeTone: "bg-primary text-primary-foreground",
    tagline: "Faire du sport un puissant levier d'éducation, d'insertion civique et d'excellence pour la jeunesse.",
    highlights: [
      { label: "Jeunes sportifs", value: "+50 Détectés" },
      { label: "Centres partenaires", value: "12 Écoles" },
      { label: "Bourses octroyées", value: "15 Bourses" },
      { label: "Disciplines", value: "Football, Basket, Athlétisme" },
    ],
    targetAudience: {
      title: "Jeunes athlètes scolaires et éducateurs sportifs",
      description: "Jeunes filles et garçons de 12 à 22 ans pratiquant une discipline sportive en club scolaire ou communautaire, ainsi que les encadreurs locaux.",
      criteria: [
        "Faire preuve d'un bon parcours scolaire et de discipline sportive",
        "Être licencié dans un club ou une association locale de Casamance",
        "S'engager dans le programme de tutorat académique hebdomadaire",
      ],
    },
    modules: [
      {
        number: "01",
        title: "Perfectionnement Technique & Préparation Physique",
        desc: "Entraînements de haut niveau encadrés par des préparateurs certifiés et diététiciens du sport.",
        deliverable: "Bilan athlétique personnalisé",
      },
      {
        number: "02",
        title: "Tutorat Scolaire & Double Projet Sport-Études",
        desc: "Soutien scolaire obligatoire pour concilier progression sportive et réussite académique.",
        deliverable: "Bulletin de suivi pédagogique",
      },
      {
        number: "03",
        title: "Formation aux Métiers du Sport",
        desc: "Initiation à l'arbitrage, à l'animation sportive communautaire et aux premiers secours.",
        deliverable: "Attestation de secourisme et initiation arbitrage",
      },
      {
        number: "04",
        title: "Tournois de Détection & Stages d'Élite",
        desc: "Rencontres inter-régionales avec la présence de recruteurs d'académies nationales.",
        deliverable: "Rapport de scouting et opportunités de bourses",
      },
    ],
    phases: [
      {
        step: "Phase 1",
        title: "Caravane de Détection dans les 3 Régions",
        duration: "Juin 2026",
        desc: "Tests physiques et tournois de sélection à Bignona, Kolda et Oussouye.",
      },
      {
        step: "Phase 2",
        title: "Intégration & Regroupement Pédagogique",
        duration: "Juillet - Septembre 2026",
        desc: "Camp d'été immersif alliant entraînement intensif et ateliers de leadership.",
      },
      {
        step: "Phase 3",
        title: "Suivi Annuel & Bourses d'Équipement",
        duration: "Octobre - Décembre 2026",
        desc: "Dotation en matériel de pointe et accompagnement médical et scolaire.",
      },
      {
        step: "Phase 4",
        title: "Passerelles vers les Centres d'Excellence",
        duration: "Novembre 2026",
        desc: "Orientation des meilleurs profils vers des bourses sport-études de référence.",
      },
    ],
    alumni: {
      name: "Babacar Coly",
      role: "Athlète & Boursier Sport-Études",
      city: "Bignona",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
      quote: "Tremplin Sport m'a non seulement permis de progresser techniquement en athlétisme, mais m'a aussi fourni les manuels scolaires et le soutien pour réussir mon Bac avec mention.",
      promotion: "Promotion Tremplin 2025",
    },
    keyBenefits: [
      "Dotation complète en équipements sportifs de qualité",
      "Prise en charge des frais de scolarité pour les boursiers",
      "Suivi médical et diététique régulier",
      "Opportunités directes d'essais dans les centres de formation agréés",
    ],
  },
  "eco-tourisme-terroirs-casamance": {
    icon: Palmtree,
    image: "/assets/hero/casamance-landscape.png",
    accentColor: "from-forest via-forest/90 to-emerald-700/80",
    badgeTone: "bg-forest text-white",
    tagline: "Structurer un écotourisme communautaire durable et révéler la splendeur sauvage de la Casamance.",
    highlights: [
      { label: "Campements accompagnés", value: "8 Villages" },
      { label: "Circuits balisés", value: "5 Itinéraires" },
      { label: "Guides formés", value: "+30 Certifiés" },
      { label: "Zone pilote", value: "Îles & Basse-Casamance" },
    ],
    targetAudience: {
      title: "Gérants de campements, guides locaux et coopératives villageoises",
      description: "Professionnels du tourisme responsable, associations de piroguiers, campements communautaires et artisans culinaires des terroirs casamançais.",
      criteria: [
        "Gérer ou porter un projet d'accueil touristique respectueux de l'environnement",
        "Privilégier l'approvisionnement en circuits courts et l'emploi local",
        "S'engager dans la charte de l'écotourisme durable de Casa Impact",
      ],
    },
    modules: [
      {
        number: "01",
        title: "Standardisation de l'Accueil & Éco-Normes",
        desc: "Hygiène, confort écologique, gestion de l'eau et de l'énergie solaire dans les campements.",
        deliverable: "Audit qualité et label Éco-Terroir",
      },
      {
        number: "02",
        title: "Numérisation de l'Offre & Réservations en Ligne",
        desc: "Création de profils numériques, intégration aux plateformes de voyage et e-réputation.",
        deliverable: "Page web dédiée et passerelle de réservation",
      },
      {
        number: "03",
        title: "Guidage Écologique & Interprétation du Patrimoine",
        desc: "Formation aux récits de terroir, ornithologie, botanique de la mangrove et sécurité nautique.",
        deliverable: "Certificat de Guide Naturaliste Territorial",
      },
      {
        number: "04",
        title: "Circuits Gastronomiques & Terroirs",
        desc: "Valorisation des produits locaux (riz de mangrove, poisson fumé, jus sauvages, miel de forêt).",
        deliverable: "Menu terroir et circuit dégustation balisé",
      },
    ],
    phases: [
      {
        step: "Phase 1",
        title: "Cartographie & Diagnostic de Terrain",
        duration: "Juillet 2026",
        desc: "Visite des sites naturels et identification des besoins d'équipements écologiques.",
      },
      {
        step: "Phase 2",
        title: "Sessions de Formation Pratique",
        duration: "Août - Septembre 2026",
        desc: "Ateliers intensifs à Cap Skirring, Carabane et Kafountine.",
      },
      {
        step: "Phase 3",
        title: "Mise à Niveau des Infrastructures",
        duration: "Octobre 2026",
        desc: "Installation d'équipements solaires et kits d'éco-assainissement.",
      },
      {
        step: "Phase 4",
        title: "Lancement de la Saison Éco-Touristique",
        duration: "Novembre - Décembre 2026",
        desc: "Promotion auprès des agences de voyages éthiques et voyageurs responsables.",
      },
    ],
    alumni: {
      name: "Abdoulaye Manga",
      role: "Responsable du Campement Villageois d'Elinkine",
      city: "Elinkine",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80",
      quote: "Grâce à l'accompagnement de Casa Impact, notre campement a doublé son taux de fréquentation en attirant des voyageurs respectueux de notre écosystème insulaire. Les retombées financent directement la maternité du village.",
      promotion: "Promotion Carabane 2025",
    },
    keyBenefits: [
      "Label officiel 'Éco-Terroir Casamance' reconnu",
      "Visibilité exclusive sur le portail de voyage Casa Impact",
      "Dotation en équipements solaires et filtres à eau écologiques",
      "Assurance et formation sécurité en milieu marin",
    ],
  },
  "diaspora-connect-invest-hub": {
    icon: HandCoins,
    image: "/assets/hero/DSC08011%20copie.jpg",
    accentColor: "from-accent via-forest to-forest/90",
    badgeTone: "bg-accent text-accent-foreground font-bold",
    tagline: "Canaliser l'expertise, les capitaux et le cœur de la diaspora pour bâtir l'avenir de la Casamance.",
    highlights: [
      { label: "Membres diaspora", value: "+200 Cadres" },
      { label: "Projets financés", value: "18 Réalisations" },
      { label: "Pays représentés", value: "14 Pays" },
      { label: "Investissements", value: "150M FCFA" },
    ],
    targetAudience: {
      title: "Ressortissants, investisseurs et sympathisants de la diaspora",
      description: "Professionnels, entrepreneurs, cadres et étudiants casamançais vivant à l'étranger désireux de s'investir concrètement dans le développement de leur terroir.",
      criteria: [
        "Résider hors de Casamance (Dakar, Afrique, Europe, Amériques, Asie)",
        "Vouloir investir dans un projet productif ou offrir du mentorat de compétences",
        "Partager la charte de transparence et d'intégrité de Casa Impact",
      ],
    },
    modules: [
      {
        number: "01",
        title: "Guichet Unique de l'Investissement Territorial",
        desc: "Conseil juridique, foncier sécurisé, montage financier et intermédiation administrative locale.",
        deliverable: "Fiche d'opportunité d'investissement vérifiée",
      },
      {
        number: "02",
        title: "Mentorat à Distance & Transfert de Compétences",
        desc: "Jumelage d'experts de la diaspora avec des startups et étudiants casamançais.",
        deliverable: "Programme de parrainage de 6 mois",
      },
      {
        number: "03",
        title: "Fonds d'Amorçage & Co-Investissement",
        desc: "Pool d'investisseurs pour financer collectivement des unités agro-industrielles et solaires.",
        deliverable: "Pacte d'actionnaires et gouvernance partagée",
      },
      {
        number: "04",
        title: "Forum Annuel Diaspora & Impact Territoire",
        desc: "Grand rendez-vous hybride (présentiel à Ziguinchor/Kolda + visio mondiale) de pitch et d'affaires.",
        deliverable: "Catalogue des projets et signatures de partenariats",
      },
    ],
    phases: [
      {
        step: "Phase 1",
        title: "Enregistrement & Recensement des Compétences",
        duration: "Permanent",
        desc: "Cartographie des compétences et intentions d'investissement de la diaspora.",
      },
      {
        step: "Phase 2",
        title: "Webinaires d'Immersion & Due Diligence",
        duration: "Trimestriel",
        desc: "Présentation des projets locaux audités et sécurisés par l'équipe Casa Impact.",
      },
      {
        step: "Phase 3",
        title: "Missions Territoriales 'Retour aux Racines'",
        duration: "Août & Décembre",
        desc: "Visites guidées des sites de projets et rencontres directes avec les coopératives.",
      },
      {
        step: "Phase 4",
        title: "Suivi des Investissements & Reporting",
        duration: "Continu",
        desc: "Rapports trimestriels d'impact financier, social et environnemental.",
      },
    ],
    alumni: {
      name: "Dr. Lamine Badji",
      role: "Ingénieur Télécoms & Investisseur Diaspora",
      city: "Paris / Kolda",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80",
      quote: "Diaspora Connect m'a permis d'investir en toute sécurité dans une unité de décorticage d'anacarde à Kolda. J'ai un suivi rigoureux sur place et je sais que chaque franc investi crée des emplois dignes pour nos jeunes.",
      promotion: "Réseau Diaspora Hub 2025",
    },
    keyBenefits: [
      "Sécurisation juridique et foncière intégrale des investissements",
      "Reporting financier et opérationnel en temps réel",
      "Réseau mondial de networking de haut niveau",
      "Impact direct mesurable sur la vie des familles en Casamance",
    ],
  },
}

export function getProgramMetadata(slug: string): ProgramMetadata {
  return (
    programDetailsMetadata[slug] ?? {
      icon: GraduationCap,
      image: "/assets/hero/DSC08048%20copie.jpg",
      accentColor: "from-forest via-forest/90 to-forest/70",
      badgeTone: "bg-forest text-white",
      tagline: "Un programme d'action structurant au service du développement durable de la Casamance.",
      highlights: [
        { label: "Bénéficiaires", value: "+50 Acteurs" },
        { label: "Format", value: "Présentiel & Terrain" },
        { label: "Territoire", value: "3 Régions" },
        { label: "Impact", value: "100% Territorial" },
      ],
      targetAudience: {
        title: "Acteurs engagés et porteurs de projets locaux",
        description: "Ce programme s'adresse aux ressortissants et résidents de Casamance engagés pour le bien commun et l'émancipation économique de la région.",
        criteria: [
          "Résider ou agir dans l'une des régions de Casamance (Ziguinchor, Sédhiou, Kolda)",
          "Avoir un projet ou une volonté d'engagement prouvée",
          "Être disponible pour l'ensemble du cycle de formation et de suivi",
        ],
      },
      modules: [
        {
          number: "01",
          title: "Fondamentaux & Stratégie Territoriale",
          desc: "Compréhension des enjeux locaux et structuration des objectifs clés.",
          deliverable: "Feuille de route initiale",
        },
        {
          number: "02",
          title: "Renforcement Technique & Outils Opérationnels",
          desc: "Ateliers pratiques et appropriation des méthodologies modernes.",
          deliverable: "Outils de gestion appliqués",
        },
        {
          number: "03",
          title: "Expérimentation & Déploiement Terrain",
          desc: "Mise en œuvre des acquis avec encadrement de proximité.",
          deliverable: "Projet pilote opérationnel",
        },
        {
          number: "04",
          title: "Évaluation, Clôture & Mise en Réseau",
          desc: "Bilan d'impact et intégration dans la communauté Casa Impact.",
          deliverable: "Bilan d'impact et certification",
        },
      ],
      phases: [
        {
          step: "Phase 1",
          title: "Appel à candidatures & Diagnostic",
          duration: "Mois 1",
          desc: "Sélection rigoureuse des participants et bilan des besoins.",
        },
        {
          step: "Phase 2",
          title: "Formation & Ateliers",
          duration: "Mois 2-3",
          desc: "Montée en compétences théorique et pratique.",
        },
        {
          step: "Phase 3",
          title: "Mise en œuvre concrète",
          duration: "Mois 4-5",
          desc: "Action sur le terrain et mentorat dédié.",
        },
        {
          step: "Phase 4",
          title: "Clôture & Pérennisation",
          duration: "Mois 6",
          desc: "Consolidation des résultats et perspectives de suivi.",
        },
      ],
      alumni: {
        name: "Participant Casa Impact",
        role: "Bénéficiaire du Programme",
        city: "Casamance",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
        quote: "Ce programme a été un véritable catalyseur dans mon parcours personnel et professionnel. L'accompagnement sur le terrain fait toute la différence.",
        promotion: "Promotion 2025",
      },
      keyBenefits: [
        "Accompagnement méthodologique de haut niveau",
        "Mise en relation avec un réseau dynamique d'acteurs de terrain",
        "Outils et ressources pédagogiques exclusifs",
        "Suivi personnalisé après la fin de la cohorte",
      ],
    }
  )
}
