"use client"

import React from "react"
import Link from "next/link"
import {
  Megaphone,
  Sparkles,
  Compass,
  Newspaper,
  Handshake,
  BarChart3,
  Users,
  Plus,
  Quote,
  Inbox,
  Mail,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useAdminDashboard } from "@/hooks/use-admin-dashboard"
import { DashboardSkeleton } from "@/components/admin/ui/loading-skeleton"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/components/admin/permission-gate"

/**
 * Dashboard volontairement minimal : la vraie réponse de
 * GET /api/admin/dashboard (DashboardStatsService::stats()) ne fournit
 * que des compteurs par ressource — aucune "action requise", liste
 * récente ou flux d'activité côté backend aujourd'hui. Si ces sections
 * sont souhaitées un jour, il faudra étendre le backend (voir le
 * rapport d'audit, section "Décisions à prendre") plutôt que les
 * réinventer côté frontend avec de fausses données.
 */
export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { data: stats, isLoading, isError, error, refetch } = useAdminDashboard()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !stats) {
    return (
      <ErrorState
        title="Erreur lors du chargement du tableau de bord"
        message={error instanceof Error ? error.message : "Une erreur imprévue est survenue."}
        onRetry={() => refetch()}
      />
    )
  }

  const todayStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date())

  const kpis = [
    {
      key: "programmes",
      label: "Programmes",
      icon: Compass,
      total: stats.programmes.total,
      sub: `${stats.programmes.publies} publiés`,
      href: "/admin/programmes",
    },
    {
      key: "appels",
      label: "Appels à candidatures",
      icon: Megaphone,
      total: stats.appels_a_candidatures.total,
      sub: `${stats.appels_a_candidatures.publies} publiés`,
      href: "/admin/appels-a-candidatures",
    },
    {
      key: "candidatures",
      label: "Candidatures",
      icon: Inbox,
      total: stats.candidatures.total,
      sub: `${stats.candidatures.en_liste_attente} en liste d'attente`,
      href: "/admin/candidatures",
    },
    {
      key: "actualites",
      label: "Actualités",
      icon: Newspaper,
      total: stats.actualites.total,
      sub: `${stats.actualites.publiees} publiées`,
      href: "/admin/actualites",
    },
    {
      key: "talents",
      label: "Talents répertoriés",
      icon: Sparkles,
      total: stats.talents.total,
      sub: `${stats.talents.publies} publiés`,
      href: "/admin/talents",
    },
    {
      key: "temoignages",
      label: "Témoignages",
      icon: Quote,
      total: stats.temoignages.total,
      sub: `${stats.temoignages.publies} publiés`,
      href: "/admin/temoignages",
    },
    {
      key: "partenaires",
      label: "Partenaires",
      icon: Handshake,
      total: stats.partenaires.total,
      sub: `${stats.partenaires.actifs} actifs`,
      href: "/admin/partenaires",
    },
    {
      key: "messages",
      label: "Messages de contact",
      icon: Mail,
      total: stats.messages_contact.total,
      sub: `${stats.messages_contact.nouveaux} nouveaux`,
      href: "/admin/messages",
    },
    {
      key: "impact",
      label: "Indicateurs Impact",
      icon: BarChart3,
      total: stats.indicateurs_impact.total,
      href: "/admin/impact",
    },
    {
      key: "utilisateurs",
      label: "Comptes admin",
      icon: Users,
      total: stats.utilisateurs.total,
      href: "/admin/utilisateurs",
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Institutionnel & Actions Rapides */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <span className="size-1.5 rounded-full bg-forest animate-pulse" />
            <span className="capitalize">{todayStr}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Bonjour, {user?.name ? user.name.split(" ")[0] : "Administrateur"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bienvenue sur l'espace d'administration et de pilotage de <strong>Casa Impact</strong>.
          </p>
        </div>

        {/* Quick action buttons based on permissions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <PermissionGate permission="application-calls.create">
            <Button asChild size="sm" className="rounded-full bg-forest text-white hover:bg-forest/90 gap-1.5 shadow-xs">
              <Link href="/admin/appels-a-candidatures">
                <Plus className="size-4" />
                <span>Nouvel appel</span>
              </Link>
            </Button>
          </PermissionGate>

          <PermissionGate permission="news.create">
            <Button asChild size="sm" variant="outline" className="rounded-full gap-1.5 border-border bg-card hover:bg-secondary">
              <Link href="/admin/actualites">
                <Newspaper className="size-4 text-forest" />
                <span>Publier actualité</span>
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Panorama des Contenus — seules données réellement fournies par le backend */}
      <section aria-labelledby="panorama-title">
        <div className="flex items-center justify-between mb-4">
          <h2 id="panorama-title" className="font-display text-base font-bold text-foreground">
            Panorama des contenus
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Link
                key={kpi.key}
                href={kpi.href}
                className="group rounded-3xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-forest/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                    <Icon className="size-4.5" />
                  </div>
                  <span className="font-display text-2xl font-bold text-foreground">{kpi.total}</span>
                </div>
                <p className="mt-3 text-xs font-semibold text-foreground">{kpi.label}</p>
                {kpi.sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{kpi.sub}</p>}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
