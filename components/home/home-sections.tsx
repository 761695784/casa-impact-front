"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Quote,
  Sparkles,
  Cpu,
  Palette,
  Trophy,
  Compass,
  Globe2,
  CheckCircle2,
  Calendar,
  Layers,
  Flame,
  Award,
  Rocket,
} from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { Button } from "@/components/ui/button"
import { RegionBadge } from "@/components/cards/region-badge"
import { formatDate } from "@/lib/format"
import { useApplicationCalls, usePrograms } from "@/hooks/use-content"
import { institution, domainesIntervention, impactAttendu, president, territoires } from "@/lib/institution"

/* ---------------- Manifeste ---------------- */
export function HomeManifesto() {
  return (
    <Section className="relative overflow-hidden pb-12 pt-20 md:pb-16 md:pt-28">
      {/* Background soft ambient glow */}
      <div
        className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-forest/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-center">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Manifeste & Raison d'être
          </div>

          <h2 className="mt-6 text-pretty font-display text-3xl font-bold leading-[1.12] text-foreground sm:text-4xl lg:text-[2.6rem]">
            Une plateforme d'action, d'innovation et de{" "}
            <span className="text-primary">
              transformation sociale
            </span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {institution.intro}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-forest hover:text-white px-6 justify-center"
            >
              <Link href="/qui-sommes-nous" className="flex items-center justify-center gap-2">
                <span>Découvrir notre histoire</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border border-border bg-card text-foreground font-medium hover:bg-secondary px-6 justify-center"
            >
              <Link href="/qui-sommes-nous#mot-du-president" className="flex items-center justify-center">
                <span>Mot du Président</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="flex flex-col gap-5">
          <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-7 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-forest text-white shadow-sm">
                <Compass className="size-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-forest">Notre Vision</span>
                <h3 className="text-base font-bold text-foreground">Un territoire de référence</h3>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-foreground/85 text-sm sm:text-base">
              {institution.vision}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-earth/20 bg-gradient-to-br from-earth/5 via-background to-background p-7 shadow-sm transition-all hover:border-earth/40 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-earth text-white shadow-sm">
                <Flame className="size-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-earth">Notre Mission</span>
                <h3 className="text-base font-bold text-foreground">Former, entreprendre, valoriser</h3>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-foreground/85 text-sm sm:text-base">
              {institution.mission}
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------------- Territoires ---------------- */
const territoryMeta = [
  {
    nom: "Ziguinchor",
    tag: "Cœur historique & littoral",
    gradient: "from-forest/10 via-forest/5 to-transparent",
    border: "border-forest/25 hover:border-forest",
    badgeBg: "bg-forest/10 text-forest",
    numColor: "text-forest/30",
    accentBg: "bg-forest",
  },
  {
    nom: "Kolda",
    tag: "Agro-écologie & Jeunesse",
    gradient: "from-accent/15 via-accent/5 to-transparent",
    border: "border-accent/30 hover:border-accent",
    badgeBg: "bg-accent/15 text-accent-foreground",
    numColor: "text-accent/35",
    accentBg: "bg-accent",
  },
  {
    nom: "Sédhiou",
    tag: "Traditions & Terroirs d'avenir",
    gradient: "from-earth/10 via-earth/5 to-transparent",
    border: "border-earth/25 hover:border-earth",
    badgeBg: "bg-earth/10 text-earth",
    numColor: "text-earth/30",
    accentBg: "bg-earth",
  },
]

export function HomeTerritories() {
  return (
    <Section tone="muted" className="relative">
      <SectionHeading
        eyebrow="Trois régions, une vision"
        title="Un mouvement solidement ancré dans les terroirs"
        description="Casa Impact fédère les forces vives de toute la Casamance naturelle pour créer des synergies économiques et humaines uniques."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {territoires.map((t, i) => {
          const meta = territoryMeta[i % territoryMeta.length]
          return (
            <div
              key={t.nom}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${meta.border}`}
            >
              {/* Corner ambient gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-60`} aria-hidden />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${meta.badgeBg}`}>
                    {meta.tag}
                  </span>
                  <span className={`font-display text-4xl font-bold tabular-nums ${meta.numColor}`}>
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                  {t.nom}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t.description}
                </p>
              </div>

              <div className="relative mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${meta.accentBg}`} />
                  Région engagée
                </span>
                <span className="text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  Découvrir
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

/* ---------------- Domaines d'intervention (Bento Grid) ---------------- */
const domainIcons = [
  { icon: Sparkles, color: "text-forest", bg: "bg-forest/10", border: "hover:border-forest/50" },
  { icon: Cpu, color: "text-accent-foreground", bg: "bg-accent/20", border: "hover:border-accent" },
  { icon: Palette, color: "text-earth", bg: "bg-earth/10", border: "hover:border-earth/50" },
  { icon: Trophy, color: "text-forest", bg: "bg-forest/10", border: "hover:border-forest/50" },
  { icon: Compass, color: "text-accent-foreground", bg: "bg-accent/20", border: "hover:border-accent" },
  { icon: Globe2, color: "text-earth", bg: "bg-earth/10", border: "hover:border-earth/50" },
]

export function HomeDomains() {
  return (
    <Section className="relative">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Domaines d'intervention"
          title="Six leviers stratégiques pour transformer la Casamance"
          description="De la formation des jeunes à la mobilisation de la diaspora, nos actions s'articulent autour de piliers concrets et porteurs d'avenir."
          className="mb-0"
        />
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/domaines" className="flex items-center gap-2">
            Tous les domaines
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {domainesIntervention.map((d, i) => {
          const visual = domainIcons[i % domainIcons.length]
          const Icon = visual.icon
          return (
            <Link
              key={d.slug}
              href={`/domaines/${d.slug}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${visual.border}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex size-11 items-center justify-center rounded-xl ${visual.bg} ${visual.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="font-display text-sm font-bold text-muted-foreground/60 tabular-nums">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {d.nom}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {d.resume}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span>Explorer ce domaine</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}

/* ---------------- Opportunités & programmes ---------------- */
export function HomeOpportunitiesPrograms() {
  const { data: calls, isLoading: callsLoading } = useApplicationCalls()
  const { data: programs, isLoading: programsLoading } = usePrograms()

  const openCalls = (calls ?? []).filter((c) => c.statut === "publie").slice(0, 2)
  const featuredPrograms = (programs ?? []).slice(0, 3)
  const isLoading = callsLoading || programsLoading

  if (!isLoading && openCalls.length === 0 && featuredPrograms.length === 0) return null

  return (
    <Section tone="muted">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Opportunités & programmes"
          title="Des portes d'entrée concrètes pour s'engager"
          description="Découvrez les appels à candidatures ouverts et les parcours d'accompagnement proposés par Casa Impact."
          className="mb-0"
        />
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/opportunites" className="flex items-center gap-2">
            Voir toutes les opportunités
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Open Calls */}
        <div className="rounded-3xl border border-border bg-background p-5 sm:p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border pb-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex size-2.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-primary truncate">
                Appels à candidatures ouverts
              </h3>
            </div>
            <Link
              href="/appels-a-candidatures"
              className="text-xs font-semibold text-primary hover:underline shrink-0 inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Tous les appels</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <ul className="mt-5 flex flex-col gap-4">
            {openCalls.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/appels-a-candidatures/${c.slug}`}
                  className="group flex flex-col justify-between gap-3 rounded-xl border border-border/80 bg-secondary/30 p-4 transition-all hover:border-primary/50 hover:bg-secondary/70 sm:flex-row sm:items-center"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <RegionBadge region={c.region} />
                      {c.date_limite && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <Calendar className="size-3" />
                          Clôture : {formatDate(c.date_limite)}
                        </span>
                      )}
                    </div>
                    <span className="mt-2 block font-display text-base font-bold text-foreground group-hover:text-primary truncate">
                      {c.titre}
                    </span>
                  </div>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div className="rounded-3xl border border-border bg-background p-5 sm:p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border pb-4">
            <div className="flex items-center gap-2 min-w-0">
              <Layers className="size-4 text-earth shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-earth truncate">
                Programmes d'accompagnement
              </h3>
            </div>
            <Link
              href="/programmes"
              className="text-xs font-semibold text-earth hover:underline shrink-0 inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Tous les programmes</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <ul className="mt-5 flex flex-col gap-4">
            {featuredPrograms.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/programmes/${p.slug}`}
                  className="group flex flex-col justify-between gap-3 rounded-xl border border-border/80 bg-secondary/30 p-4 transition-all hover:border-earth/50 hover:bg-secondary/70 sm:flex-row sm:items-center"
                >
                  <div className="flex-1 min-w-0">
                    {p.region && <RegionBadge region={p.region} />}
                    <span className="mt-2 block font-display text-base font-bold text-foreground group-hover:text-earth truncate">
                      {p.titre}
                    </span>
                    <span className="line-clamp-1 mt-1 text-xs text-muted-foreground">
                      {p.resume}
                    </span>
                  </div>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-earth/10 text-earth transition-transform group-hover:translate-x-0.5 group-hover:bg-earth group-hover:text-earth-foreground">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

/* ---------------- Impact attendu ---------------- */
export function HomeImpact() {
  const impactIcons = [Award, Rocket, Globe2, Sparkles]

  return (
    <Section tone="dark" className="relative overflow-hidden py-20">
      {/* Background Watermark and Ambient Lights */}
      <BaobabMark
        variant="white"
        size={620}
        className="pointer-events-none absolute -bottom-24 -left-28 hidden opacity-[0.06] md:block"
      />
      <div
        className="pointer-events-none absolute -right-32 top-10 size-80 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <SectionHeading
        invert
        eyebrow="Impact attendu"
        title="Les transformations majeures que nous visons"
        description="Notre ambition se mesure aux transformations structurelles et durables que nous construisons pas à pas pour la Casamance."
      />

      <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {impactAttendu.map((item, i) => {
          const Icon = impactIcons[i % impactIcons.length]
          return (
            <div
              key={item.titre}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:bg-white/10 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-display text-2xl font-bold text-accent/70 tabular-nums">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-bold leading-snug text-white">
                  {item.titre}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-accent">
                <CheckCircle2 className="size-3.5" />
                <span>Objectif prioritaire</span>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

/* ---------------- Mot du Président (teaser éditorial) ---------------- */
export function HomePresident() {
  return (
    <Section className="relative overflow-hidden py-20">
      <div className="relative mx-auto max-w-6xl rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-background to-secondary/30 p-8 shadow-sm sm:p-12 lg:p-16">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center lg:gap-16">
          
          {/* President Portrait Frame */}
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-forest/20 bg-secondary shadow-xl md:mx-0">
            <Image
              src={president.photo}
              alt={`${president.nom}, ${president.fonction} de Casa Impact`}
              fill
              sizes="(max-width: 768px) 80vw, 40vw"
              className="object-cover object-top"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-display text-lg font-bold">{president.nom}</p>
              <p className="text-xs text-white/80">{president.fonction}</p>
            </div>
          </div>

          {/* President Quote */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              <Quote className="size-3.5" />
              <span>Mot d'engagement</span>
            </div>

            <blockquote className="mt-6 text-pretty font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl lg:text-4xl">
              "{president.citation}"
            </blockquote>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              De Ziguinchor à Sédhiou en passant par Kolda, nous croyons qu'il est temps de raconter notre propre histoire, de valoriser nos talents et d'offrir à notre jeunesse les moyens de transformer son territoire.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-10 w-1 rounded-full bg-accent" />
              <div>
                <p className="font-bold text-foreground">{president.nom}</p>
                <p className="text-xs text-muted-foreground">{president.origine}</p>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild className="rounded-full bg-forest text-white hover:bg-forest/90">
                <Link href="/qui-sommes-nous#mot-du-president" className="flex items-center gap-2">
                  Lire l'adresse intégrale
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Section>
  )
}
