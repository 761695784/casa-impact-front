"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Rocket,
  ShieldCheck,
  Award,
  Layers,
} from "lucide-react"
import { useDomain, useDomains, usePrograms } from "@/hooks/use-content"
import { getDomainMetadata } from "@/lib/domain-visuals"
import { Section, SectionHeading } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { RegionBadge } from "@/components/cards/region-badge"
import { BaobabMark } from "@/components/brand/baobab-mark"

/**
 * Liste les intitulés des axes sous forme de phrase ("A, B, C et D"), pour
 * le chapeau du hero. Volontairement dérivé de `meta.axes` (déjà utilisé
 * plus bas pour les 4 cartes détaillées) plutôt que d'un texte séparé, pour
 * qu'il ne puisse jamais être désynchronisé des axes réellement affichés
 * sur la page.
 */
function formatAxesTitles(axes: { title: string }[]): string {
  const titles = axes.map((axis) => axis.title)
  if (titles.length <= 1) return titles.join("")
  return `${titles.slice(0, -1).join(", ")} et ${titles[titles.length - 1]}`
}

export function DomainDetail({ slug }: { slug: string }) {
  const { data: domain, isLoading, isError } = useDomain(slug)
  const { data: allDomains } = useDomains()
  const { data: programs } = usePrograms()

  if (isLoading) {
    return (
      <div className="space-y-6 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-6 h-12 w-2/3" />
          <Skeleton className="mt-8 aspect-[21/9] w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  if (isError || !domain) {
    return (
      <Section className="py-24">
        <EmptyState
          title="Domaine d'intervention introuvable"
          description="Ce domaine n'existe pas ou n'est plus disponible."
          action={
            <Button asChild className="rounded-full">
              <Link href="/domaines">Retour aux domaines</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  const meta = getDomainMetadata(domain.slug)
  const Icon = meta.icon
  const relatedPrograms = (programs ?? []).filter((p) => p.domaine?.slug === domain.slug)
  const otherDomains = (allDomains ?? []).filter((d) => d.slug !== domain.slug)

  return (
    <article className="overflow-hidden">
      {/* 1. Immersive Hero Section */}
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[500px] sm:min-h-[540px] flex items-center">
        {/* Background Image with Ken Burns */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="relative h-full w-full animate-ken-burns">
            <Image
              src={meta.image}
              alt={domain.nom}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Cinematic Gradient Overlay */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/55 md:from-forest/95 md:via-forest/85 md:to-forest/45"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/60"
          aria-hidden
        />

        {/* Baobab Ambient Watermark */}
        <BaobabMark
          variant="white"
          size={580}
          className="pointer-events-none absolute -bottom-24 -right-20 hidden opacity-[0.08] lg:block"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          {/* Breadcrumbs & Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/domaines"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-accent transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Tous les domaines
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
                  <Link href="/domaines" className="hover:text-accent">
                    Domaines
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li className="text-white font-medium truncate max-w-[200px]">
                  {domain.nom}
                </li>
              </ol>
            </nav>
          </div>

          {/* Icon Badge & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-white/95 text-primary shadow-xl backdrop-blur-md">
              <Icon className="size-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-md mb-2">
                <Sparkles className="size-3" />
                <span>Domaine d'Action Officiel</span>
              </div>
              <h1 className="text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
                {domain.nom}
              </h1>
            </div>
          </div>

          {/* Lead Summary — liste courte des axes, pas la description complète */}
          {meta.axes.length > 0 && (
            <p className="mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed text-white/90 font-normal drop-shadow">
              Ce domaine s'articule autour de {meta.axes.length} axes stratégiques : {formatAxesTitles(meta.axes)}.
            </p>
          )}
        </div>
      </section>

      {/* 2. Main Content & 4 Action Axes */}
      <Section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          
          {/* Detailed Presentation */}
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Vision & Enjeux
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
                Pourquoi ce domaine est crucial pour la Casamance
              </h2>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-foreground/90 font-normal">
                {meta.pitch}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/adherer" className="flex items-center gap-2">
                    <span>Participer à ce pôle</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/contact">Proposer un partenariat</Link>
                </Button>
              </div>
            </div>

            {/* Visual Cover inside Content */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-secondary shadow-xl">
              <Image
                src={meta.image}
                alt={domain.nom}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </div>

          {/* 4 Concrete Action Axes Cards */}
          <div>
            <SectionHeading
              eyebrow="Feuille de route"
              title="Les 4 Axes Stratégiques d'Intervention"
              description="Des actions concrètes menées sur le terrain pour des résultats mesurables et durables."
              align="center"
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {meta.axes.map((axis, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-mono font-bold text-sm">
                      0{i + 1}
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-foreground leading-snug">
                      {axis.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {axis.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-primary">
                    <CheckCircle2 className="size-3.5" />
                    <span>Déploiement en cours</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Territorial Coverage Box */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="size-3.5" />
                  <span>3 Régions Unies</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                  Un Déploiement Harmonieux sur Toute la Casamance
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Nos coordinateurs et cellules de terrain veillent à ce que chaque département bénéficie équitablement des programmes de ce domaine.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-center">
                  <span className="font-display text-lg font-bold text-primary">Ziguinchor</span>
                  <p className="mt-1 text-xs text-muted-foreground">Hub littoral & universités</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-center">
                  <span className="font-display text-lg font-bold text-earth">Kolda</span>
                  <p className="mt-1 text-xs text-muted-foreground">Pôle agro-pastoral & jeunesse</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-center">
                  <span className="font-display text-lg font-bold text-accent-foreground">Sédhiou</span>
                  <p className="mt-1 text-xs text-muted-foreground">Foyer culturel & artisanal</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Section>

      {/* 3. Related Programs Section */}
      {relatedPrograms.length > 0 && (
        <Section tone="muted" className="py-20 border-t border-border">
          <SectionHeading
            eyebrow="Programmes associés"
            title={`Initiatives en cours dans le domaine ${domain.nom}`}
            description="Découvrez les cohortes et ateliers spécifiques à ce secteur d'action."
            align="center"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPrograms.map((p) => (
              <Link
                key={p.id}
                href={`/programmes/${p.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  {p.region ? <RegionBadge region={p.region} /> : null}
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {p.titre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {p.resume}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>En savoir plus</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* 4. Explore Other Domains */}
      {otherDomains.length > 0 && (
        <Section className="py-20 border-t border-border">
          <SectionHeading
            eyebrow="Explorer les autres piliers"
            title="Les 5 Autres Domaines d'Intervention"
            description="Découvrez les autres leviers stratégiques déployés par Casa Impact."
            align="center"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherDomains.slice(0, 3).map((d) => {
              const otherMeta = getDomainMetadata(d.slug)
              const OtherIcon = otherMeta.icon
              return (
                <Link
                  key={d.id}
                  href={`/domaines/${d.slug}`}
                  className="group flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <OtherIcon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {d.nom}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {otherMeta.pitch}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/domaines" className="flex items-center gap-2">
                <Layers className="size-4" />
                <span>Voir la liste complète des 6 domaines</span>
              </Link>
            </Button>
          </div>
        </Section>
      )}
    </article>
  )
}
