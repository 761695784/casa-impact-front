"use client"

import React from "react"
import Image from "next/image"
import { Quote, Sparkles, Star, CheckCircle2 } from "lucide-react"
import { useTestimonials } from "@/hooks/use-content"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { resolveMediaUrl } from "@/lib/format"
import Link from "next/link"

export function TestimonialsGrid() {
  // Le filtre "publié" est déjà appliqué côté service/backend — pas de refiltrage client.
  const { data: testimonials = [] } = useTestimonials()

  // Une liste réelle vide doit afficher un vrai état vide, jamais un
  // repli silencieux sur des données mock.
  if (testimonials.length === 0) {
    return (
      <EmptyState
        icon={<Quote className="size-6" />}
        title="Les premiers témoignages arrivent bientôt"
        description="Bénéficiaires, membres et partenaires partageront ici leur expérience de l'organisation Casa Impact. Vous avez une histoire à raconter ?"
        action={
          <Button asChild className="rounded-full bg-primary text-white">
            <Link href="/contact">Partager mon témoignage</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-10">
      {/*
        Pas de filtre par programme ici : sur l'index public,
        TestimonialController n'eager-charge jamais `program`/
        `application_call` (toujours null/absents) — un filtre bâti sur
        ce champ n'aurait donc jamais de catégorie à proposer.
      */}

      {/* Grid of Testimonial Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300"
          >
            {/* Top Row: Stars & Quote Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="size-6 text-accent/50 group-hover:text-accent transition-colors" />
            </div>

            {/* Quote Content — le champ réel est `citation` (pas `contenu`) */}
            <blockquote className="flex-1 text-sm sm:text-base leading-relaxed text-foreground/90 font-medium font-sans">
              « {t.citation} »
            </blockquote>

            {/* Author Profile Footer — pas de `photo` directe, image via `media` (premier élément) */}
            <figcaption className="mt-6 flex items-center gap-3.5 border-t border-border pt-4">
              <div className="relative size-12 overflow-hidden rounded-full bg-secondary ring-2 ring-accent/60 shadow-sm shrink-0">
                <Image
                  src={resolveMediaUrl(t.media?.[0]?.url) || "/assets/team/placeholder.svg"}
                  alt={t.auteur}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-display text-sm font-bold text-foreground truncate">
                    {t.auteur}
                  </p>
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                </div>
                {/* `fonction` + `organisation` n'existent plus séparément, fusionnés en `role_organisation` */}
                {t.role_organisation && (
                  <p className="text-xs font-semibold text-primary truncate">
                    {t.role_organisation}
                  </p>
                )}
              </div>
            </figcaption>

            {/*
              Pas de badge "Programme" ici : sur l'index public, la relation
              `program` n'est jamais eager-chargée (toujours null) — ce
              serait un badge mort qui ne s'afficherait jamais.
            */}
          </figure>
        ))}
      </div>
    </div>
  )
}
