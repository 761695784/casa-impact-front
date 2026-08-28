"use client"

import React from "react"
import Link from "next/link"
import {
  Inbox,
  Mail,
  CreditCard,
  Megaphone,
  ArrowRight,
  Sparkles,
  Compass,
  Newspaper,
  Handshake,
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  Plus,
  Layers,
  Quote,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useAdminDashboard } from "@/hooks/use-admin-dashboard"
import { DashboardSkeleton } from "@/components/admin/ui/loading-skeleton"
import { ErrorState } from "@/components/admin/ui/error-state"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import { PermissionGate } from "@/components/admin/permission-gate"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch } = useAdminDashboard()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Erreur lors du chargement du tableau de bord"
        message={error instanceof Error ? error.message : "Une erreur imprévue est survenue."}
        onRetry={() => refetch()}
      />
    )
  }

  const { stats, actionsRequises, candidaturesRecentes, messagesRecents, adhesionsRecentes, activiteRecente } =
    data

  const todayStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date())

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* 1. Header Institutionnel & Actions Rapides */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <span className="size-1.5 rounded-full bg-forest animate-pulse" />
            <span className="capitalize">{todayStr}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Bonjour, {user?.nom ? user.nom.split(" ")[0] : "Administrateur"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bienvenue sur l'espace d'administration et de pilotage de <strong>Casa Impact</strong>.
          </p>
        </div>

        {/* Quick action buttons based on permissions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <PermissionGate permission="appels:write">
            <Button asChild size="sm" className="rounded-full bg-forest text-white hover:bg-forest/90 gap-1.5 shadow-xs">
              <Link href="/admin/appels-a-candidatures">
                <Plus className="size-4" />
                <span>Nouvel appel</span>
              </Link>
            </Button>
          </PermissionGate>

          <PermissionGate permission="actualites:write">
            <Button asChild size="sm" variant="outline" className="rounded-full gap-1.5 border-border bg-card hover:bg-secondary">
              <Link href="/admin/actualites">
                <Newspaper className="size-4 text-forest" />
                <span>Publier actualité</span>
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* 2. Actions Requises / À Traiter en Priorité */}
      <section aria-labelledby="priorities-title">
        <div className="flex items-center justify-between mb-4">
          <h2 id="priorities-title" className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="size-4 text-forest" />
            <span>À traiter en priorité</span>
          </h2>
          <span className="text-xs text-muted-foreground">Mise à jour en temps réel</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Candidatures nouvelles */}
          <Link
            href="/admin/candidatures"
            className="group relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-card to-card p-5 shadow-2xs transition-all hover:border-sky-500/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700">
                <Inbox className="size-5" />
              </div>
              <span className="text-xs font-semibold text-sky-700 group-hover:underline inline-flex items-center gap-0.5">
                Examiner <ChevronRight className="size-3" />
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-3xl font-bold text-foreground">
                {actionsRequises.candidaturesNouvelles}
              </p>
              <p className="mt-1 text-xs font-semibold text-sky-900/80">
                Candidatures en attente d'étude
              </p>
            </div>
          </Link>

          {/* Messages non lus */}
          <Link
            href="/admin/messages"
            className="group relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card to-card p-5 shadow-2xs transition-all hover:border-amber-500/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
                <Mail className="size-5" />
              </div>
              <span className="text-xs font-semibold text-amber-800 group-hover:underline inline-flex items-center gap-0.5">
                Consulter <ChevronRight className="size-3" />
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-3xl font-bold text-foreground">
                {actionsRequises.messagesNonLus}
              </p>
              <p className="mt-1 text-xs font-semibold text-amber-900/80">
                Messages de contact non lus
              </p>
            </div>
          </Link>

          {/* Adhésions en attente de cotisation */}
          <Link
            href="/admin/adhesions"
            className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card p-5 shadow-2xs transition-all hover:border-emerald-500/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                <CreditCard className="size-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-800 group-hover:underline inline-flex items-center gap-0.5">
                Valider <ChevronRight className="size-3" />
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-3xl font-bold text-foreground">
                {actionsRequises.adhesionsEnAttente}
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-900/80">
                Adhésions en attente de paiement
              </p>
            </div>
          </Link>

          {/* Appels à candidatures ouverts */}
          <Link
            href="/admin/appels-a-candidatures"
            className="group relative overflow-hidden rounded-3xl border border-forest/20 bg-gradient-to-br from-forest/5 via-card to-card p-5 shadow-2xs transition-all hover:border-forest/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                <Megaphone className="size-5" />
              </div>
              <span className="text-xs font-semibold text-forest group-hover:underline inline-flex items-center gap-0.5">
                Gérer <ChevronRight className="size-3" />
              </span>
            </div>
            <div className="mt-4">
              <p className="font-display text-3xl font-bold text-foreground">
                {actionsRequises.appelsEnCours}
              </p>
              <p className="mt-1 text-xs font-semibold text-forest/90">
                Appels à projets actuellement ouverts
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. Section Principale : Candidatures Récentes & Journal d'Activité */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Colonne Gauche : Candidatures & Adhésions */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Candidatures Récentes */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Dernières candidatures reçues
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Candidats ayant postulé aux cohortes et programmes ouverts
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-xs text-primary gap-1">
                <Link href="/admin/candidatures">
                  <span>Voir tout ({stats.candidatures})</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            <div className="mt-4 divide-y divide-border/60">
              {candidaturesRecentes.map((cand) => (
                <div
                  key={cand.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {cand.candidat}
                      </span>
                      {cand.region && (
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {cand.region}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cand.appelTitre} • <span className="font-mono text-[11px] opacity-75">{cand.reference}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge status={cand.statut} />
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {formatDate(cand.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adhésions Récentes */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Demandes d'adhésion récentes
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cotisation annuelle carte membre (1 000 FCFA)
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-xs text-primary gap-1">
                <Link href="/admin/adhesions">
                  <span>Voir tout</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            <div className="mt-4 divide-y divide-border/60">
              {adhesionsRecentes.map((adh) => (
                <div
                  key={adh.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {adh.nom_complet}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({adh.profession || "Membre"})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {adh.telephone} • {adh.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge status={adh.statut} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Colonne Droite : Panorama des 10 Modules & Messages */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Panorama des 10 Modules Backend */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border pb-3">
              Panorama des Contenus
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3">
              
              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Compass className="size-4 text-forest" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.programmes}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Programmes</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Megaphone className="size-4 text-forest" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.appels_a_candidatures}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Appels ouverts</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Newspaper className="size-4 text-forest" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.actualites}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Actualités</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Sparkles className="size-4 text-accent-foreground" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.talents}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Talents répertoriés</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Handshake className="size-4 text-earth" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.partenaires}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Partenaires</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Quote className="size-4 text-forest" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.temoignages}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Témoignages</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <BarChart3 className="size-4 text-forest" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.indicateurs_impact}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Indicateurs Impact</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <Users className="size-4 text-forest" />
                  <span className="font-display text-lg font-bold text-foreground">{stats.utilisateurs}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">Comptes admin</p>
              </div>

            </div>
          </div>

          {/* Messages Récentes Boîte de réception */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <span>Derniers Messages</span>
              </h3>
              <Link href="/admin/messages" className="text-xs font-semibold text-primary hover:underline">
                Voir tout ({stats.messages_contact})
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {messagesRecents.map((msg) => (
                <div key={msg.id} className="rounded-2xl bg-secondary/40 p-3.5 border border-border/60">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-foreground truncate">{msg.nom}</span>
                    <StatusBadge status={msg.statut} />
                  </div>
                  <p className="mt-1 text-xs font-medium text-foreground/90 line-clamp-1">{msg.sujet || "Demande de renseignement"}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
