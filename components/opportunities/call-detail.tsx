"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarClock,
  Users,
  MapPin,
  FileCheck2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { useApplicationCall } from "@/hooks/use-content"
import { Section, SectionHeading } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RegionBadge } from "@/components/cards/region-badge"
import { ApplicationForm } from "@/components/opportunities/application-form"
import { formatDate, daysUntil } from "@/lib/format"
import { BaobabMark } from "@/components/brand/baobab-mark"

export function CallDetail({ slug }: { slug: string }) {
  const { data: call, isLoading, isError } = useApplicationCall(slug)

  if (isLoading) {
    return (
      <div className="space-y-6 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-6 h-12 w-2/3" />
          <Skeleton className="mt-8 h-48 w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  if (isError || !call) {
    return (
      <Section className="py-24">
        <EmptyState
          title="Appel à candidatures introuvable"
          description="Cet appel à candidatures n'existe pas ou n'est plus accessible."
          action={
            <Button asChild className="rounded-full">
              <Link href="/opportunites">Retour aux opportunités</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  const isOpen = call.statut === "publie"
  const remaining = daysUntil(call.date_limite)

  return (
    <article className="overflow-hidden">
      {/* 1. Immersive Hero Section */}
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[460px] sm:min-h-[500px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="relative h-full w-full animate-ken-burns">
            <Image
              src="/assets/hero/DSC08045%20copie.jpg"
              alt={call.titre}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Multi-layered Cinematic Gradient Overlay */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/60 md:from-forest/95 md:via-forest/85 md:to-forest/50"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/60"
          aria-hidden
        />

        {/* Baobab Ambient Watermark */}
        <BaobabMark
          variant="white"
          size={560}
          className="pointer-events-none absolute -bottom-20 -right-20 hidden opacity-[0.08] lg:block"
        />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          {/* Breadcrumbs & Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/opportunites"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-accent transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Toutes les opportunités
            </Link>

            <nav aria-label="Fil d'Ariane" className="hidden sm:block">
              <ol className="flex items-center gap-1.5 text-xs text-white/70">
                <li>
                  <Link href="/" className="hover:text-accent">
                    Accueil
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li>
                  <Link href="/opportunites" className="hover:text-accent">
                    Opportunités
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li className="text-white font-medium truncate max-w-[200px]">
                  {call.titre}
                </li>
              </ol>
            </nav>
          </div>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
                isOpen
                  ? "bg-emerald-600 text-white"
                  : call.statut === "brouillon"
                  ? "bg-accent text-accent-foreground"
                  : "bg-white/20 text-white"
              }`}
            >
              {isOpen ? "Candidatures Ouvertes" : call.statut === "brouillon" ? "À Venir" : "Clôturé"}
            </span>

            <RegionBadge region={call.region} />

            {call.date_limite && isOpen && remaining !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-accent backdrop-blur-sm border border-amber-500/30">
                <CalendarClock className="size-3 text-accent" />
                Clôture dans {remaining} jours
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
            {call.titre}
          </h1>

          {/* Excerpt */}
          {call.resume && (
            <p className="mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed text-white/90 font-normal drop-shadow">
              {call.resume}
            </p>
          )}
        </div>
      </section>

      {/* 2. Main Content & Form Section */}
      <Section className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] items-start">
          
          {/* Main Column: Description & Form */}
          <div className="space-y-10">
            {/* Description Card */}
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-foreground">
                À propos de ce programme
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                {call.description}
              </p>

              {/* What selected candidates get */}
              <div className="mt-8 rounded-2xl bg-secondary/40 p-6 border border-border/80">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  Ce qui est inclus dans cet accompagnement :
                </h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>Mentorat d'experts & dirigeants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>Accès aux espaces de travail</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>Financements & bourses d'appui</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>Certificat officiel Casa Impact</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Application Form or Status State */}
            <div id="candidater" className="scroll-mt-24">
              {isOpen ? (
                <ApplicationForm call={call} />
              ) : (
                <div className="rounded-3xl border border-border bg-card p-10 text-center">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {call.statut === "brouillon"
                      ? "Candidatures pas encore ouvertes"
                      : "Candidatures clôturées"}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {call.statut === "brouillon"
                      ? "Cet appel ouvrira prochainement. Revenez à la date d'ouverture pour candidater."
                      : "Le délai fixé pour cet appel est dépassé. Vous pouvez explorer les autres opportunités ouvertes."}
                  </p>
                  <Button asChild className="mt-6 rounded-full">
                    <Link href="/opportunites">Voir les autres opportunités</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Key Specs Box */}
          <aside className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
              <h3 className="font-display text-base font-bold text-foreground border-b border-border pb-3">
                Fiche Récapitulative
              </h3>

              <dl className="mt-5 space-y-4 text-sm">
                {call.localisation && (
                  <InfoRow
                    icon={<MapPin className="size-4.5" />}
                    label="Localisation"
                    value={call.localisation}
                  />
                )}
                {call.date_ouverture && (
                  <InfoRow
                    icon={<CalendarClock className="size-4.5" />}
                    label="Date d'ouverture"
                    value={formatDate(call.date_ouverture)}
                  />
                )}
                {call.date_limite && (
                  <InfoRow
                    icon={<CalendarClock className="size-4.5" />}
                    label="Date limite de clôture"
                    value={`${formatDate(call.date_limite)}${
                      isOpen && remaining !== null && remaining >= 0 ? ` (J-${remaining})` : ""
                    }`}
                  />
                )}
                {call.nombre_places && (
                  <InfoRow
                    icon={<Users className="size-4.5" />}
                    label="Places disponibles"
                    value={`${call.nombre_places} places retenues`}
                  />
                )}
                <InfoRow
                  icon={<ShieldCheck className="size-4.5" />}
                  label="Coût de participation"
                  value="100% Pris en charge"
                />
              </dl>

              {isOpen && (
                <Button asChild className="mt-8 w-full rounded-full bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:bg-forest hover:text-white transition-all">
                  <a href="#candidater">Déposer ma candidature</a>
                </Button>
              )}
            </div>
          </aside>

        </div>
      </Section>
    </article>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 font-display text-sm font-bold text-foreground">{value}</dd>
      </div>
    </div>
  )
}
