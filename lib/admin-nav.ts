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

/**
 * Permissions dot-notation (`resource.action`) alignées exactement sur
 * RolesAndPermissionsSeeder.php — resource keys en anglais (application-calls,
 * news, programs, etc.), pas les libellés français de l'UI.
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    groupTitle: "PRINCIPAL",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
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
        permission: "pages.view",
      },
      {
        title: "Domaines",
        href: "/admin/domaines",
        icon: Layers,
        permission: "domains.view",
      },
      {
        title: "Programmes",
        href: "/admin/programmes",
        icon: Compass,
        permission: "programs.view",
      },
      {
        title: "Types de programme",
        href: "/admin/types-de-programme",
        icon: Tag,
        permission: "program-types.view",
      },
      {
        title: "Actualités",
        href: "/admin/actualites",
        icon: Newspaper,
        permission: "news.view",
      },
      {
        title: "Talents",
        href: "/admin/talents",
        icon: Sparkles,
        permission: "talents.view",
      },
      {
        title: "Témoignages",
        href: "/admin/temoignages",
        icon: Quote,
        permission: "testimonials.view",
      },
      {
        title: "Partenaires",
        href: "/admin/partenaires",
        icon: Handshake,
        permission: "partners.view",
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
        permission: "application-calls.view",
      },
      {
        title: "Candidatures",
        href: "/admin/candidatures",
        icon: Inbox,
        permission: "applications.view",
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
        permission: "memberships.view",
        badgeKey: "adhesionsEnAttente",
      },
      {
        title: "Impact",
        href: "/admin/impact",
        icon: BarChart3,
        permission: "impact.view",
      },
      {
        title: "Cartographie",
        href: "/admin/cartographie",
        icon: MapPin,
        permission: "locations.manage",
      },
      {
        title: "Médiathèque",
        href: "/admin/mediatheque",
        icon: ImageIcon,
        permission: "media.manage",
      },
      {
        title: "Messages",
        href: "/admin/messages",
        icon: Mail,
        permission: "contact-messages.view",
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
        permission: "users.view",
      },
    ],
  },
]
