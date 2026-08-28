"use client"

import Image from "next/image"
import { Quote } from "lucide-react"
import { useTestimonials } from "@/hooks/use-content"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TestimonialsGrid() {
  const { data: testimonials, isLoading } = useTestimonials()

  if (isLoading) return <CardGridSkeleton count={3} />

  if (!testimonials || testimonials.length === 0) {
    return (
      <EmptyState
        icon={<Quote className="size-6" />}
        title="Les premiers témoignages arrivent bientôt"
        description="Bénéficiaires, membres et partenaires partageront ici leur expérience du mouvement Casa Impact. Vous avez une histoire à raconter ?"
        action={
          <Button asChild>
            <Link href="/contact">Partager mon témoignage</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <figure key={t.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <Quote className="size-8 text-accent" aria-hidden="true" />
          <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">{t.contenu}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
            <div className="relative size-11 overflow-hidden rounded-full bg-secondary">
              <Image
                src={t.photo || "/assets/team/placeholder.svg"}
                alt={t.auteur}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.auteur}</p>
              {t.fonction ? <p className="text-xs text-muted-foreground">{t.fonction}</p> : null}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
