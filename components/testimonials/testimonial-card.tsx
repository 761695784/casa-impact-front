"use client"

import React from "react"
import Image from "next/image"
import { Quote, Star, CheckCircle2, MapPin, Sparkles } from "lucide-react"
import type { Testimonial } from "@/types/models"
import { cn } from "@/lib/utils"

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

/**
 * Extrait intelligemment la région (Ziguinchor, Sédhiou, Kolda) depuis
 * le rôle, le contexte ou la relation programme.
 */
function extractRegion(t: Testimonial): string | null {
  const text = `${t.role_organisation || ""} ${t.contexte || ""} ${t.program?.region || ""} ${t.program?.localisation || ""}`.toLowerCase()
  if (text.includes("ziguinchor")) return "Ziguinchor"
  if (text.includes("sédhiou") || text.includes("sedhiou")) return "Sédhiou"
  if (text.includes("kolda")) return "Kolda"
  return null
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const imageUrl = testimonial.media?.[0]?.url || "/assets/team/placeholder.svg"
  const region = extractRegion(testimonial)
  const initials = testimonial.auteur
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <figure
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {/* Decorative ambient background highlight */}
      <div className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-gradient-to-br from-accent/15 via-primary/10 to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />

      <div>
        {/* Top Header: Rating stars, region badge & quotation mark */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {/* Stars */}
            <div className="flex items-center gap-0.5" aria-label="Note 5 étoiles">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-amber-400 text-amber-400 drop-shadow-xs"
                />
              ))}
            </div>

            {/* Region badge */}
            {region && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                <MapPin className="size-2.5 shrink-0" />
                {region}
              </span>
            )}
          </div>

          {/* Quotation icon */}
          <div className="flex size-9 items-center justify-center rounded-2xl bg-secondary/80 text-accent group-hover:bg-accent group-hover:text-forest transition-colors duration-300 shrink-0">
            <Quote className="size-4.5 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>

        {/* Testimonial Quote with bulletproof anti-overflow constraints */}
        <blockquote className="text-sm sm:text-base leading-relaxed text-foreground/90 font-medium font-sans break-words [overflow-wrap:anywhere] hyphens-auto">
          « {testimonial.citation} »
        </blockquote>

        {/* Contexte / Programme pill if present */}
        {testimonial.contexte && (
          <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-secondary/60 px-2.5 py-1 text-xs font-medium text-muted-foreground break-words [overflow-wrap:anywhere] max-w-full">
            <Sparkles className="size-3 text-accent shrink-0" />
            <span className="truncate">{testimonial.contexte}</span>
          </div>
        )}
      </div>

      {/* Author Profile Footer */}
      <figcaption className="mt-6 flex items-center gap-3.5 border-t border-border/80 pt-4">
        {/* Avatar with fallback */}
        <div className="relative size-12 overflow-hidden rounded-full bg-secondary ring-2 ring-accent/60 shadow-sm shrink-0">
          {testimonial.media?.[0]?.url ? (
            <Image
              src={imageUrl}
              alt={testimonial.auteur}
              fill
              sizes="48px"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-forest text-accent font-display font-bold text-sm">
              {initials || "CI"}
            </div>
          )}
        </div>

        {/* Author info with anti-overflow */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-display text-sm sm:text-base font-bold text-foreground truncate break-words [overflow-wrap:anywhere]">
              {testimonial.auteur}
            </p>
            <CheckCircle2
              className="size-3.5 text-primary shrink-0"
              aria-label="Témoignage vérifié"
            />
          </div>

          {testimonial.role_organisation && (
            <p className="text-xs font-semibold text-primary break-words [overflow-wrap:anywhere] line-clamp-2 mt-0.5">
              {testimonial.role_organisation}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  )
}
