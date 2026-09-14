"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Handshake, ArrowRight, Sparkles } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { usePartners } from "@/hooks/use-content"
import { getPartnerLogoUrl } from "@/lib/format"

export function HomePartners() {
  // Correctif du 2026-09-14 (demande explicite : "enleve moi les mockup et
  // fais que ça affiche ce vient directement de l'api") — le marquee
  // n'affiche plus que les VRAIS partenaires actifs renvoyés par
  // GET /api/public/partners (via usePartners → contentService.listPartners,
  // déjà branché sur l'API réelle). Le tableau DEFAULT_PARTNERS
  // (Majeli Connect / Intello Créative en dur) a été retiré : ces deux
  // partenaires ne s'affichent que s'ils existent réellement côté admin,
  // avec un logo, comme n'importe quel autre partenaire.
  const { data: partnersData, isLoading } = usePartners()

  const activePartners = (partnersData ?? []).filter(
    (p) => p.statut === "actif" && getPartnerLogoUrl(p)
  )

  // Répétition pour assurer un défilement infini fluide sans coupure visuelle
  const marqueeList =
    activePartners.length > 0
      ? [
          ...activePartners,
          ...activePartners,
          ...activePartners,
          ...activePartners,
          ...activePartners,
          ...activePartners,
        ]
      : []

  // Rien à afficher (chargement initial, ou aucun partenaire actif avec
  // logo côté API) : on n'affiche plus de partenaires fictifs à la place —
  // on n'affiche simplement rien tant qu'il n'y a pas de vraie donnée.
  if (!isLoading && activePartners.length === 0) {
    return null
  }

  return (
    <Section className="relative overflow-hidden py-16 md:py-24 border-t border-border/60 bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-forest/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Header de la section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-forest">
            <Handshake className="size-3.5" />
            <span>Nos Partenaires</span>
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance">
            Ils accompagnent et soutiennent l'impact en{" "}
            <span className="text-forest">Casamance</span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Des partenaires technologiques, institutionnels et créatifs engagés aux côtés de Casa Impact pour accélérer les opportunités de notre jeunesse.
          </p>
        </div>

      </div>

      {/* Marquee Container with subtle gradient masks */}
      <div className="relative w-full overflow-hidden py-4 group">
        
        {/* Gradient edge masks for smooth fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent"
          aria-hidden
        />

        {/* Scrolling Track */}
        <div className="flex w-max items-center gap-6 sm:gap-8 animate-marquee hover:[animation-play-state:paused]">
          {marqueeList.map((partner, index) => {
            const logoUrl = getPartnerLogoUrl(partner)
            return (
            <a
              key={`${partner.id}-${index}`}
              href={partner.lien || "#"}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visiter le site officiel de ${partner.nom}`}
              className="group/card relative flex items-center justify-center gap-4 rounded-2xl border border-border bg-card/90 px-6 py-4 sm:px-8 sm:py-5 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-forest/40 hover:bg-card hover:shadow-lg hover:-translate-y-1 min-w-[220px] sm:min-w-[260px] cursor-pointer"
            >
              {/* Partner Logo */}
              <div className="relative h-12 w-32 sm:h-14 sm:w-36 shrink-0 flex items-center justify-center">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={`Logo officiel de ${partner.nom}`}
                    fill
                    sizes="(max-width: 768px) 140px, 180px"
                    className="object-contain transition-transform duration-300 group-hover/card:scale-105"
                  />
                ) : (
                  <span className="font-display font-bold text-sm text-foreground">
                    {partner.nom}
                  </span>
                )}
              </div>

              {/* Partner Name & Subtitle */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs sm:text-sm font-bold text-foreground group-hover/card:text-forest transition-colors truncate max-w-[130px]">
                    {partner.nom}
                  </span>
                  <ExternalLink className="size-3 text-muted-foreground group-hover/card:text-forest transition-colors opacity-0 group-hover/card:opacity-100 shrink-0" />
                </div>
                {partner.description && (
                  <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                    {partner.description}
                  </span>
                )}
              </div>
            </a>
            )
          })}
        </div>

      </div>

      {/* Footer CTA */}
      <div className="mt-10 sm:mt-12 text-center">
        <div className="inline-flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-2 border-border/80 bg-background/80 hover:bg-secondary hover:text-foreground"
          >
            <Link href="/contact">
              <span>Devenir partenaire</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
