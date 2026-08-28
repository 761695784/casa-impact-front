import {
  LayoutDashboard,
  FileText,
  Layers,
  Compass,
  Tag,
  Newspaper,
  Sparkles,
  Quote,
  Handshake,
  Megaphone,
  Inbox,
  CreditCard,
  BarChart3,
  MapPin,
  Image as ImageIcon,
  Mail,
  Users,
} from "lucide-react"

export interface AdminNavItem {
  title: string
  href: string
  icon: typeof LayoutDashboard
  permission?: string
  badgeKey?: "candidaturesNouvelles" | "messagesNonLus" | "adhesionsEnAttente"
}

export interface AdminNavGroup {
  groupTitle: string
  items: AdminNavItem[]
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    groupTitle: "PRINCIPAL",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    groupTitle: "CONTENU",
    items: [
      {
        title: "Pages",
        href: "/admin/pages",
        icon: FileText,
        permission: "pages:read",
      },
      {
        title: "Domaines",
        href: "/admin/domaines",
        icon: Layers,
      },
      {
        title: "Programmes",
        href: "/admin/programmes",
        icon: Compass,
        permission: "programmes:read",
      },
      {
        title: "Types de programme",
        href: "/admin/types-de-programme",
        icon: Tag,
      },
      {
        title: "Actualités",
        href: "/admin/actualites",
        icon: Newspaper,
        permission: "actualites:read",
      },
      {
        title: "Talents",
        href: "/admin/talents",
        icon: Sparkles,
        permission: "talents:read",
      },
      {
        title: "Témoignages",
        href: "/admin/temoignages",
        icon: Quote,
        permission: "temoignages:read",
      },
      {
        title: "Partenaires",
        href: "/admin/partenaires",
        icon: Handshake,
        permission: "partenaires:read",
      },
    ],
  },
  {
    groupTitle: "OPPORTUNITÉS",
    items: [
      {
        title: "Appels à candidatures",
        href: "/admin/appels-a-candidatures",
        icon: Megaphone,
        permission: "appels:read",
      },
      {
        title: "Candidatures",
        href: "/admin/candidatures",
        icon: Inbox,
        permission: "candidatures:read",
        badgeKey: "candidaturesNouvelles",
      },
    ],
  },
  {
    groupTitle: "ORGANISATION",
    items: [
      {
        title: "Adhésions",
        href: "/admin/adhesions",
        icon: CreditCard,
        permission: "adhesions:read",
        badgeKey: "adhesionsEnAttente",
      },
      {
        title: "Impact",
        href: "/admin/impact",
        icon: BarChart3,
      },
      {
        title: "Cartographie",
        href: "/admin/cartographie",
        icon: MapPin,
      },
      {
        title: "Médiathèque",
        href: "/admin/mediatheque",
        icon: ImageIcon,
        permission: "mediatheque:read",
      },
      {
        title: "Messages",
        href: "/admin/messages",
        icon: Mail,
        badgeKey: "messagesNonLus",
      },
    ],
  },
  {
    groupTitle: "ADMINISTRATION",
    items: [
      {
        title: "Utilisateurs",
        href: "/admin/utilisateurs",
        icon: Users,
        permission: "users:read",
      },
    ],
  },
]
