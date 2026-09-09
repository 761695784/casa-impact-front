"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  ChevronRight,
  Quote,
  ExternalLink,
  Rocket,
  Trophy,
  BookOpen,
} from "lucide-react"
import { useTalent, useTalents } from "@/hooks/use-content"
import { Section, SectionHeading } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { getTalentPhotoUrl } from "@/lib/format"
import { REGION_LABELS, type Region } from "@/types/enums"
import { BaobabMark } from "@/components/brand/baobab-mark"
import type { Talent } from "@/types/models"

const regionBadgeColors: Record<Region, string> = {
  ziguinchor: "bg-forest/15 text-forest border-forest/30",
  kolda: "bg-accent/25 text-accent-foreground border-accent/40",
  sedhiou: "bg-earth/15 text-earth border-earth/30",
}

function TalentMiniCard({ talent }: { talent: Talent }) {
  const photoUrl = getTalentPhotoUrl(talent)
  return (
    <Link
      href={`/talents/${talent.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        <Image
          src={photoUrl || "/assets/team/placeholder.svg"}
          alt={talent.nom}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
          {talent.nom}
        </h4>
        {talent.domain?.nom && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {talent.domain.nom}
          </p>
        )}
      </div>
    </Link>
  )
}

export function TalentDetail({ slug }: { slug: string }) {
  const { data: talent, isLoading, isError } = useTalent(slug)
  const { data: allTalents } = useTalents()

  const otherTalents = (allTalents ?? []).filter((t) => t.slug !== slug).slice(0, 3)

  if (isLoading) {
    return (
      <Section className="py-24">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </Section>
    )
  }

  if (isError || !talent) {
    return (
      <Section className="py-24">
        <EmptyState
          title="Talent introuvable"
          description="Ce profil n'existe pas ou n'est plus disponible."
          action={
            <Button asChild className="rounded-full">
              <Link href="/talents">Retour aux talents</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  const photo = getTalentPhotoUrl(talent) || "/assets/team/placeholder.svg"

  return (
    <article className="overflow-hidden">
      {/* 1. Hero */}
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[480px] sm:min-h-[520px] flex items-center">
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="relative h-full w-full animate-ken-burns">
            <Image
              src={photo}
              alt={talent.nom}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/60 md:from-forest/95 md:via-forest/85 md:to-forest/50"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/60"
          aria-hidden
        />

        <BaobabMark
          variant="white"
          size={560}
          className="pointer-events-none absolute -bottom-20 -right-20 hidden opacity-[0.08] lg:block"
        />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/talents"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-accent transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Retour aux talents
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
                  <Link href="/talents" className="hover:text-accent">
                    Talents
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li className="text-white font-medium truncate max-w-[200px]">
                  {talent.nom}
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {talent.region && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm border backdrop-blur-sm ${
                  regionBadgeColors[talent.region] || "bg-white/10 text-white border-white/15"
                }`}
              >
                <MapPin className="size-3" />
                {REGION_LABELS[talent.region]}
              </span>
            )}
            {talent.domain?.nom && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/15">
                <Sparkles className="size-3 text-accent" />
                {talent.domain.nom}
              </span>
            )}
          </div>

          <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
            {talent.nom}
          </h1>

          {talent.presentation && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {talent.presentation}
            </p>
          )}
        </div>
      </section>

      {/* 2. Body */}
      <Section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-sm space-y-10">
            {/* Récit / narration */}
            {(talent.recit_titre || talent.recit_corps) && (
              <div>
                {talent.recit_titre && (
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    {talent.recit_titre}
                  </h2>
                )}
                {talent.recit_corps && (
                  <div className="prose prose-lg prose-neutral max-w-none dark:prose-invert space-y-4">
                    {talent.recit_corps.split("\n\n").map((para, idx) => (
                      <p key={idx} className="text-base sm:text-lg leading-relaxed text-foreground/90 font-normal">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Parcours */}
            {talent.parcours && (
              <div className="border-t border-border pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <BookOpen className="size-4" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Parcours & Réalisations
                  </h2>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                  {talent.parcours}
                </p>
              </div>
            )}

            {/* Projet */}
            {talent.projet && (
              <div className="border-t border-border pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground shrink-0">
                    <Rocket className="size-4" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Le Projet
                  </h2>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                  {talent.projet}
                </p>
              </div>
            )}

            {/* Réalisations (champ dédié, distinct du bloc parcours ci-dessus) */}
            {talent.realisations && (
              <div className="border-t border-border pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-earth/15 text-earth shrink-0">
                    <Trophy className="size-4" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Distinctions & Réalisations
                  </h2>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                  {talent.realisations}
                </p>
              </div>
            )}

            {/* Témoignage du talent, sous forme de citation */}
            {talent.temoignage && (
              <div className="border-t border-border pt-8">
                <div className="rounded-2xl bg-secondary/50 p-6 sm:p-8 relative">
                  <Quote className="size-8 text-primary/30 mb-3" />
                  <blockquote className="text-base sm:text-lg italic leading-relaxed text-foreground/90 break-words [overflow-wrap:anywhere]">
                    « {talent.temoignage} »
                  </blockquote>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">
                    — {talent.nom}
                  </p>
                </div>
              </div>
            )}

            {/* Liens externes */}
            {talent.liens_externes && talent.liens_externes.length > 0 && (
              <div className="border-t border-border pt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  En savoir plus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {talent.liens_externes.map((url, idx) => {
                    let label = url
                    try {
                      label = new URL(url).hostname
                    } catch {
                      // URL non parsable : on garde l'URL brute comme libellé
                    }
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <span>{label}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/talents" className="flex items-center gap-2">
                <ArrowLeft className="size-4" />
                Voir tous les autres talents
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* 3. Autres talents */}
      {otherTalents.length > 0 && (
        <Section tone="muted" className="py-20 border-t border-border">
          <SectionHeading
            eyebrow="Découvrir aussi"
            title="D'autres Talents de la Casamance"
            description="Explorez d'autres portraits inspirants issus des régions de Ziguinchor, Sédhiou et Kolda."
            align="center"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherTalents.map((t) => (
              <TalentMiniCard key={t.id} talent={t} />
            ))}
          </div>
        </Section>
      )}
    </article>
  )
}
