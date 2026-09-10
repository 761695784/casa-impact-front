"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Layers,
  MapPin,
  Share2,
  Sparkles,
  Tag,
  Users,
  Check,
  Building2,
  FileCheck,
  Target,
} from "lucide-react"
import { toast } from "sonner"
import { useProgram, usePrograms, useApplicationCalls } from "@/hooks/use-content"
import { getProgramMetadata } from "@/lib/program-visuals"
import { Section, SectionHeading } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"
import { RegionBadge } from "@/components/cards/region-badge"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { REGION_LABELS } from "@/types/enums"

export function ProgramDetail({ slug }: { slug: string }) {
  const { data: program, isLoading, isError } = useProgram(slug)
  const { data: allPrograms } = usePrograms()
  const { data: allCalls } = useApplicationCalls()
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Lien copié !", {
        description: "Le lien vers ce programme a été copié dans votre presse-papier.",
      })
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-6 h-12 w-2/3" />
          <Skeleton className="mt-8 aspect-[21/9] w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  if (isError || !program) {
    return (
      <Section className="py-24">
        <EmptyState
          icon={<GraduationCap className="size-8" />}
          title="Programme introuvable"
          description="Ce programme n'existe pas ou n'est plus accessible."
          action={
            <Link href="/programmes" className={buttonVariants({ className: "rounded-full" })}>
              Retour aux programmes
            </Link>
          }
        />
      </Section>
    )
  }

  const meta = getProgramMetadata(program.slug)
  const Icon = meta.icon
  const coverImage = program.image || meta.image || "/assets/hero/DSC08048%20copie.jpg"

  // Related calls for this program
  const relatedCalls = (allCalls ?? []).filter(
    (c) => c.programme_id === program.id || c.programme?.slug === program.slug,
  )

  // Other programs (exclude current)
  const otherPrograms = (allPrograms ?? [])
    .filter((p) => p.slug !== program.slug)
    .slice(0, 3)

  return (
    <article className="overflow-hidden">
      {/* 1. Immersive Forest Green Hero Section */}
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center pt-6 sm:pt-8 md:pt-10 pb-12">
        {/* Background Image with Ken Burns */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="relative h-full w-full animate-ken-burns">
            <Image
              src={coverImage}
              alt={program.titre}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Multi-layered Cinematic Forest Green Gradient Overlays */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/98 via-forest/90 to-forest/75 md:from-forest/95 md:via-forest/85 md:to-forest/50"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/50"
          aria-hidden
        />

        {/* Ambient Glow & Baobab Watermark Accent */}
        <div className="pointer-events-none absolute -top-24 left-1/4 size-96 rounded-full bg-accent/15 blur-3xl -z-10" />
        <BaobabMark
          variant="white"
          size={560}
          className="pointer-events-none absolute -bottom-24 -right-20 hidden opacity-[0.08] lg:block lg:w-[460px] -z-10"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation & Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/85 transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-3.5" />
              Tous les programmes
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
                  <Link href="/programmes" className="hover:text-accent transition-colors">
                    Programmes
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li className="font-medium text-white truncate max-w-[220px]">
                  {program.titre}
                </li>
              </ol>
            </nav>
          </div>

          {/* Badges strip */}
          <div className="flex flex-wrap items-center gap-2">
            {program.domaine && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-foreground shadow-md backdrop-blur-md">
                <Icon className="size-3.5 text-primary" />
                <span>{program.domaine.nom}</span>
              </div>
            )}
            {program.region && <RegionBadge region={program.region} />}
            {program.type && (
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-md">
                {program.type.nom}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-4 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
            {program.titre}
          </h1>

          {/* Tagline / Subtitle */}
          <p className="mt-3 max-w-3xl text-base sm:text-lg leading-relaxed text-white/90 font-normal drop-shadow">
            {meta.tagline || program.resume}
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-3xl">
            {meta.highlights.map((h, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/15 bg-black/25 p-3.5 backdrop-blur-md"
              >
                <span className="block text-xs uppercase tracking-wider text-white/75">
                  {h.label}
                </span>
                <span className="mt-1 block font-display text-lg font-bold text-white">
                  {h.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Body Grid: Content (Left) + Sidebar (Right) */}
      <Section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1fr_340px]">
          
          {/* Main Content Column */}
          <div className="space-y-16">
            
            {/* Presentation & Context */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Vision & Enjeux
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
                Pourquoi ce programme en Casamance ?
              </h2>
              <div className="mt-4 text-base sm:text-lg leading-relaxed text-foreground/90 font-normal space-y-4">
                <p>{program.description || program.resume}</p>
              </div>

              {/* Key Benefits */}
              <div className="mt-8 rounded-3xl border border-border bg-secondary/30 p-6 sm:p-8">
                <h3 className="font-display text-base font-bold text-foreground">
                  Ce que vous apporte ce programme :
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {meta.keyBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modules & Piliers Pédagogiques */}
            <div>
              <SectionHeading
                eyebrow="Structure Pédagogique"
                title="Les 4 Piliers & Modules du Programme"
                description="Un parcours complet articulé autour de modules pratiques pour garantir des résultats tangibles."
              />

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {meta.modules.map((mod) => (
                  <div
                    key={mod.number}
                    className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                  >
                    <div>
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-mono font-bold text-sm">
                        {mod.number}
                      </div>
                      <h3 className="mt-4 font-display text-base font-bold text-foreground">
                        {mod.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {mod.desc}
                      </p>
                    </div>

                    {mod.deliverable && (
                      <div className="mt-6 pt-4 border-t border-border/50">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                          Livrable clé :
                        </span>
                        <p className="mt-0.5 text-xs font-medium text-primary">
                          {mod.deliverable}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience & Eligibility */}
            <div>
              <SectionHeading
                eyebrow="Profils & Prérequis"
                title="Public Cible & Conditions d'Accès"
                description="Découvrez si ce programme correspond à votre profil et vos projets."
              />

              <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground">
                    <Target className="size-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {meta.targetAudience.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {meta.targetAudience.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Critères d'éligibilité :
                  </h4>
                  <ul className="space-y-3">
                    {meta.targetAudience.criteria.map((crit, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                          ✓
                        </span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline / Chronologie des 4 Phases */}
            <div>
              <SectionHeading
                eyebrow="Déroulement"
                title="Les 4 Étapes du Parcours"
                description="Une méthodologie éprouvée, rythmée par des jalons clairs et des livrables évalués."
              />

              <div className="mt-8 relative border-l-2 border-primary/20 pl-6 ml-3 space-y-8">
                {meta.phases.map((phase, i) => (
                  <div key={i} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1 flex size-6 items-center justify-center rounded-full border-2 border-primary bg-background text-primary text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {i + 1}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 group-hover:border-primary/40">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          {phase.step}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          <Clock className="size-3" />
                          {phase.duration}
                        </span>
                      </div>

                      <h3 className="mt-2 font-display text-base font-bold text-foreground">
                        {phase.title}
                      </h3>

                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {phase.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Application Calls (Appels à candidatures) */}
            <div id="candidatures">
              <SectionHeading
                eyebrow="Rejoindre une Promotion"
                title="Appels à Candidatures en Cours"
                description="Postulez dès maintenant pour intégrer la prochaine cohorte de ce programme."
              />

              <div className="mt-8">
                {relatedCalls.length > 0 ? (
                  <div className="space-y-4">
                    {relatedCalls.map((call) => (
                      <div
                        key={call.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/10 via-background to-secondary/40 p-6 sm:p-8 shadow-sm"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                              <Sparkles className="size-3" />
                              Candidature Ouverte
                            </span>
                            {call.date_limite && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <Calendar className="size-3.5" />
                                Clôture le {call.date_limite}
                              </span>
                            )}
                          </div>

                          <h3 className="font-display text-lg font-bold text-foreground">
                            {call.titre}
                          </h3>

                          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                            {call.resume || call.description}
                          </p>

                          {call.nombre_places && (
                            <p className="text-xs font-semibold text-primary">
                              {call.nombre_places} places disponibles pour cette session
                            </p>
                          )}
                        </div>

                        <Link
                          href="/opportunites"
                          className={buttonVariants({
                            size: "lg",
                            className:
                              "rounded-full bg-accent text-accent-foreground font-bold hover:bg-accent/90 shrink-0",
                          })}
                        >
                          <span>Postuler maintenant</span>
                          <ArrowRight className="size-4 ml-1.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-border bg-secondary/30 p-8 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Calendar className="size-6" />
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold text-foreground">
                      Prochaine cohorte en cours de programmation
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                      Les inscriptions pour la session suivante ouvriront prochainement. Rejoignez la communauté Casa Impact pour être prévenu en priorité.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        href="/adherer"
                        className={buttonVariants({ className: "rounded-full" })}
                      >
                        Adhérer pour être notifié
                      </Link>
                      <Link
                        href="/contact"
                        className={buttonVariants({ variant: "outline", className: "rounded-full" })}
                      >
                        Nous contacter
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-6">
            
            {/* 1. Summary Information Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-foreground">
                Fiche Synthétique
              </h2>

              <dl className="mt-5 space-y-4 text-sm divide-y divide-border/60">
                {program.domaine && (
                  <div className="pt-3 first:pt-0">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Domaine d'intervention
                    </dt>
                    <dd className="mt-1 font-medium text-foreground flex items-center gap-1.5">
                      <Icon className="size-4 text-primary shrink-0" />
                      <span>{program.domaine.nom}</span>
                    </dd>
                  </div>
                )}

                {program.type && (
                  <div className="pt-3">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Format d'accompagnement
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {program.type.nom}
                    </dd>
                  </div>
                )}

                {program.region && (
                  <div className="pt-3">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Région principale
                    </dt>
                    <dd className="mt-1 font-medium text-foreground capitalize">
                      {REGION_LABELS[program.region] ?? program.region}
                    </dd>
                  </div>
                )}

                {program.localisation && (
                  <div className="pt-3">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Lieu de déploiement
                    </dt>
                    <dd className="mt-1 font-medium text-foreground flex items-center gap-1.5">
                      <MapPin className="size-4 text-primary shrink-0" />
                      <span>{program.localisation}</span>
                    </dd>
                  </div>
                )}

                {program.beneficiaires_count && program.beneficiaires_count > 0 ? (
                  <div className="pt-3">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Impact bénéficiaires
                    </dt>
                    <dd className="mt-1 font-medium text-foreground flex items-center gap-1.5">
                      <Users className="size-4 text-primary shrink-0" />
                      <span>+{program.beneficiaires_count} personnes formées</span>
                    </dd>
                  </div>
                ) : null}

                <div className="pt-3">
                  <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Statut du programme
                  </dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>Programme Actif</span>
                  </dd>
                </div>
              </dl>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <Link
                  href="#candidatures"
                  className={buttonVariants({
                    className:
                      "w-full rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90",
                  })}
                >
                  <span>Rejoindre la cohorte</span>
                </Link>
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full rounded-full",
                  })}
                >
                  <span>Poser une question</span>
                </Link>
              </div>
            </div>

            {/* 2. Social Share & Copy Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">
                  Partager ce programme
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Faites découvrir cette opportunité à vos proches.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="rounded-full gap-1.5 shrink-0"
              >
                {copied ? <Check className="size-3.5 text-primary" /> : <Share2 className="size-3.5" />}
                <span className="text-xs">{copied ? "Copié !" : "Partager"}</span>
              </Button>
            </div>

            {/* 3. Recommended / Other Programs */}
            {otherPrograms.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-display text-sm font-bold text-foreground">
                  Autres programmes à découvrir
                </h3>

                <div className="mt-4 space-y-3">
                  {otherPrograms.map((p) => {
                    const pMeta = getProgramMetadata(p.slug)
                    const PIcon = pMeta.icon
                    return (
                      <Link
                        key={p.id}
                        href={`/programmes/${p.slug}`}
                        className="group flex items-start gap-3 rounded-2xl border border-border/60 p-3 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/40"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <PIcon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {p.titre}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {p.resume}
                          </p>
                        </div>
                        <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

          </aside>

        </div>
      </Section>
    </article>
  )
}
