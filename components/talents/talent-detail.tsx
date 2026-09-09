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
  Share2,
  CheckCircle2,
  HeartHandshake,
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
  const domainName = talent.domain?.nom || talent.domaine?.nom || talent.domaine_activite

  return (
    <Link
      href={`/talents/${talent.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        <Image
          src={photoUrl || "/assets/team/placeholder.svg"}
          alt={talent.nom}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {talent.region && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white border border-white/20">
            <MapPin className="size-3 text-accent" />
            {REGION_LABELS[talent.region] || talent.region}
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h4 className="font-display text-base font-bold text-white group-hover:text-accent transition-colors drop-shadow-sm">
            {talent.nom}
          </h4>
          {domainName && (
            <p className="mt-0.5 text-xs font-medium text-white/80 line-clamp-1">
              {domainName}
            </p>
          )}
        </div>
      </div>
      <div className="p-4 bg-card flex items-center justify-between border-t border-border/50 text-xs font-semibold text-primary">
        <span>Découvrir le portrait</span>
        <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
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
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            <Skeleton className="lg:col-span-5 h-[450px] rounded-3xl" />
            <Skeleton className="lg:col-span-7 h-[450px] rounded-3xl" />
          </div>
        </div>
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
            <Button asChild className="rounded-full bg-primary text-white">
              <Link href="/talents">Retour à la liste des talents</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  const photo = getTalentPhotoUrl(talent) || "/assets/team/placeholder.svg"
  const domainName = talent.domain?.nom || talent.domaine?.nom || talent.domaine_activite
  const storyTitle = talent.recit_titre || `L'histoire et l'engagement de ${talent.nom}`
  const storyBody =
    talent.recit_corps ||
    talent.presentation ||
    talent.bio ||
    talent.parcours ||
    "Ce talent participe activement au dynamisme territorial de la Casamance à travers ses initiatives, son engagement communautaire et son excellence professionnelle."

  // Normalisation des liens
  const rawLinks = talent.liens_externes || talent.liens || []
  const externalLinks = Array.isArray(rawLinks)
    ? rawLinks.map((item) => {
        if (typeof item === "string") {
          let label = item
          try {
            label = new URL(item).hostname.replace("www.", "")
          } catch {
            // keep raw string
          }
          return { label, url: item }
        }
        return item
      })
    : []

  return (
    <article className="overflow-hidden bg-background">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION UNIFORME POUR TOUS LES TALENTS (Branding Forest Green)     */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] flex items-center pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-16">
        {/* Arrière-plan cinématique UNIFORME pour tous les talents */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="relative h-full w-full animate-ken-burns">
            <Image
              src="/assets/hero/DSC08048%20copie.jpg"
              alt="Talents et potentiel de la Casamance"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Dégradés superposés d'ambiance Vert Forêt signature Casa Impact */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/98 via-forest/92 to-forest/80 md:from-forest/96 md:via-forest/90 md:to-forest/70"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-forest/60 to-black/50"
          aria-hidden
        />

        {/* Halo décoratif & filigrane Baobab */}
        <div className="pointer-events-none absolute -top-24 left-1/4 size-96 rounded-full bg-accent/15 blur-3xl -z-10" />
        <BaobabMark
          variant="white"
          size={560}
          className="pointer-events-none absolute -bottom-24 -right-20 hidden opacity-[0.08] lg:block lg:w-[460px] -z-10"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Navigation & Fil d'Ariane */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/talents"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/85 transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-3.5" />
              Tous les talents
            </Link>

            <nav aria-label="Fil d'Ariane" className="hidden sm:block">
              <ol className="flex items-center gap-1.5 text-xs text-white/70">
                <li>
                  <Link href="/" className="hover:text-accent transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li>
                  <Link href="/talents" className="hover:text-accent transition-colors">
                    Talents
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li className="font-medium text-white truncate max-w-[220px]">
                  {talent.nom}
                </li>
              </ol>
            </nav>
          </div>

          {/* Badges strip harmonieux */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white border border-white/20">
              <Trophy className="size-3.5 text-accent" />
              <span>Portrait de Talent</span>
            </div>

            {talent.region && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm border backdrop-blur-md ${
                  regionBadgeColors[talent.region] || "bg-white/15 text-white border-white/20"
                }`}
              >
                <MapPin className="size-3.5" />
                {REGION_LABELS[talent.region] || talent.region}
              </span>
            )}

            {domainName && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold text-accent backdrop-blur-md border border-accent/30">
                <Sparkles className="size-3.5" />
                {domainName}
              </span>
            )}
          </div>

          {/* Nom du talent en grand titre */}
          <h1 className="mt-5 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
            {talent.nom}
          </h1>

          {/* Présentation / Pitch d'accroche */}
          <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-white/90 font-normal drop-shadow">
            {talent.presentation || talent.bio || "Figure inspirante engagée pour le rayonnement et l'impact positif en Casamance."}
          </p>

          {/* Fiche d'ancrage rapide */}
          <div className="mt-8 flex flex-wrap items-center gap-4 pt-4 border-t border-white/15 text-xs text-white/80">
            {talent.localisation && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-accent" />
                <span>Localisation : <strong className="text-white">{talent.localisation}</strong></span>
              </div>
            )}
            {domainName && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>Secteur : <strong className="text-white">{domainName}</strong></span>
              </div>
            )}
            {talent.programme && (
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="size-3.5 text-accent" />
                <span>Programme lié : <strong className="text-white">{talent.programme.titre}</strong></span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CONTENU PRINCIPAL : PHOTO À CÔTÉ DU RÉCIT DU TALENT                    */}
      {/* ========================================================================= */}
      <Section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* --------------------------------------------------------------------- */}
            {/* COLONNE GAUCHE : PHOTO DU TALENT + FICHE D'IDENTITÉ                   */}
            {/* --------------------------------------------------------------------- */}
            <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
              {/* Carte Photo Principale */}
              <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-2xl">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-secondary">
                  <Image
                    src={photo}
                    alt={talent.nom}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dégradé doux et informations incrustées sur la photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm mb-1.5">
                      Talent Référent
                    </span>
                    <h3 className="font-display text-xl font-bold text-white drop-shadow-sm">
                      {talent.nom}
                    </h3>
                    {domainName && (
                      <p className="text-xs text-white/85 font-medium line-clamp-1">
                        {domainName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Détails complémentaires sous la photo */}
                <div className="p-6 space-y-4 bg-card border-t border-border/60">
                  <div className="space-y-3 text-xs">
                    {talent.region && (
                      <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
                        <span className="text-muted-foreground">Région naturelle :</span>
                        <span className="font-bold text-foreground capitalize">
                          {REGION_LABELS[talent.region] || talent.region}
                        </span>
                      </div>
                    )}
                    {talent.localisation && (
                      <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
                        <span className="text-muted-foreground">Ancrage local :</span>
                        <span className="font-semibold text-foreground text-right">
                          {talent.localisation}
                        </span>
                      </div>
                    )}
                    {talent.domaine_activite && (
                      <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
                        <span className="text-muted-foreground">Activité :</span>
                        <span className="font-semibold text-foreground text-right">
                          {talent.domaine_activite}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted-foreground">Statut réseau :</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="size-3" /> Membre Actif
                      </span>
                    </div>
                  </div>

                  {/* Liens externes / Réseaux sociaux */}
                  {externalLinks.length > 0 && (
                    <div className="pt-3 border-t border-border/60">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                        Liens & Réseaux :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {externalLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-primary hover:text-white px-3 py-1.5 text-xs font-semibold text-foreground transition-colors border border-border/60"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="size-3 text-muted-foreground group-hover:text-white" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* --------------------------------------------------------------------- */}
            {/* COLONNE DROITE : RÉCIT DU TALENT & TOUTES LES AUTRES SECTIONS          */}
            {/* --------------------------------------------------------------------- */}
            <main className="lg:col-span-7 xl:col-span-8 space-y-8">
              
              {/* 1. Carte : Récit du Talent (Narration & Portrait) */}
              <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                    <Quote className="size-4.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary block">
                      Récit de Talent
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                      {storyTitle}
                    </h2>
                  </div>
                </div>

                {/* Corps de texte du récit */}
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 pt-2">
                  {storyBody.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className={`text-base sm:text-lg leading-relaxed text-foreground/90 font-normal ${
                        index === 0 ? "first-letter:font-display first-letter:text-3xl first-letter:font-bold first-letter:text-primary first-letter:mr-1" : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Encadré Citation du Talent si disponible */}
                {talent.temoignage && (
                  <div className="mt-8 rounded-2xl bg-forest/5 border border-forest/15 p-6 sm:p-7 relative overflow-hidden">
                    <Quote className="size-10 text-forest/20 absolute -bottom-2 right-4 pointer-events-none" />
                    <blockquote className="text-base sm:text-lg italic font-medium leading-relaxed text-forest dark:text-emerald-400">
                      « {talent.temoignage} »
                    </blockquote>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wider text-forest/80">
                      — {talent.nom}, Porteur d'impact en Casamance
                    </p>
                  </div>
                )}
              </section>

              {/* 2. Carte : Parcours & Expérience (si présent) */}
              {talent.parcours && (
                <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <BookOpen className="size-4" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Parcours & Expérience
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line pt-2">
                    {talent.parcours}
                  </p>
                </section>
              )}

              {/* 3. Carte : Le Projet & Vision (si présent) */}
              {talent.projet && (
                <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground shrink-0">
                      <Rocket className="size-4" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Le Projet & la Vision
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line pt-2">
                    {talent.projet}
                  </p>
                </section>
              )}

              {/* 4. Carte : Réalisations & Distinctions (si présent) */}
              {talent.realisations && (
                <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-earth/15 text-earth shrink-0">
                      <Trophy className="size-4" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Distinctions & Réalisations
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line pt-2">
                    {talent.realisations}
                  </p>
                </section>
              )}

              {/* Bouton retour vers tous les talents */}
              <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
                <Button asChild variant="outline" className="rounded-full px-6 h-11 border-border hover:bg-secondary">
                  <Link href="/talents" className="flex items-center gap-2">
                    <ArrowLeft className="size-4" />
                    <span>Découvrir tous les autres talents</span>
                  </Link>
                </Button>

                <Button asChild className="rounded-full px-6 h-11 bg-primary text-white hover:bg-primary/90">
                  <Link href="/contact" className="flex items-center gap-2">
                    <Share2 className="size-4" />
                    <span>Proposer un profil de talent</span>
                  </Link>
                </Button>
              </div>

            </main>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 3. D'AUTRES TALENTS DE LA CASAMANCE                                       */}
      {/* ========================================================================= */}
      {otherTalents.length > 0 && (
        <Section tone="muted" className="py-16 sm:py-20 border-t border-border">
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
