import {
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
} from "lucide-react"

export interface DomainMetadata {
  icon: LucideIcon
  image: string
  accentColor: string
  badgeTone: string
  axes: { title: string; desc: string }[]
}

export const domainVisuals: Record<string, LucideIcon> = {
  "jeunesse-et-leadership": Users,
  "entrepreneuriat-et-innovation": Rocket,
  "culture-et-patrimoine": Landmark,
  "sport-et-promotion-des-talents": Trophy,
  "tourisme-et-attractivite-territoriale": Palmtree,
  "investissement-et-diaspora": HandCoins,
}

export const domainDetailsMetadata: Record<string, DomainMetadata> = {
  "jeunesse-et-leadership": {
    icon: Users,
    image: "/assets/hero/DSC08048%20copie.jpg",
    accentColor: "from-forest/90 to-primary/80",
    badgeTone: "bg-forest text-white",
    axes: [
      {
        title: "Académie du Leadership",
        desc: "Formations certifiantes au management de projets, à la prise de parole en public et à la gouvernance locale.",
      },
      {
        title: "Citoyenneté & Engagement",
        desc: "Immersion communautaire, chantiers d'utilité publique et consultations citoyennes dans les terroirs.",
      },
      {
        title: "Mentorat Intergénérationnel",
        desc: "Parrainage des jeunes talents par des cadres, doyens et personnalités inspirantes de Casamance.",
      },
      {
        title: "Pôles Jeunesse Territoriaux",
        desc: "Animation de tiers-lieux et d'espaces de rencontre pour la jeunesse à Ziguinchor, Kolda et Sédhiou.",
      },
    ],
  },
  "entrepreneuriat-et-innovation": {
    icon: Rocket,
    image: "/assets/hero/DSC08045%20copie.jpg",
    accentColor: "from-accent/90 to-amber-600/80",
    badgeTone: "bg-accent text-accent-foreground font-bold",
    axes: [
      {
        title: "Incubateur de Startups & PME",
        desc: "Accompagnement méthodologique de l'idéation au prototypage et au déploiement commercial.",
      },
      {
        title: "Numérique, IA & Cybersécurité",
        desc: "Formations accélérées aux métiers du code, du cloud, des données et de l'intelligence artificielle.",
      },
      {
        title: "Agro-Business & Valeur Ajoutée",
        desc: "Transformation moderne des filières fruitières (mangue, cajou, agrumes), rizicoles et maraîchères locales.",
      },
      {
        title: "Accès au Micro-Financement",
        desc: "Mise en relation avec des fonds d'amorçage, business angels et coopératives de crédit.",
      },
    ],
  },
  "culture-et-patrimoine": {
    icon: Landmark,
    image: "/assets/hero/DSC08016%20copie.jpg",
    accentColor: "from-earth/90 to-amber-800/80",
    badgeTone: "bg-earth text-white",
    axes: [
      {
        title: "Valorisation du Patrimoine Vivant",
        desc: "Documentation et préservation des traditions, architectures sacrées et savoir-faire ancestraux.",
      },
      {
        title: "Industries Culturelles & Créatives",
        desc: "Structuration et professionnalisation des artistes, musiciens, plasticiens et artisans d'art.",
      },
      {
        title: "Festivals & Événements Territoriaux",
        desc: "Promotion des grands rendez-vous artistiques et culturels qui font rayonner la Casamance.",
      },
      {
        title: "Transmission aux Nouvelles Générations",
        desc: "Ateliers scolaires et communautaires d'éveil aux contes, arts et langues locales.",
      },
    ],
  },
  "sport-et-promotion-des-talents": {
    icon: Trophy,
    image: "/assets/hero/DSC08084%20copie.jpg",
    accentColor: "from-primary/90 to-emerald-700/80",
    badgeTone: "bg-primary text-primary-foreground",
    axes: [
      {
        title: "Détection & Bourses Sportives",
        desc: "Repérage des jeunes prodiges en football, athlétisme, basket-ball, sports de combat et nautiques.",
      },
      {
        title: "Sport comme Vecteur d'Inclusion",
        desc: "Programmes éducatifs et d'insertion professionnelle basés sur les valeurs de discipline et de respect.",
      },
      {
        title: "Infrastructures Sportives de Proximité",
        desc: "Plaidoyer et aménagement de terrains multisports sécurisés pour les quartiers et villages.",
      },
      {
        title: "Rayonnement International des Athlètes",
        desc: "Accompagnement de carrière et mise en relation avec des académies d'élite et fédérations.",
      },
    ],
  },
  "tourisme-et-attractivite-territoriale": {
    icon: Palmtree,
    image: "/assets/hero/casamance-landscape.png",
    accentColor: "from-emerald-800/90 to-forest/80",
    badgeTone: "bg-forest text-white",
    axes: [
      {
        title: "Écotourisme Communautaire",
        desc: "Développement de campements villageois éco-responsables et valorisation des îles du fleuve.",
      },
      {
        title: "Circuits Découverte & Terroirs",
        desc: "Création de routes touristiques authentiques reliant les richesses naturelles de Ziguinchor, Kolda et Sédhiou.",
      },
      {
        title: "Marketing & Image Territoriale",
        desc: "Campagnes de valorisation de la Casamance comme destination sûre, chaleureuse et captivante.",
      },
      {
        title: "Formation aux Métiers de l'Accueil",
        desc: "Renforcement des capacités en hôtellerie, guidage touristique, restauration et hygiène.",
      },
    ],
  },
  "investissement-et-diaspora": {
    icon: HandCoins,
    image: "/assets/hero/DSC08011%20copie.jpg",
    accentColor: "from-amber-700/90 to-earth/80",
    badgeTone: "bg-accent text-accent-foreground font-bold",
    axes: [
      {
        title: "Guichet Diaspora & Investisseurs",
        desc: "Accompagnement sur-mesure pour faciliter l'investissement productif de la diaspora en Casamance.",
      },
      {
        title: "Forums Économiques & B2B",
        desc: "Organisation de rencontres d'affaires entre porteurs de projets locaux et bailleurs internationaux.",
      },
      {
        title: "Mobilisation des Compétences",
        desc: "Missions de volontariat d'experts de la diaspora pour des interventions ciblées dans les universités et PME.",
      },
      {
        title: "Fonds d'Impact Territorial",
        desc: "Création d'instruments financiers innovants pour canaliser l'épargne vers des projets à fort impact social.",
      },
    ],
  },
}

export function getDomainIcon(slug: string): LucideIcon {
  return domainVisuals[slug] ?? Users
}

export function getDomainMetadata(slug: string): DomainMetadata {
  return (
    domainDetailsMetadata[slug] ?? {
      icon: Users,
      image: "/assets/hero/DSC08084%20copie.jpg",
      accentColor: "from-forest/90 to-primary/80",
      badgeTone: "bg-primary text-white",
      axes: [
        { title: "Action Territoriale", desc: "Déploiement d'initiatives adaptées aux besoins locaux." },
        { title: "Formation & Mentorat", desc: "Renforcement des capacités des acteurs du domaine." },
        { title: "Partenariats Stratégiques", desc: "Création de synergies techniques et financières." },
        { title: "Suivi & Impact", desc: "Évaluation continue des résultats auprès des bénéficiaires." },
      ],
    }
  )
}
