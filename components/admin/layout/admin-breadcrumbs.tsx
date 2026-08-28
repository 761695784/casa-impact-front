"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const ROUTE_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Tableau de bord",
  utilisateurs: "Utilisateurs",
  domaines: "Domaines d'intervention",
  pages: "Pages & Contenus",
  programmes: "Programmes",
  "types-de-programme": "Types de programme",
  "appels-a-candidatures": "Appels à candidatures",
  candidatures: "Candidatures",
  actualites: "Actualités",
  talents: "Talents",
  temoignages: "Témoignages",
  partenaires: "Partenaires",
  mediatheque: "Médiathèque",
  impact: "Indicateurs d'impact",
  cartographie: "Cartographie",
  messages: "Messages de contact",
  adhesions: "Adhésions & Cartes",
}

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Home className="size-3.5 text-primary" />
        <span>Tableau de bord</span>
      </div>
    )
  }

  return (
    <nav aria-label="Fil d'Ariane administration" className="flex items-center gap-1.5 text-xs font-medium">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="size-3.5" />
        <span>Admin</span>
      </Link>

      {segments.slice(1).map((seg, idx, arr) => {
        const isLast = idx === arr.length - 1
        const href = "/" + segments.slice(0, idx + 2).join("/")
        const label = ROUTE_LABELS[seg] || seg

        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-muted-foreground/60" />
            {isLast ? (
              <span className="font-semibold text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
